export interface AudioAnalysisResult {
  duration_seconds: number;
  sample_rate: number;
  channels: number;
  bit_depth: number | null;
  bitrate: number | null;
  format: string;
  codec: string;
  has_cover_art: boolean;
  loudness_lufs: number | null;
  peak_db: number | null;
  dynamic_range_db: number | null;
  is_clipping: boolean;
}

export interface SilenceRegion {
  start_seconds: number;
  end_seconds: number;
  duration_seconds: number;
}

export interface SilenceDetectionResult {
  job_id: string;
  silence_threshold_db: number;
  regions: SilenceRegion[];
  total_silence_seconds: number;
}

export interface WaveformDataResult {
  job_id: string;
  samples: number[];
  sample_count: number;
  channels: number;
  duration_seconds: number;
}

export interface AnalyzeOptions {
  file: File | Blob | ArrayBuffer | Uint8Array;
  filename?: string;
}
