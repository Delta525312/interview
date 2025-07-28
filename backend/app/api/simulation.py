# --- 1. Import Libraries ---
import logging
import time
import asyncio
import aiohttp
import os
from typing import List
from fastapi import APIRouter, Request, BackgroundTasks, status, WebSocket, WebSocketDisconnect
from fastapi.responses import JSONResponse, PlainTextResponse

# --- 2. FastAPI Router Setup ---
# สร้าง Router สำหรับจัดกลุ่ม API ที่เกี่ยวกับการจำลอง
router = APIRouter(
    prefix="/api/v1/simulation",
    tags=["Rate Limit Simulation"],
)

# --- 3. WebSocket & Control Logic ---
# คลาสสำหรับจัดการการเชื่อมต่อ WebSocket ทั้งหมด
class ConnectionManager:
    def __init__(self):
        # เก็บรายการ WebSocket ที่เชื่อมต่ออยู่
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        # เมื่อมี client ใหม่เชื่อมต่อเข้ามา
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        # เมื่อ client ตัดการเชื่อมต่อ
        self.active_connections.remove(websocket)

    async def broadcast_json(self, data: dict):
        # ส่งข้อมูล (JSON) ไปยังทุก client ที่เชื่อมต่ออยู่
        for connection in self.active_connections:
            try:
                await connection.send_json(data)
            except Exception:
                pass

# สร้าง instance ของ ConnectionManager เพื่อใช้งาน
manager = ConnectionManager()

# คลาสสำหรับจัดการ Log ที่จะส่งข้อมูลผ่าน WebSocket
class WebSocketLogHandler(logging.Handler):
    def __init__(self, manager: ConnectionManager):
        super().__init__()
        self.manager = manager
        self.formatter = None

    # เมื่อมี Log เกิดขึ้น, ฟังก์ชันนี้จะถูกเรียก
    def emit(self, record: logging.LogRecord):
        if self.formatter:
            # จัดรูปแบบ Log ให้อยู่ในรูป JSON
            log_entry = {
                "timestamp": self.formatter.formatTime(record, self.formatter.datefmt),
                "level": record.levelname,
                "message": record.getMessage()
            }
            # ส่ง Log ไปยัง client ผ่าน WebSocket
            asyncio.create_task(self.manager.broadcast_json(log_entry))

# สร้าง Event เพื่อเป็นสัญญาณให้ Task ต่างๆ หยุดทำงาน
simulation_stop_event = asyncio.Event()

# --- 4. Constants & Global State ---
ECHO_RATE_LIMIT = 512       # ลิมิตของ Echo Service (รับได้ 512 ครั้ง/นาที)
THROTTLE_LIMIT = 4096       # ลิมิตของ Throttle Service (ส่งต่อได้ 4096 ครั้ง/นาที)
# ตารางการยิง request ในแต่ละนาที (นาทีที่ 1: 16 ครั้ง, นาทีที่ 2: 256 ครั้ง, ...)
CALL_SCHEDULE = {1: 16, 2: 256, 3: 4096, 4: 65536}
LOG_FILE = 'simulation.log' # ชื่อไฟล์สำหรับบันทึก Log

request_queue = asyncio.Queue() # คิวสำหรับพัก request ที่เข้ามา
# ตัวแปรสำหรับนับจำนวน request ของ Echo Service
echo_request_counts = {'count': 0, 'window_start_time': time.time()}
# ตัวแปรสำหรับเก็บ Task ของ Throttle Processor
THROTTLE_PROCESSOR_TASK = None

# --- 5. Logger Setup ---
# หากมีไฟล์ Log เก่าอยู่ ให้ลบทิ้งเมื่อเริ่มโปรแกรม
if os.path.exists(LOG_FILE):
    os.remove(LOG_FILE)

# ตั้งค่า Logger หลักของแอปพลิเคชัน
logger = logging.getLogger("simulation_logger")
logger.setLevel(logging.INFO)
formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')

# Handler สำหรับแสดง Log บน Console
ch = logging.StreamHandler()
ch.setFormatter(formatter)
logger.addHandler(ch)

