import type { HttpClient } from '../core/http.js';
import { paginate } from '../core/pagination.js';
import { validateId } from '../core/validation.js';
import type { PaginatedResponse } from '../types/common.js';
import type {
  LiveSession,
  LiveSessionCreateOptions,
  LiveSessionUpdateOptions,
  LiveSource,
  LiveSourceCreateOptions,
  LiveParticipant,
  LiveRecording,
  NowPlayingUpdate,
} from '../types/live.js';

export class LiveResource {
  constructor(private readonly http: HttpClient) {}

  async listSessions(params?: { page?: number; per_page?: number }): Promise<PaginatedResponse<LiveSession>> {
    return this.http.get<PaginatedResponse<LiveSession>>('/api/v1/live/sessions', params as Record<string, string | number | boolean | null | undefined>);
  }

  async *listSessionsAll(): AsyncGenerator<LiveSession> {
    yield* paginate<LiveSession>(
      this.http,
      '/api/v1/live/sessions',
    );
  }

  async getSession(id: string): Promise<LiveSession> {
    return this.http.get<LiveSession>(`/api/v1/live/sessions/${validateId(id)}`);
  }

  async createSession(options?: LiveSessionCreateOptions): Promise<LiveSession> {
    return this.http.post<LiveSession>('/api/v1/live/sessions', options ?? {});
  }

  async updateSession(id: string, options: LiveSessionUpdateOptions): Promise<LiveSession> {
    return this.http.patch<LiveSession>(`/api/v1/live/sessions/${validateId(id)}`, options);
  }

  async startSession(id: string): Promise<LiveSession> {
    return this.http.post<LiveSession>(`/api/v1/live/sessions/${validateId(id)}/start`, {});
  }

  async stopSession(id: string): Promise<LiveSession> {
    return this.http.post<LiveSession>(`/api/v1/live/sessions/${validateId(id)}/stop`, {});
  }

  async restartSession(id: string): Promise<LiveSession> {
    return this.http.post<LiveSession>(`/api/v1/live/sessions/${validateId(id)}/restart`, {});
  }

  async deleteSession(id: string): Promise<void> {
    return this.http.delete(`/api/v1/live/sessions/${validateId(id)}`);
  }

  async regenerateKey(id: string): Promise<{ stream_key: string }> {
    return this.http.post<{ stream_key: string }>(`/api/v1/live/sessions/${validateId(id)}/regenerate-key`, {});
  }

  async updateNowPlaying(id: string, update: NowPlayingUpdate): Promise<void> {
    return this.http.patch(`/api/v1/live/sessions/${validateId(id)}/now-playing`, update);
  }

  async clearNowPlaying(id: string): Promise<void> {
    return this.http.delete(`/api/v1/live/sessions/${validateId(id)}/now-playing`);
  }

  async listSources(sessionId: string): Promise<LiveSource[]> {
    return this.http.get<LiveSource[]>(`/api/v1/live/sessions/${validateId(sessionId)}/sources`);
  }

  async createSource(sessionId: string, options: LiveSourceCreateOptions): Promise<LiveSource> {
    return this.http.post<LiveSource>(`/api/v1/live/sessions/${validateId(sessionId)}/sources`, options);
  }

  async listParticipants(sessionId: string): Promise<LiveParticipant[]> {
    return this.http.get<LiveParticipant[]>(`/api/v1/live/sessions/${validateId(sessionId)}/participants`);
  }

  async listRecordings(sessionId: string): Promise<LiveRecording[]> {
    return this.http.get<LiveRecording[]>(`/api/v1/live/sessions/${validateId(sessionId)}/recordings`);
  }

  hlsProxyUrl(path: string, baseUrl: string): string {
    return `${baseUrl}/api/v1/live/hls/${encodeURIComponent(path)}`;
  }
}
