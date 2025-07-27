import { type Position,RouteResult } from './types';

// 1. เดินแบบ Zig-Zag 
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
  const rows = matrix.length;
  const cols = matrix[0].length;
  
  if (startPos.row >= rows || startPos.col >= cols || startPos.row < 0 || startPos.col < 0) {
    return [];
  }

  const path: Position[] = [];
  const visited = new Array(rows).fill(false).map(() => new Array(cols).fill(false));
  
  const directions = [
    [0, 1],   // ขวา
    [1, 0],   // ล่าง
    [0, -1],  // ซ้าย
    [-1, 0]   // บน
  ];
  
  let { row, col } = startPos;
  let dir = 0;
  let turnCount = 0; // นับจำนวนครั้งที่เลี้ยว
  let isFirstLoop = true; // ตรวจสอบว่าเป็นวงแรกหรือไม่
  
  path.push({ row, col });
  visited[row][col] = true;
  
  while (path.length < rows * cols) {
    let nextRow = row + directions[dir][0];
    let nextCol = col + directions[dir][1];
    
    let shouldTurn = false;
    
    // เงื่อนไขพิเศษสำหรับวงแรก
    if (isFirstLoop) {
      // รอบที่ 3 (กำลังเดินซ้าย)
      if (turnCount === 2 && dir === 2) {
        // ถ้า startPos.row > startPos.col (เช่น 5,1)
        if (startPos.row > startPos.col && col === startPos.col) {
          shouldTurn = true;
        }
        // ถ้า startPos.col > startPos.row (เช่น 1,5)
        else if (startPos.col > startPos.row && row === startPos.row) {
          shouldTurn = true;
        }
        // ถ้า startPos.row = startPos.col
        else if (startPos.row === startPos.col && row === startPos.row - 1 && col === startPos.col) {
          shouldTurn = true;
        }
      }
      // รอบที่ 4 (กำลังเดินขึ้น)
      else if (turnCount === 3 && dir === 3) {
        // เงื่อนไขเดิมสำหรับการเลี้ยวรอบที่ 4
        if (nextRow === startPos.row && nextCol === startPos.col - 1) {
          shouldTurn = true;
        }
      }
    }
    
    // เงื่อนไขปกติ: ชนขอบหรือช่องที่เคยเดินแล้ว
    if (!shouldTurn && (nextRow < 0 || nextRow >= rows || 
        nextCol < 0 || nextCol >= cols || 
        visited[nextRow][nextCol])) {
      shouldTurn = true;
    }
    
    if (shouldTurn) {
      // เลี้ยว
      dir = (dir + 1) % 4;
      turnCount++;
      
      // ถ้าเลี้ยวครบ 4 ครั้งแล้ว = จบวงแรก
      if (turnCount >= 4) {
        isFirstLoop = false;
      }
      
      // คำนวณตำแหน่งใหม่หลังเลี้ยว
      nextRow = row + directions[dir][0];
      nextCol = col + directions[dir][1];
    }
    
    // ตรวจสอบว่าสามารถเดินต่อได้หรือไม่
    if (nextRow >= 0 && nextRow < rows && 
        nextCol >= 0 && nextCol < cols && 
        !visited[nextRow][nextCol]) {
      row = nextRow;
      col = nextCol;
      path.push({ row, col });
      visited[row][col] = true;
    } else {
      // ถ้าเดินต่อไม่ได้หลังเลี้ยว ให้ลองเลี้ยวต่อ
      let attempts = 0;
      while (attempts < 4) {
        dir = (dir + 1) % 4;
        nextRow = row + directions[dir][0];
        nextCol = col + directions[dir][1];
        
        if (nextRow >= 0 && nextRow < rows && 
            nextCol >= 0 && nextCol < cols && 
            !visited[nextRow][nextCol]) {
          row = nextRow;
          col = nextCol;
          path.push({ row, col });
          visited[row][col] = true;
          break;
        }
        attempts++;
      }
      
      if (attempts >= 4) break; // ไม่มีทางไปแล้ว
    }
  }
  
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