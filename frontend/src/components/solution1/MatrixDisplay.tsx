import React from 'react';
import { type Position } from './types';
import { styles } from '../../styles/Solution1/turtle-styles';

interface MatrixDisplayProps {
  matrix: number[][];
  turtlePos: Position | null;
  visited: Set<string>;
  turtleImage: string;
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
