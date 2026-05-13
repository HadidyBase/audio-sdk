import type { HttpClient } from '../core/http.js';
import { paginate } from '../core/pagination.js';
import { validateId } from '../core/validation.js';
import type { PaginatedResponse } from '../types/common.js';
import type {
  Webhook,
  WebhookCreateOptions,
  WebhookUpdateOptions,
  WebhookDelivery,
} from '../types/webhooks.js';

export class WebhooksResource {
  constructor(private readonly http: HttpClient) {}

  async list(): Promise<Webhook[]> {
    return this.http.get<Webhook[]>('/api/v1/webhooks/');
  }

  async get(id: string): Promise<Webhook> {
    return this.http.get<Webhook>(`/api/v1/webhooks/${validateId(id)}`);
  }

  async create(options: WebhookCreateOptions): Promise<Webhook> {
    return this.http.post<Webhook>('/api/v1/webhooks/', options);
  }

  async update(id: string, options: WebhookUpdateOptions): Promise<Webhook> {
    return this.http.put<Webhook>(`/api/v1/webhooks/${validateId(id)}`, options);
  }

  async delete(id: string): Promise<void> {
    return this.http.delete(`/api/v1/webhooks/${validateId(id)}`);
  }

  async deliveries(id: string, params?: { page?: number; per_page?: number }): Promise<PaginatedResponse<WebhookDelivery>> {
    return this.http.get<PaginatedResponse<WebhookDelivery>>(
      `/api/v1/webhooks/${validateId(id)}/deliveries`,
      params as Record<string, string | number | boolean | null | undefined>,
    );
  }

  async *deliveriesAll(id: string): AsyncGenerator<WebhookDelivery> {
    const safeId = validateId(id);
    yield* paginate<WebhookDelivery>(
      this.http,
      `/api/v1/webhooks/${safeId}/deliveries`,
    );
  }

  async test(id: string): Promise<{ delivered: boolean; response_code: number | null }> {
    return this.http.post<{ delivered: boolean; response_code: number | null }>(
      `/api/v1/webhooks/${validateId(id)}/test`,
      {},
    );
  }
}
