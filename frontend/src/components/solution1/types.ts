export interface Position {
  row: number;
  col: number;
}

// อัปเดต: เพิ่ม pathCoords สำหรับการวาดภาพ และ pathValues สำหรับแสดงผล
export type RouteResult = {
  direction: 'N' | 'E' | 'S' | 'W';
  pathCoords: Position[]; // Path with row/col coordinates
  pathValues: number[];   // Path with matrix values
  isShortest: boolean;
  isLongest: boolean;
};

// อัปเดต: เพิ่ม type และ payload เพื่อให้ Log เป็นแบบ Interactive
export interface LogEntry {
  timestamp: string;
  message: string;
  type?: 'info' | 'route';
  payload?: RouteResult;
}

export interface AnimatedTurtle {
  id: string; // ID เฉพาะตัว (เช่น index)
  path: Position[];
  currentStep: number;
  position: Position | null;
  trailColor: string; // สีสำหรับเส้นทาง ('green', 'red', 'blue')
}