import type { HttpClient } from '../core/http.js';
import { validateId } from '../core/validation.js';
import type {
  Folder,
  FolderBreadcrumb,
  FolderCreateOptions,
  FolderUpdateOptions,
  MoveFilesOptions,
} from '../types/folders.js';

export class FoldersResource {
  constructor(private readonly http: HttpClient) {}

  async list(): Promise<Folder[]> {
    return this.http.get<Folder[]>('/api/v1/folders');
  }

  async get(id: string): Promise<Folder> {
    return this.http.get<Folder>(`/api/v1/folders/${validateId(id)}`);
  }

  async breadcrumb(id: string): Promise<FolderBreadcrumb[]> {
    return this.http.get<FolderBreadcrumb[]>(`/api/v1/folders/${validateId(id)}/breadcrumb`);
  }

  async create(options: FolderCreateOptions): Promise<Folder> {
    return this.http.post<Folder>('/api/v1/folders', options as unknown as Record<string, unknown>);
  }

  async update(id: string, options: FolderUpdateOptions): Promise<Folder> {
    return this.http.patch<Folder>(`/api/v1/folders/${validateId(id)}`, options as unknown as Record<string, unknown>);
  }

  async delete(id: string): Promise<void> {
    return this.http.delete(`/api/v1/folders/${validateId(id)}`);
  }

  async moveFiles(options: MoveFilesOptions): Promise<{ moved: number }> {
    return this.http.post<{ moved: number }>('/api/v1/folders/move-files', options as unknown as Record<string, unknown>);
  }
}
