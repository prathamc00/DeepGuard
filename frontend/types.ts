
// Forensic evidence from v2 API
export interface ForensicEvidence {
  fft_anomaly: boolean;
  fft_score: number;
  color_anomaly: boolean;
  color_score: number;
  noise_anomaly: boolean;
  noise_score: number;
  compression_artifacts: 'low' | 'medium' | 'high';
  compression_score: number;
}

// Similar case from RAG database
export interface SimilarCase {
  dataset: string;
  method: string;
  similarity: number;
  label: string;
}

// Full explanation from v2 API
export interface RAGExplanation {
  summary: string;
  confidence_reasoning: string;
  forensic_findings: string[];
  similar_cases_summary: string;
  similar_cases: SimilarCase[];
  forensic_evidence: ForensicEvidence;
  gradcam_url?: string;
}

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
  // v2 RAG fields
  ragExplanation?: RAGExplanation;
  forensicEvidence?: ForensicEvidence;
  similarCases?: SimilarCase[];
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