# Handler สำหรับบันทึก Log ลงไฟล์
fh = logging.FileHandler(LOG_FILE)
fh.setFormatter(formatter)
logger.addHandler(fh)

# Handler สำหรับส่ง Log ผ่าน WebSocket
ws_handler = WebSocketLogHandler(manager)
ws_handler.setFormatter(formatter)
logger.addHandler(ws_handler)

# ทำให้ Log การเข้าถึงของ Uvicorn ถูกส่งไปที่ WebSocket และไฟล์ด้วย
uvicorn_access_logger = logging.getLogger("uvicorn.access")
uvicorn_access_logger.addHandler(ws_handler)
uvicorn_access_logger.addHandler(fh)

# --- 6. Background Tasks ---

# Task ที่ทำงานเบื้องหลังเพื่อดึง request จากคิวและส่งต่อไปยัง Echo Service
async def throttle_processor(base_url: str):
    """Task that reads requests from the queue and forwards them to the echo service based on the quota."""
    sent_count = 0
    window_start_time = time.time()
    logger.info("Throttle processor started.")

    async with aiohttp.ClientSession() as session:
        # ทำงานวนไปเรื่อยๆ จนกว่าจะได้รับสัญญาณให้หยุด
        while not simulation_stop_event.is_set():
            current_time = time.time()
            # รีเซ็ตตัวนับทุกๆ 60 วินาที (1 นาที)
            if current_time - window_start_time >= 60:
                sent_count = 0
                window_start_time = current_time

            # ถ้ายังส่ง request ได้ไม่เกินลิมิต (THROTTLE_LIMIT)
            if sent_count < THROTTLE_LIMIT:
                try:
                    # พยายามดึง item จากคิว รอไม่เกิน 1 วินาที
                    data = await asyncio.wait_for(request_queue.get(), timeout=1.0)
                    if simulation_stop_event.is_set(): 
                        request_queue.task_done()
                        break
                    
                    call_id = data.get('id', 'N/A')
                    logger.info(f"[Throttle] Forwarding ID {call_id} to Echo Service.")
                    
                    # ส่ง request ต่อไปยัง /echo endpoint
                    async with session.post(f"{base_url}api/v1/simulation/echo", json=data, timeout=10) as response:
                        logger.info(f"[Throttle] Response for ID {call_id} from Echo Service: {response.status}")

                    sent_count += 1
                    request_queue.task_done()
                except asyncio.TimeoutError:
                    # ถ้าไม่มี item ในคิวใน 1 วินาที ก็ทำรอบต่อไป
                    continue
                except aiohttp.ClientError as e:
                    logger.error(f"[Throttle] Failed to send request for ID {data.get('id', 'N/A')}: {e}")
            else:
                # ถ้าส่งครบลิมิตแล้ว ให้รอจนกว่าจะครบนาที
                sleep_time = max(0, 60 - (current_time - window_start_time))
                try:
                    await asyncio.wait_for(simulation_stop_event.wait(), timeout=sleep_time)
                except asyncio.TimeoutError:
                    pass
    logger.warning("[Throttle] Processor has been stopped.")

# ฟังก์ชันสำหรับยิง request 1 ครั้งและบันทึกผล
async def call_and_log(session, url, payload):
    """Fires a single request and logs the outcome as per the requirements."""
    call_id = payload['id']
    logger.info(f"[Caller] Calling Throttle Service for ID {call_id}.")
    try:
        async with session.post(url, json=payload) as response:
            response_data = await response.json()
            logger.info(f"[Caller] Received response for ID {call_id} from Throttle Service: Status {response.status}, Body: {response_data}")
    except Exception as e:
        logger.error(f"[Caller] Error calling Throttle Service for ID {call_id}: {e}")

