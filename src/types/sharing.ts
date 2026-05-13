export type ShareLinkType = 'file' | 'live_session';
export type ShareAccessType = 'public' | 'passcode_protected';

export interface ShareLink {
  id: string;
  type: ShareLinkType;
  access_type: ShareAccessType;
  url: string;
  target_id: string;
  expires_at: string | null;
  view_count: number;
  download_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface ShareLinkCreateOptions {
  type: ShareLinkType;
  target_id: string;
  access_type?: ShareAccessType;
  passcode?: string;
  expires_at?: string | null;
  download_enabled?: boolean;
}

export interface ShareLinkUpdateOptions {
  access_type?: ShareAccessType;
  passcode?: string | null;
  expires_at?: string | null;
  download_enabled?: boolean;
}

export interface PublicShareInfo {
  id: string;
  type: ShareLinkType;
  access_type: ShareAccessType;
  requires_passcode: boolean;
  expires_at: string | null;
  download_enabled: boolean;
  file?: {
    name: string;
    format: string;
    duration_seconds: number | null;
    cover_art_url: string | null;
  };
  live_session?: {
    title: string;
    status: string;
    playback_url: string | null;
    now_playing: { title: string; artist: string | null } | null;
  };
}
