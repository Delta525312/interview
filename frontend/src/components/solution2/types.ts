export interface TreeNode {
  id: string;
  children: TreeNode[];
  parent: TreeNode | null;
  capacity: number;
  walnutsStored: number;
  uid: string; 
}

export interface LogEntry {
  timestamp: string;
  message: string;
  type: 'info' | 'error' | 'success';
}

export type InputMode = 'builder' | 'raw';
export type ThemeMode = 'light' | 'dark';

export type AnimationStep = {
    type: 'move' | 'pick' | 'drop';
    path?: string;
};
