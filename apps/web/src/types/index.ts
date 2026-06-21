export type Goal = 'cleaner' | 'safer' | 'storage' | 'work' | 'aesthetics';

export interface MarkerInfo {
  id: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  priority: number;
  title: string;
  description: string;
}

export type AppState = 'upload' | 'loading' | 'result' | 'error';
