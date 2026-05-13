import type { HttpClient } from '../core/http.js';
import { paginate } from '../core/pagination.js';
import { validateId } from '../core/validation.js';
import type { PaginatedResponse } from '../types/common.js';
import type {
  Preset,
  PresetCreateOptions,
  PresetUpdateOptions,
  PresetListParams,
} from '../types/presets.js';

export class PresetsResource {
  constructor(private readonly http: HttpClient) {}

  async list(params?: PresetListParams): Promise<PaginatedResponse<Preset>> {
    return this.http.get<PaginatedResponse<Preset>>('/api/v1/presets/', params as Record<string, unknown>);
  }

  async *listAll(params?: Omit<PresetListParams, 'page'>): AsyncGenerator<Preset> {
    yield* paginate<Preset>(
      (p) => this.http.get<PaginatedResponse<Preset>>('/api/v1/presets/', { ...params, ...p }),
    );
  }

  async get(id: string): Promise<Preset> {
    return this.http.get<Preset>(`/api/v1/presets/${validateId(id)}`);
  }

  async create(options: PresetCreateOptions): Promise<Preset> {
    return this.http.post<Preset>('/api/v1/presets/', options as unknown as Record<string, unknown>);
  }

  async update(id: string, options: PresetUpdateOptions): Promise<Preset> {
    return this.http.put<Preset>(`/api/v1/presets/${validateId(id)}`, options as unknown as Record<string, unknown>);
  }

  async delete(id: string): Promise<void> {
    return this.http.delete(`/api/v1/presets/${validateId(id)}`);
  }
}
