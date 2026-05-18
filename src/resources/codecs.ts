import type { HttpClient } from '../core/http.js';
import type { Codec, AudioFormat, CapabilitiesMatrix } from '../types/codecs.js';
import { validateId } from '../core/validation.js';

export class CodecsResource {
  constructor(private readonly http: HttpClient) {}

  async listCodecs(): Promise<Codec[]> {
    return this.http.get<Codec[]>('/api/v1/codecs');
  }

  async getCodec(id: string): Promise<Codec> {
    return this.http.get<Codec>(`/api/v1/codecs/${validateId(id, 'codec id')}`);
  }

  async listFormats(): Promise<AudioFormat[]> {
    return this.http.get<AudioFormat[]>('/api/v1/formats');
  }

  async getFormat(id: string): Promise<AudioFormat> {
    return this.http.get<AudioFormat>(`/api/v1/formats/${validateId(id, 'format id')}`);
  }

  async capabilities(): Promise<CapabilitiesMatrix> {
    return this.http.get<CapabilitiesMatrix>('/api/v1/capabilities');
  }
}
