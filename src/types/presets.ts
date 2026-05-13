export type PresetCategory =
  | 'podcast'
  | 'music'
  | 'voice'
  | 'broadcast'
  | 'custom';

export interface Preset {
  id: string;
  name: string;
  description: string | null;
  output_format: string;
  bitrate: string | null;
  sample_rate: number | null;
  channels: number | null;
  normalize: boolean;
  trim_silence: boolean;
  category: PresetCategory;
  is_system: boolean;
  user_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface PresetCreateOptions {
  name: string;
  description?: string;
  output_format: string;
  bitrate?: string;
  sample_rate?: number;
  channels?: number;
  normalize?: boolean;
  trim_silence?: boolean;
  category?: PresetCategory;
}

export interface PresetUpdateOptions {
  name?: string;
  description?: string;
  output_format?: string;
  bitrate?: string;
  sample_rate?: number;
  channels?: number;
  normalize?: boolean;
  trim_silence?: boolean;
  category?: PresetCategory;
}

export interface PresetListParams {
  page?: number;
  per_page?: number;
  category?: PresetCategory;
  include_system?: boolean;
}
