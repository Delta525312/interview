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
router = APIRouter(
    prefix="/api/v1/simulation",
    tags=["Rate Limit Simulation"],
)

# --- 3. WebSocket & Control Logic ---
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []
    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)
    async def broadcast_json(self, data: dict):
        for connection in self.active_connections:
            try:
                await connection.send_json(data)
            except Exception:
                pass

manager = ConnectionManager()

class WebSocketLogHandler(logging.Handler):
    def __init__(self, manager: ConnectionManager):
        super().__init__()
        self.manager = manager
        self.formatter = None
    def emit(self, record: logging.LogRecord):
        if self.formatter:
            log_entry = {
                "timestamp": self.formatter.formatTime(record, self.formatter.datefmt),
                "level": record.levelname,
                "message": record.getMessage()
            }
            asyncio.create_task(self.manager.broadcast_json(log_entry))

simulation_stop_event = asyncio.Event()

# --- 4. Constants & Global State ---
ECHO_RATE_LIMIT = 512
THROTTLE_LIMIT = 4096
CALL_SCHEDULE = {1: 16, 2: 256, 3: 4096, 4: 65536}
LOG_FILE = 'simulation.log'

request_queue = asyncio.Queue()
echo_request_counts = {'count': 0, 'window_start_time': time.time()}
THROTTLE_PROCESSOR_TASK = None

# --- 5. Logger Setup ---
if os.path.exists(LOG_FILE):
    os.remove(LOG_FILE)

logger = logging.getLogger("simulation_logger")
logger.setLevel(logging.INFO)
formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')

ch = logging.StreamHandler()
ch.setFormatter(formatter)
logger.addHandler(ch)

fh = logging.FileHandler(LOG_FILE)
fh.setFormatter(formatter)
logger.addHandler(fh)

ws_handler = WebSocketLogHandler(manager)
ws_handler.setFormatter(formatter)
logger.addHandler(ws_handler)

uvicorn_access_logger = logging.getLogger("uvicorn.access")
uvicorn_access_logger.addHandler(ws_handler)
uvicorn_access_logger.addHandler(fh)

# --- 6. Background Tasks ---

async def throttle_processor(base_url: str):
    """Task that reads requests from the queue and forwards them to the echo service based on the quota."""
    sent_count = 0
    window_start_time = time.time()
    logger.info("Throttle processor started.")

    async with aiohttp.ClientSession() as session:
        while not simulation_stop_event.is_set():
            current_time = time.time()
            if current_time - window_start_time >= 60:
                sent_count = 0
                window_start_time = current_time

            if sent_count < THROTTLE_LIMIT:
                try:
                    data = await asyncio.wait_for(request_queue.get(), timeout=1.0)
                    if simulation_stop_event.is_set(): 
                        request_queue.task_done() # Mark task as done before breaking
                        break
                    
                    call_id = data.get('id', 'N/A')
                    logger.info(f"[Throttle] Forwarding ID {call_id} to Echo Service.")
                    
                    async with session.post(f"{base_url}api/v1/simulation/echo", json=data, timeout=10) as response:
                        logger.info(f"[Throttle] Response for ID {call_id} from Echo Service: {response.status}")

                    sent_count += 1
                    request_queue.task_done()
                except asyncio.TimeoutError:
                    continue
                except aiohttp.ClientError as e:
                    logger.error(f"[Throttle] Failed to send request for ID {data.get('id', 'N/A')}: {e}")
            else:
                sleep_time = max(0, 60 - (current_time - window_start_time))
                try:
                    await asyncio.wait_for(simulation_stop_event.wait(), timeout=sleep_time)
                except asyncio.TimeoutError:
                    pass
    logger.warning("[Throttle] Processor has been stopped.")

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
        
        task = asyncio.create_task(call_and_log(session, url, payload))
        tasks.append(task)
    
    if tasks:
        await asyncio.gather(*tasks)

