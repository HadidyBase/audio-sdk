import type { HttpClient } from '../core/http.js';
import { buildUploadFormData } from '../core/upload.js';
import { paginate } from '../core/pagination.js';
import { validateId } from '../core/validation.js';
import type { PaginatedResponse } from '../types/common.js';
import type {
  Job,
  JobListParams,
  JobCreateOptionsV1,
  JobCreateOptionsV2,
  JobOutput,
  WaitForCompletionOptions,
  ReTranscodeOptions,
} from '../types/jobs.js';

const DEFAULT_POLL_INTERVAL_MS = 2_000;
const DEFAULT_TIMEOUT_MS = 300_000;

export class JobsResource {
  constructor(private readonly http: HttpClient) {}

  async list(params?: JobListParams): Promise<PaginatedResponse<Job>> {
    return this.http.get<PaginatedResponse<Job>>('/api/v2/jobs', params as Record<string, string | number | boolean | null | undefined>);
  }

  async *listAll(params?: Omit<JobListParams, 'page'>): AsyncGenerator<Job> {
    yield* paginate<Job>(
      this.http,
      '/api/v2/jobs',
      params as Record<string, string | number | boolean | null | undefined>
    );
  }

  async get(id: string): Promise<Job> {
    return this.http.get<Job>(`/api/v2/jobs/${validateId(id)}`);
  }

  async create(
    file: File | Blob | ArrayBuffer | Uint8Array,
    options: JobCreateOptionsV1,
  ): Promise<Job> {
    const form = buildUploadFormData(file, 'file', {
      filename: (file instanceof File) ? file.name : (options as { filename?: string }).filename,
    });
    for (const [k, v] of Object.entries(options)) {
      if (v !== undefined && v !== null) form.append(k, String(v));
    }
    return this.http.post<Job>('/api/v1/uploads/', form);
  }

  async createV2(options: JobCreateOptionsV2): Promise<Job> {
    return this.http.post<Job>('/api/v2/jobs', options as unknown as Record<string, string | number | boolean | null | undefined>);
  }

  async reTranscode(options: ReTranscodeOptions): Promise<Job> {
    return this.http.post<Job>('/api/v1/uploads/re-transcode', options);
  }

  async delete(id: string): Promise<void> {
    return this.http.delete(`/api/v2/jobs/${validateId(id)}`);
  }

  async getOutput(id: string): Promise<JobOutput> {
    return this.http.get<JobOutput>(`/api/v2/jobs/${validateId(id)}/output`);
  }

  async waitForCompletion(
    id: string,
    options: WaitForCompletionOptions = {},
  ): Promise<Job> {
    const {
      timeoutMs = DEFAULT_TIMEOUT_MS,
      pollIntervalMs = DEFAULT_POLL_INTERVAL_MS,
      onProgress,
    } = options;

    const deadline = Date.now() + timeoutMs;

    while (Date.now() < deadline) {
      const job = await this.get(id);
      onProgress?.(job);

      if (job.status === 'completed') return job;
      if (job.status === 'failed' || job.status === 'cancelled') {
        throw new Error(
          `Job ${id} ended with status "${job.status}": ${job.error_message ?? 'unknown error'}`,
        );
      }

      const remaining = deadline - Date.now();
      await sleep(Math.min(pollIntervalMs, remaining));
    }

    throw new Error(`Job ${id} did not complete within ${timeoutMs}ms`);
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
