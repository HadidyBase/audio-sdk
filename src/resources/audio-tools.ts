import type { HttpClient } from '../core/http.js';
import { validateId } from '../core/validation.js';
import type {
  WaveformDataResult,
  SilenceDetectionResult,
} from '../types/analysis.js';
import type {
  AudioMetadata,
  AudioMetadataUpdateOptions,
  ConcatOptions,
} from '../types/audio.js';

export class AudioToolsResource {
  constructor(private readonly http: HttpClient) {}

  waveformImageUrl(id: string, baseUrl: string): string {
    return `${baseUrl}/api/v1/audio/${validateId(id)}/waveform`;
  }

  async waveformData(id: string): Promise<WaveformDataResult> {
    return this.http.get<WaveformDataResult>(`/api/v1/audio/${validateId(id)}/waveform-data`);
  }

  async silence(id: string): Promise<SilenceDetectionResult> {
    return this.http.get<SilenceDetectionResult>(`/api/v1/audio/${validateId(id)}/silence`);
  }

  async getMetadata(id: string): Promise<AudioMetadata> {
    return this.http.get<AudioMetadata>(`/api/v1/audio/${validateId(id)}/metadata`);
  }

  async updateMetadata(id: string, metadata: AudioMetadataUpdateOptions): Promise<AudioMetadata> {
    return this.http.put<AudioMetadata>(`/api/v1/audio/${validateId(id)}/metadata`, metadata as unknown as Record<string, unknown>);
  }

  coverArtUrl(id: string, baseUrl: string): string {
    return `${baseUrl}/api/v1/audio/${validateId(id)}/cover-art`;
  }

  async concat(options: ConcatOptions): Promise<{ job_id: string }> {
    return this.http.post<{ job_id: string }>('/api/v1/audio/concat', options as unknown as Record<string, unknown>);
  }
}
