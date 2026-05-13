export interface Codec {
  id: string;
  name: string;
  display_name: string;
  type: 'audio' | 'video';
  supported_bitrates: string[];
  supported_sample_rates: number[];
  lossy: boolean;
  description: string | null;
}

export interface AudioFormat {
  id: string;
  name: string;
  extension: string;
  mime_type: string;
  supports_metadata: boolean;
  supports_cover_art: boolean;
  description: string | null;
}

export interface Capability {
  codec_id: string;
  format_id: string;
  supported: boolean;
  notes: string | null;
}

export interface CapabilitiesMatrix {
  codecs: Codec[];
  formats: AudioFormat[];
  capabilities: Capability[];
}
