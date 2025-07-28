import { type Position,RouteResult } from './types';

// 1. เดินแบบ Zig-Zag 
// เดินแบบขึ้น-ลงตามคอลัมน์ ซ้ายไปขวา 
export function calculateZigZagPath(matrix: number[][]): Position[] {
  if (!matrix || matrix.length === 0) return [];
  const path: Position[] = [];
  const rows = matrix.length;
  const cols = matrix[0].length;
  for (let col = 0; col < cols; col++) {
    if (col % 2 === 0) { for (let row = 0; row < rows; row++) path.push({ row, col }); }
    else { for (let row = rows - 1; row >= 0; row--) path.push({ row, col }); }
  }
  return path;
}


// 2. เดินตามเข็มนาฬิกา (Spiral Path)
export function calculateSpiralPath(matrix: number[][], startPos: Position): Position[] {
  // --- 1. การตั้งค่าเริ่มต้น ---
  const rows = matrix.length;
  const cols = matrix[0].length;
  
  // ตรวจสอบว่าจุดเริ่มต้นอยู่นอกขอบเขตของ matrix หรือไม่
  if (startPos.row >= rows || startPos.col >= cols || startPos.row < 0 || startPos.col < 0) {
    return []; // ถ้าอยู่นอกขอบเขต คืนค่า path ว่าง
  }

  const path: Position[] = []; // Array สำหรับเก็บเส้นทางการเดินทั้งหมด
  // สร้าง Array 2 มิติเพื่อติดตามช่องที่เคยเดินผ่านไปแล้ว (visited)
  const visited = new Array(rows).fill(false).map(() => new Array(cols).fill(false));
  
  // กำหนดทิศทางการเดิน 4 ทิศทาง (ขวา, ล่าง, ซ้าย, บน)
  const directions = [
    [0, 1],   // ขวา: แถวไม่เปลี่ยน, คอลัมน์ +1
    [1, 0],   // ล่าง: แถว +1, คอลัมน์ไม่เปลี่ยน
    [0, -1],  // ซ้าย: แถวไม่เปลี่ยน, คอลัมน์ -1
    [-1, 0]   // บน: แถว -1, คอลัมน์ไม่เปลี่ยน
  ];
  
  // --- 2. ตัวแปรควบคุมสถานะการเดิน ---
  let { row, col } = startPos; // ตำแหน่งปัจจุบัน, เริ่มจากจุดที่กำหนด
  let dir = 0; // ทิศทางปัจจุบัน (0=ขวา, 1=ล่าง, 2=ซ้าย, 3=บน)
  let turnCount = 0; // ตัวนับจำนวนครั้งที่เลี้ยว, ใช้สำหรับเงื่อนไขพิเศษในวงแรก
  let isFirstLoop = true; // Flag เพื่อตรวจสอบว่ายังอยู่ใน "วงแรก" ของก้นหอยหรือไม่
  
  // เพิ่มจุดเริ่มต้นเข้าไปใน path และทำเครื่องหมายว่าเคยเดินแล้ว
  path.push({ row, col });
  visited[row][col] = true;
  
  // --- 3. Loop การเดินหลัก ---
  // วนไปเรื่อยๆ จนกว่าจะเดินครบทุกช่อง (path.length เท่ากับจำนวนช่องทั้งหมดใน matrix)
  while (path.length < rows * cols) {
    // คำนวณตำแหน่งถัดไปตามทิศทางปัจจุบัน
    let nextRow = row + directions[dir][0];
    let nextCol = col + directions[dir][1];
    
    let shouldTurn = false; // Flag สำหรับตัดสินใจว่าต้องเลี้ยวหรือไม่
    
    // --- 4. ตรรกะการเลี้ยวแบบพิเศษ (สำหรับวงแรกเท่านั้น) ---
    // ส่วนนี้ซับซ้อนเพราะต้องจัดการการสร้างวงก้นหอยชั้นในสุดให้ถูกต้อง
    // เมื่อจุดเริ่มต้นไม่ได้อยู่ที่มุม
    if (isFirstLoop) {
      // กรณีที่เลี้ยวมา 2 ครั้งแล้ว และกำลังจะเดินไปทางซ้าย (dir === 2)
      if (turnCount === 2 && dir === 2) {
        // เงื่อนไขเหล่านี้ใช้เพื่อบังคับให้เลี้ยว "ขึ้น" ในจังหวะที่ถูกต้องเพื่อปิดวงแรก
        if (startPos.row > startPos.col && col === startPos.col) {
          shouldTurn = true;
        } else if (startPos.col > startPos.row && row === startPos.row) {
          shouldTurn = true;
        } else if (startPos.row === startPos.col && row === startPos.row - 1 && col === startPos.col) {
          shouldTurn = true;
        }
      }
      // กรณีที่เลี้ยวมา 3 ครั้งแล้ว และกำลังจะเดินขึ้น (dir === 3)
      else if (turnCount === 3 && dir === 3) {
        // บังคับให้เลี้ยว "ขวา" เมื่อเดินขึ้นมาถึงตำแหน่งที่เหมาะสมเพื่อปิดวง
        if (nextRow === startPos.row && nextCol === startPos.col - 1) {
          shouldTurn = true;
        }
      }
    }
    
    // --- 5. ตรรกะการเลี้ยวแบบปกติ ---
    // ถ้ายังไม่มีการตัดสินใจให้เลี้ยวจากเงื่อนไขพิเศษ, ให้ตรวจสอบเงื่อนไขปกติ
    // จะเลี้ยวเมื่อ: 1. ชนขอบ หรือ 2.เจอช่องที่เคยเดินแล้ว
    if (!shouldTurn && (
        nextRow < 0 || nextRow >= rows || 
        nextCol < 0 || nextCol >= cols || 
        visited[nextRow][nextCol]
    )) {
      shouldTurn = true;
    }
    
    // --- 6. การดำเนินการเลี้ยวและเคลื่อนที่ ---
    if (shouldTurn) {
      // เปลี่ยนทิศทาง: (0+1)%4=1, (1+1)%4=2, (2+1)%4=3, (3+1)%4=0
      dir = (dir + 1) % 4;
      turnCount++;
      
      // เมื่อเลี้ยวครบ 4 ครั้ง ถือว่าจบการสร้างวงแรก
      if (turnCount >= 4) {
        isFirstLoop = false;
      }
      
      // คำนวณตำแหน่งถัดไปอีกครั้งหลังจากเปลี่ยนทิศทางแล้ว
      nextRow = row + directions[dir][0];
      nextCol = col + directions[dir][1];
    }
    
    // ตรวจสอบว่าตำแหน่งถัดไป (หลังการตัดสินใจทั้งหมด) สามารถเดินไปได้หรือไม่
    if (
        nextRow >= 0 && nextRow < rows && 
        nextCol >= 0 && nextCol < cols && 
        !visited[nextRow][nextCol]
    ) {
      // ถ้าเดินได้, อัปเดตตำแหน่งปัจจุบัน
      row = nextRow;
      col = nextCol;
      // เพิ่มตำแหน่งใหม่ลงใน path และทำเครื่องหมายว่าเดินแล้ว
      path.push({ row, col });
      visited[row][col] = true;
    } else {
      // --- 7. การจัดการทางตัน ---
      // กรณีที่แม้แต่เลี้ยวแล้วก็ยังเดินต่อไม่ได้ (เช่น ติดมุม)
      let attempts = 0;
      // พยายามเลี้ยวหาทางไปต่อ
      while (attempts < 4) {
        dir = (dir + 1) % 4;
        nextRow = row + directions[dir][0];
        nextCol = col + directions[dir][1];
        
        // ถ้าหาทางไปต่อได้
        if (
            nextRow >= 0 && nextRow < rows && 
            nextCol >= 0 && nextCol < cols && 
            !visited[nextRow][nextCol]
        ) {
          row = nextRow;
          col = nextCol;
          path.push({ row, col });
          visited[row][col] = true;
          break; // ออกจาก loop การหาทาง
        }
        attempts++;
      }
      
      // ถ้าลองครบ 4 ทิศแล้วยังไปไหนไม่ได้ แสดงว่าเดินครบแล้ว
      if (attempts >= 4) break; 
    }
  }
  
  // คืนค่าเส้นทางการเดินทั้งหมด
  return path;
}


