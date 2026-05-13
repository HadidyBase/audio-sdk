export interface AudioMetadata {
  title: string | null;
  artist: string | null;
  album: string | null;
  album_artist: string | null;
  track_number: number | null;
  total_tracks: number | null;
  disc_number: number | null;
  total_discs: number | null;
  year: number | null;
  genre: string | null;
  comment: string | null;
  composer: string | null;
  copyright: string | null;
  isrc: string | null;
  bpm: number | null;
  key: string | null;
  label: string | null;
  custom: Record<string, string>;
}

export interface AudioMetadataUpdateOptions {
  title?: string | null;
  artist?: string | null;
  album?: string | null;
  album_artist?: string | null;
  track_number?: number | null;
  total_tracks?: number | null;
  disc_number?: number | null;
  total_discs?: number | null;
  year?: number | null;
  genre?: string | null;
  comment?: string | null;
  composer?: string | null;
  copyright?: string | null;
  isrc?: string | null;
  bpm?: number | null;
  key?: string | null;
  label?: string | null;
  custom?: Record<string, string>;
}

export interface ConcatOptions {
  job_ids: string[];
  output_format: string;
  bitrate?: string;
  gap_seconds?: number;
  folder_id?: string;
}

export interface StreamToken {
  token: string;
  expires_at: string;
}
