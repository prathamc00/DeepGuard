
export interface AnalysisResult {
  isDeepfake: boolean;
  confidenceScore: number;
  explanation: string;
  artifactsDetected: string[];
  visualAnomalies: {
    location: string;
    description: string;
  }[];
  metadata: {
    fileName: string;
    fileType: string;
    timestamp: string;
  };
}

export interface ScanHistoryItem extends AnalysisResult {
  id: string;
  previewUrl: string;
}

export enum AppState {
  IDLE = 'IDLE',
  UPLOADING = 'UPLOADING',
  ANALYZING = 'ANALYZING',
  RESULT = 'RESULT',
  ERROR = 'ERROR'
}
