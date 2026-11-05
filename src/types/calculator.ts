import { AngleMode } from '../utils/mathParser';

export interface CalculationRecord {
  id: string;
  timestamp: number;
  expression: string;
  result: number;
  formattedResult: string;
  angleMode: AngleMode;
}

export interface MemoryState {
  value: number;
  isSet: boolean;
}

export type SidebarTab = 'history' | 'constants' | 'converter';
