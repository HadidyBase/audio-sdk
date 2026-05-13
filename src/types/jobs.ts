export type JobStatus =
  | 'pending'
  | 'queued'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'cancelled';

export interface Job {
  id: string;
  user_id: string;
  file_name: string;
  file_size: number;
  input_format: string;
  output_format: string;
  bitrate: string | null;
  sample_rate: number | null;
  channels: number | null;
  status: JobStatus;
  progress: number;
  error_message: string | null;
  output_url: string | null;
  duration_seconds: number | null;
  preset_id: string | null;
  folder_id: string | null;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
}

export interface JobListParams {
  page?: number;
  per_page?: number;
  status?: JobStatus;
  folder_id?: string | null;
  sort?: 'created_at' | 'updated_at' | 'file_name';
  order?: 'asc' | 'desc';
  search?: string;
}

export interface JobCreateOptionsV1 {
  output_format: string;
  bitrate?: string;
  sample_rate?: number;
  channels?: number;
  preset_id?: string;
  folder_id?: string;
  normalize?: boolean;
  trim_silence?: boolean;
}

export interface JobCreateOptionsV2 {
  file_key: string;
  output_format: string;
  bitrate?: string;
  sample_rate?: number;
  channels?: number;
  preset_id?: string;
  folder_id?: string;
  normalize?: boolean;
  trim_silence?: boolean;
}

export interface JobOutput {
  url: string;
  expires_at: string;
  file_name: string;
  file_size: number;
}

export interface WaitForCompletionOptions {
  timeoutMs?: number;
  pollIntervalMs?: number;
  onProgress?: (job: Job) => void;
}

export interface ReTranscodeOptions {
  job_id: string;
  output_format: string;
  bitrate?: string;
  sample_rate?: number;
  channels?: number;
  preset_id?: string;
}