async def run_simulation_logic(base_url: str, mode: int = 0):
    """Main logic for firing requests according to the defined schedule."""
    logger.info(f"=== [Caller] Starting simulation mode {mode} ===")
    
    while not request_queue.empty():
        request_queue.get_nowait()
        request_queue.task_done()

    async with aiohttp.ClientSession() as session:
        call_id_counter = 1
        schedule = CALL_SCHEDULE if mode == 0 else {mode: CALL_SCHEDULE.get(mode, 0)}

        for minute, num_calls in schedule.items():
            if simulation_stop_event.is_set(): break
            
            await run_single_minute(session, base_url, minute, num_calls, call_id_counter)
            call_id_counter += num_calls

            if simulation_stop_event.is_set(): break
            
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
    
    await manager.broadcast_json({"level": "SYSTEM", "message": "SIMULATION_ENDED"})


# --- 7. API Endpoints ---

@router.post("/echo", status_code=status.HTTP_200_OK)
async def echo_service_endpoint(request: Request):
    """Echo Service that returns an ID and message based on conditions."""
    global echo_request_counts
    current_time = time.time()
    data = await request.json()
    call_id = data.get('id', 'N/A')

    async with asyncio.Lock():
        if current_time - echo_request_counts['window_start_time'] >= 60:
            echo_request_counts = {'count': 1, 'window_start_time': current_time}
        else:
            echo_request_counts['count'] += 1
        count = echo_request_counts['count']
        
        logger.info(f"[Echo] Received ID {call_id}. Current capacity: {count}/{ECHO_RATE_LIMIT}.")
        
        if count > ECHO_RATE_LIMIT:
            logger.warning(f"[Echo] Exceeding limit for ID {call_id}. Returning 429.")
            return JSONResponse(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                content={"message": "Exceeding Limit", "id": call_id}
            )
        
        logger.info(f"[Echo] Echoing back data for ID {call_id}.")
        return JSONResponse(status_code=status.HTTP_200_OK, content=data)

@router.post("/throttle", status_code=status.HTTP_202_ACCEPTED)
async def throttle_service_endpoint(request: Request):
    data = await request.json()
    await request_queue.put(data)
    logger.info(f"[Throttle] Queued ID {data.get('id', 'N/A')}. Queue size: {request_queue.qsize()}")
    return {"message": "Request queued", "id": data.get('id')}

@router.post("/start-simulation", status_code=status.HTTP_202_ACCEPTED)
async def start_simulation(request: Request, background_tasks: BackgroundTasks, mode: int = 0):
    global THROTTLE_PROCESSOR_TASK
    base_url = str(request.base_url)

    simulation_stop_event.clear()

    if THROTTLE_PROCESSOR_TASK is None or THROTTLE_PROCESSOR_TASK.done():
        THROTTLE_PROCESSOR_TASK = asyncio.create_task(throttle_processor(base_url=base_url))
    
    background_tasks.add_task(run_simulation_logic, base_url=base_url, mode=mode)
    return {"message": f"Simulation started in background with mode={mode}."}

@router.post("/stop-simulation", status_code=status.HTTP_200_OK)
async def stop_simulation():
    """Endpoint for stopping the Simulation, clearing the Queue, and clearing the Log file."""
    if not simulation_stop_event.is_set():
        logger.warning(">>> Stop request received. Signalling all tasks to stop. <<<")
        simulation_stop_event.set()
    
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

    if os.path.exists(LOG_FILE):
        try:
            open(LOG_FILE, 'w').close()
            logger.info(f"Log file '{LOG_FILE}' has been cleared.")
        except IOError as e:
            logger.error(f"Could not clear log file: {e}")

    return {"message": "Stop signal sent. All tasks will halt, queue and logs will be cleared."}

@router.websocket("/ws/logs")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)

@router.get("/logs", response_class=PlainTextResponse)
async def get_logs():
    if not os.path.exists(LOG_FILE):
        return PlainTextResponse("Log file not found.", status_code=404)
    with open(LOG_FILE, 'r', encoding='utf-8') as f:
        return PlainTextResponse(f.read())
