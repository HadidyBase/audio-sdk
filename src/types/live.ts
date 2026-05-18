export type LiveSessionMode = 'single' | 'multi';
export type LiveSessionStatus =
  | 'created'
  | 'starting'
  | 'live'
  | 'stopping'
  | 'stopped'
  | 'error';

/**
 * Ingest protocol for a live session.
 * - `'whip'`  — WebRTC-HTTP Ingestion Protocol (OBS 30+, Larix).
 *               `ingest_url` is the full WHIP endpoint including the stream key.
 * - `'rtmp'`  — RTMPS (TLS-encrypted, port 4936). Despite the name 'rtmp' in the
 *               API, the external-facing connection is always RTMPS.
 *               `ingest_url` is the server address only; `stream_key` is separate.
 */
export type LiveIngestProtocol = 'whip' | 'rtmp';

export interface NowPlayingInfo {
  title: string;
  artist: string | null;
  album: string | null;
  cover_url: string | null;
  started_at: string;
}

export interface LiveSession {
  id: string;
  title: string | null;
  mode: LiveSessionMode;
  status: LiveSessionStatus;
  stream_key: string;
  /**
   * Ingest protocol for this session.
   * - `'whip'`: `ingest_url` is the full WHIP endpoint (`https://…/{key}/whip`).
   * - `'rtmp'`: `ingest_url` is the RTMPS server address only (`rtmps://…:4936/`);
   *             use `stream_key` as the separate stream key in your encoder.
   */
  ingest_protocol: LiveIngestProtocol;
  ingest_url: string;
  playback_url: string | null;
  recording_enabled: boolean;
  max_speakers: number | null;
  listener_count: number;
  now_playing: NowPlayingInfo | null;
  next_track: Pick<NowPlayingInfo, 'title' | 'artist' | 'cover_url'> | null;
  output_format: string;
  created_at: string;
  updated_at: string;
  started_at: string | null;
  stopped_at: string | null;
}

export interface LiveSessionCreateOptions {
  title?: string;
  mode?: LiveSessionMode;
  /** @default 'whip' */
  ingest_protocol?: LiveIngestProtocol;
  recording_enabled?: boolean;
  max_speakers?: number;
  output_format?: string;
}

export interface LiveSessionUpdateOptions {
  title?: string;
  recording_enabled?: boolean;
  max_speakers?: number;
}

export type LiveSourceRole = 'speaker' | 'listener';
export type LiveSourceStatus = 'active' | 'muted' | 'disconnected';

export interface LiveSource {
  id: string;
  session_id: string;
  role: LiveSourceRole;
  display_name: string;
  status: LiveSourceStatus;
  participant_token: string | null;
  joined_at: string | null;
  created_at: string;
}

export interface LiveSourceCreateOptions {
  role: LiveSourceRole;
  display_name: string;
}

export interface LiveParticipant {
  identity: string;
  display_name: string;
  is_speaking: boolean;
  audio_level: number;
  joined_at: string;
}

export interface LiveRecording {
  id: string;
  session_id: string;
  file_name: string;
  file_size: number;
  duration_seconds: number | null;
  download_url: string | null;
  expires_at: string | null;
  created_at: string;
}

export interface NowPlayingUpdate {
  title: string;
  artist?: string | null;
  album?: string | null;
  cover_url?: string | null;
}
