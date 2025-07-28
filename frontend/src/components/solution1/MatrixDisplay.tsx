import React from 'react';
import { type Position } from './types';
import { styles } from '../../styles/Solution1/turtle-styles';
interface MatrixDisplayProps {
  matrix: number[][];           // แมทริกซ์ 2 มิติ ตัวเลข
  turtlePos: Position | null;   // ตำแหน่งปัจจุบันของเต่า เช่น { row: 1, col: 2 }
  visited: Set<string>;         // เซ็ตของตำแหน่งที่เคยไปแล้ว เช่น '1-2', '2-3'
  turtleImage: string;          // path รูปภาพของเต่า
}

export const MatrixDisplay: React.FC<MatrixDisplayProps> = ({ matrix, turtlePos, visited, turtleImage }) => (
  <div style={styles.grid}>
    {matrix.map((row, r) =>
      row.map((cell, c) => (
        <div key={`${r}-${c}`} style={{ ...styles.cell, ...(visited.has(`${r}-${c}`) ? styles.cellVisited : {}) }}>
          {turtlePos?.row === r && turtlePos?.col === c ?
            <img src={turtleImage} alt="turtle" style={styles.turtle} /> : <strong>{cell}</strong>
          }
        </div>
      ))
    )}
  </div>
);

//ใช้ styles.cellVisited เพื่อเเสดงเส้นทางที่เต่าเคยไปแล้ว