import type { HttpClient } from '../core/http.js';
import type { StreamToken } from '../types/audio.js';

export class StreamingResource {
  constructor(
    private readonly http: HttpClient,
    private readonly baseUrl: string,
  ) {}

  async getToken(): Promise<StreamToken> {
    return this.http.get<StreamToken>('/api/v1/stream/token');
  }

  buildStreamUrl(path: string, token: string): string {
    return `${this.baseUrl}/api/v1/stream/${encodeURIComponent(path)}?token=${encodeURIComponent(token)}`;
  }

  buildDownloadUrl(path: string, token: string): string {
    return `${this.baseUrl}/api/v1/stream/download/${encodeURIComponent(path)}?token=${encodeURIComponent(token)}`;
  }

  async getSignedStreamUrl(path: string): Promise<string> {
    const { token } = await this.getToken();
    return this.buildStreamUrl(path, token);
  }

  async getSignedDownloadUrl(path: string): Promise<string> {
    const { token } = await this.getToken();
    return this.buildDownloadUrl(path, token);
  }
}
