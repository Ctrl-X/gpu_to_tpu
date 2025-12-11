export type DiffType = 'unchanged' | 'added' | 'removed' | 'empty';

export interface DiffLine {
  lineNumber: number | null;
  content: string;
  type: DiffType;
}

export interface DiffRow {
  left: DiffLine;
  right: DiffLine;
}

export interface WorkloadMetrics {
  throughputGpu: string;
  throughputTpu: string;
  costGpu: string;
  costTpu: string;
  effort: 'Low' | 'Medium' | 'High';
}

export interface Template {
  id: string;
  name: string;
  description: string;
  metrics: WorkloadMetrics;
  tips: string[];
  filename: string;
  language: string;
  gpuCode: string;
  tpuCode: string;
}