# ฟังก์ชันสำหรับสร้าง Task การยิง request ทั้งหมดใน 1 นาที
async def run_single_minute(session, base_url, minute, num_calls, start_id):
    """Uses call_and_log to log each call separately."""
    logger.info(f"\n--- [Caller] Minute {minute} starting: sending {num_calls} calls ---")
    tasks = []
    for i in range(num_calls):
        if simulation_stop_event.is_set():
            logger.warning(f"[Caller] Stopping minute {minute} task creation.")
            break
        
        call_id = start_id + i
        payload = {"id": call_id, "data": f"This is call number {call_id}"}
        url = f"{base_url}api/v1/simulation/throttle"
        
        # สร้าง Task สำหรับยิง request แต่ละครั้ง
        task = asyncio.create_task(call_and_log(session, url, payload))
        tasks.append(task)
    
    if tasks:
        # รอให้ request ทั้งหมดในนาทีนี้ทำงานเสร็จ
        await asyncio.gather(*tasks)

# ตรรกะหลักในการจำลองสถานการณ์ ทำหน้าที่เป็น "ผู้เรียก" (Caller)
async def run_simulation_logic(base_url: str, mode: int = 0):
    """Main logic for firing requests according to the defined schedule."""
    logger.info(f"=== [Caller] Starting simulation mode {mode} ===")
    
    # เคลียร์คิวเผื่อมีของเก่าค้างอยู่
    while not request_queue.empty():
        request_queue.get_nowait()
        request_queue.task_done()

    async with aiohttp.ClientSession() as session:
        call_id_counter = 1
        # เลือกตารางการยิง request ตาม mode ที่รับมา
        schedule = CALL_SCHEDULE if mode == 0 else {mode: CALL_SCHEDULE.get(mode, 0)}

        # วนลูปตามตารางเวลา
        for minute, num_calls in schedule.items():
            if simulation_stop_event.is_set(): break
            
            # เรียกฟังก์ชันเพื่อยิง request ตามจำนวนของนาทีนั้นๆ
            await run_single_minute(session, base_url, minute, num_calls, call_id_counter)
            call_id_counter += num_calls

            if simulation_stop_event.is_set(): break
            
            # รอให้ครบ 1 นาทีก่อนจะเริ่มนาทีถัดไป
            elapsed_minute_time = (time.time() - echo_request_counts['window_start_time']) % 60
            wait_time = max(0, 60 - elapsed_minute_time)
            if wait_time > 0:
                try:
                    await asyncio.wait_for(simulation_stop_event.wait(), timeout=wait_time)
                except asyncio.TimeoutError:
                    pass

    if simulation_stop_event.is_set():
        logger.warning("=== [Caller] Simulation was stopped by user ===")
    else:
        logger.info(f"=== [Caller] Simulation mode {mode} completed ===")
    
    # ส่งสัญญาณว่าการจำลองจบแล้วผ่าน WebSocket
    await manager.broadcast_json({"level": "SYSTEM", "message": "SIMULATION_ENDED"})


# --- 7. API Endpoints ---

# Endpoint ของ Echo Service ที่มี Rate Limit ของตัวเอง
@router.post("/echo", status_code=status.HTTP_200_OK)
async def echo_service_endpoint(request: Request):
    """Echo Service that returns an ID and message based on conditions."""
    global echo_request_counts
    current_time = time.time()
    data = await request.json()
    call_id = data.get('id', 'N/A')

    # ใช้ Lock เพื่อป้องกันการนับพลาดเมื่อมี request เข้ามาพร้อมกัน
    async with asyncio.Lock():
        # รีเซ็ตตัวนับทุกๆ 60 วินาที
        if current_time - echo_request_counts['window_start_time'] >= 60:
            echo_request_counts = {'count': 1, 'window_start_time': current_time}
        else:
            echo_request_counts['count'] += 1
        count = echo_request_counts['count']
        
        logger.info(f"[Echo] Received ID {call_id}. Current capacity: {count}/{ECHO_RATE_LIMIT}.")
        
        # ถ้าจำนวน request เกินลิมิต
        if count > ECHO_RATE_LIMIT:
            logger.warning(f"[Echo] Exceeding limit for ID {call_id}. Returning 429.")
            # ตอบกลับด้วยสถานะ 429 Too Many Requests
            return JSONResponse(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                content={"message": "Exceeding Limit", "id": call_id}
            )
        
        # ถ้าไม่เกินลิมิต ตอบกลับข้อมูลเดิมไป
        logger.info(f"[Echo] Echoing back data for ID {call_id}.")
        return JSONResponse(status_code=status.HTTP_200_OK, content=data)

