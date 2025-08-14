export interface AnalysisResult {
  id: string
  status: 'processing' | 'complete' | 'failed'
  user_id: string
  created_at?: string
  updated_at?: string
  analysis_results?: {
    status?: string
    message?: string
    outputs?: {
      [key: string]: string
    }
    metrics?: {
      edge_similarity?: {
        mean: number
        std: number
        min: number
        max: number
        count: number
      }
      total_frames?: number
    }
  }
  error_log?: string
}

export interface AnalysisSummary {
  id: string
  status: string
  user_id: string
  analysis_results?: {
    status?: string
    message?: string
    outputs?: {
      [key: string]: string
    }
    metrics?: {
      edge_similarity?: {
        mean: number
        std: number
        min: number
        max: number
        count: number
      }
      total_frames?: number
    }
  }
  error_log?: string
}

export interface AuthResponse {
  access_token: string
  token_type: string
}

export interface UploadResponse {
  id: string
}