// 3. ค้นหาเส้นทาง (Find Path)
// --- LOGIC FUNCTIONS ---

/**
 * ค้นหาเส้นทางจาก startValue ไปยัง endValue ในแนวเส้นตรง (N, E, S, W)
 * @param matrix - เมทริกซ์ตัวเลข
 * @param startValue - ค่าเริ่มต้นที่ต้องการค้นหา
 * @param endValue - ค่าสิ้นสุดของเส้นทาง
 * @returns อาร์เรย์ของผลลัพธ์เส้นทาง (RouteResult)
 */
export function findAndLabelRoutes(matrix: number[][], startValue: number, endValue: number): RouteResult[] {
  // ใช้ Omit เพื่อสร้าง array ชั่วคราวก่อนเติม isShortest/isLongest
  const foundPaths: Omit<RouteResult, 'isShortest' | 'isLongest'>[] = [];
  const rows = matrix.length;
  if (rows === 0) return [];
  const cols = matrix[0].length;

  // วนลูปเพื่อหาตำแหน่งทั้งหมดของ startValue
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (matrix[r][c] === startValue) {
        const startPosition: Position = { row: r, col: c };

        // --- 1. ค้นหาทิศเหนือ (North) ---
        // สร้างเส้นทางตั้งต้นสำหรับทิศนี้
        const pathN_Coords_Base: Position[] = [startPosition];
        const pathN_Values_Base: number[] = [startValue];
        for (let i = r - 1; i >= 0; i--) {
          pathN_Coords_Base.push({ row: i, col: c });
          pathN_Values_Base.push(matrix[i][c]);
          // ถ้าเจอ endValue, ให้บันทึกเส้นทาง ณ จุดนั้น แต่ค้นหาต่อไป
          if (matrix[i][c] === endValue) {
            foundPaths.push({
              direction: 'N',
              pathCoords: [...pathN_Coords_Base], // สร้างสำเนาของ path ปัจจุบัน
              pathValues: [...pathN_Values_Base],
            });
            // **สำคัญ:** ไม่ใช้ break เพื่อให้ค้นหา endValue อื่นๆ ในทิศเดียวกันต่อ
          }
        }

        // --- 2. ค้นหาทิศตะวันออก (East) ---
        const pathE_Coords_Base: Position[] = [startPosition];
        const pathE_Values_Base: number[] = [startValue];
        for (let i = c + 1; i < cols; i++) {
          pathE_Coords_Base.push({ row: r, col: i });
          pathE_Values_Base.push(matrix[r][i]);
          if (matrix[r][i] === endValue) {
            foundPaths.push({
              direction: 'E',
              pathCoords: [...pathE_Coords_Base],
              pathValues: [...pathE_Values_Base],
            });
          }
        }

        // --- 3. ค้นหาทิศใต้ (South) ---
        const pathS_Coords_Base: Position[] = [startPosition];
        const pathS_Values_Base: number[] = [startValue];
        for (let i = r + 1; i < rows; i++) {
          pathS_Coords_Base.push({ row: i, col: c });
          pathS_Values_Base.push(matrix[i][c]);
          if (matrix[i][c] === endValue) {
            foundPaths.push({
              direction: 'S',
              pathCoords: [...pathS_Coords_Base],
              pathValues: [...pathS_Values_Base],
            });
          }
        }

        // --- 4. ค้นหาทิศตะวันตก (West) ---
        const pathW_Coords_Base: Position[] = [startPosition];
        const pathW_Values_Base: number[] = [startValue];
        for (let i = c - 1; i >= 0; i--) {
          pathW_Coords_Base.push({ row: r, col: i });
          pathW_Values_Base.push(matrix[r][i]);
          if (matrix[r][i] === endValue) {
            foundPaths.push({
              direction: 'W',
              pathCoords: [...pathW_Coords_Base],
              pathValues: [...pathW_Values_Base],
            });
          }
        }
      }
    }
  }

  if (foundPaths.length === 0) {
    return []; // ไม่พบเส้นทางใดๆ
  }

  // หาเส้นทางที่สั้นที่สุดและยาวที่สุด
  const pathLengths = foundPaths.map(p => p.pathCoords.length);
  const minLength = Math.min(...pathLengths);
  const maxLength = Math.max(...pathLengths);

  // กำหนด flag isShortest และ isLongest แล้วคืนค่าผลลัพธ์ทั้งหมด
  return foundPaths.map(p => ({
    ...p, // คัดลอก direction, pathCoords, pathValues
    isShortest: p.pathCoords.length === minLength,
    isLongest: p.pathCoords.length === maxLength,
  }));
}