# Endpoint ของ Throttle Service ที่ทำหน้าที่รับ request แล้วนำไปใส่คิว
@router.post("/throttle", status_code=status.HTTP_202_ACCEPTED)
async def throttle_service_endpoint(request: Request):
    data = await request.json()
    await request_queue.put(data)
    logger.info(f"[Throttle] Queued ID {data.get('id', 'N/A')}. Queue size: {request_queue.qsize()}")
    # ตอบกลับทันทีว่ารับเรื่องแล้ว (202 Accepted)
    return {"message": "Request queued", "id": data.get('id')}

# Endpoint สำหรับเริ่มการจำลอง
@router.post("/start-simulation", status_code=status.HTTP_202_ACCEPTED)
async def start_simulation(request: Request, background_tasks: BackgroundTasks, mode: int = 0):
    global THROTTLE_PROCESSOR_TASK
    base_url = str(request.base_url)

    # เคลียร์สัญญาณหยุด (ถ้ามี) เพื่อให้ Task เริ่มทำงานได้
    simulation_stop_event.clear()

    # ถ้า Throttle Processor ยังไม่เคยรันหรือรันเสร็จไปแล้ว ให้สร้าง Task ใหม่
    if THROTTLE_PROCESSOR_TASK is None or THROTTLE_PROCESSOR_TASK.done():
        THROTTLE_PROCESSOR_TASK = asyncio.create_task(throttle_processor(base_url=base_url))
    
    # สั่งให้ `run_simulation_logic` ทำงานเบื้องหลัง
    background_tasks.add_task(run_simulation_logic, base_url=base_url, mode=mode)
    return {"message": f"Simulation started in background with mode={mode}."}

# Endpoint สำหรับหยุดการจำลอง
@router.post("/stop-simulation", status_code=status.HTTP_200_OK)
async def stop_simulation():
    """Endpoint for stopping the Simulation, clearing the Queue, and clearing the Log file."""
    if not simulation_stop_event.is_set():
        logger.warning(">>> Stop request received. Signalling all tasks to stop. <<<")
        # ตั้งค่า Event เพื่อส่งสัญญาณให้ทุก Task หยุด
        simulation_stop_event.set()
    
    # ล้าง request ที่ค้างอยู่ในคิวทั้งหมด
    logger.info("[System] Clearing any remaining requests in the queue...")
    cleared_count = 0
    while not request_queue.empty():
        try:
            request_queue.get_nowait()
            request_queue.task_done()
            cleared_count += 1
        except asyncio.QueueEmpty:
            break
    if cleared_count > 0:
        logger.info(f"[System] Cleared {cleared_count} items from the request queue.")

    # ล้างเนื้อหาในไฟล์ Log
    if os.path.exists(LOG_FILE):
        try:
            open(LOG_FILE, 'w').close()
            logger.info(f"Log file '{LOG_FILE}' has been cleared.")
        except IOError as e:
            logger.error(f"Could not clear log file: {e}")

    return {"message": "Stop signal sent. All tasks will halt, queue and logs will be cleared."}

# Endpoint สำหรับการเชื่อมต่อ WebSocket
@router.websocket("/ws/logs")
async def websocket_endpoint(websocket: WebSocket):
    # เพิ่ม client ใหม่เข้าไปใน manager
    await manager.connect(websocket)
    try:
        # รอรับข้อมูล (แต่ในเคสนี้เราใช้แค่ส่งอย่างเดียว)
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        # ถ้า client ตัดการเชื่อมต่อ ให้ออกจาก manager
        manager.disconnect(websocket)

# Endpoint สำหรับดึงข้อมูล Log ทั้งหมดจากไฟล์
@router.get("/logs", response_class=PlainTextResponse)
async def get_logs():
    if not os.path.exists(LOG_FILE):
        return PlainTextResponse("Log file not found.", status_code=404)
    with open(LOG_FILE, 'r', encoding='utf-8') as f:
        return PlainTextResponse(f.read())