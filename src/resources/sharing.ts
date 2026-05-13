import type { HttpClient } from '../core/http.js';
import { validateId } from '../core/validation.js';
import type {
  ShareLink,
  ShareLinkCreateOptions,
  ShareLinkUpdateOptions,
  PublicShareInfo,
} from '../types/sharing.js';

export class SharingResource {
  constructor(private readonly http: HttpClient) {}

  async list(): Promise<ShareLink[]> {
    return this.http.get<ShareLink[]>('/api/v1/sharing');
  }

  async get(id: string): Promise<ShareLink> {
    return this.http.get<ShareLink>(`/api/v1/sharing/${validateId(id)}`);
  }

  async create(options: ShareLinkCreateOptions): Promise<ShareLink> {
    return this.http.post<ShareLink>('/api/v1/sharing', options);
  }

  async update(id: string, options: ShareLinkUpdateOptions): Promise<ShareLink> {
    return this.http.patch<ShareLink>(`/api/v1/sharing/${validateId(id)}`, options);
  }

  async delete(id: string): Promise<void> {
    return this.http.delete(`/api/v1/sharing/${validateId(id)}`);
  }

  async getPublicInfo(id: string): Promise<PublicShareInfo> {
    return this.http.get<PublicShareInfo>(`/api/v1/sharing/public/${validateId(id)}`);
  }

  async verifyPasscode(id: string, passcode: string): Promise<{ valid: boolean; token: string | null }> {
    return this.http.post<{ valid: boolean; token: string | null }>(
      `/api/v1/sharing/public/${validateId(id)}/verify`,
      { passcode },
    );
  }
}
