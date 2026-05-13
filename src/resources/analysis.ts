import type { HttpClient } from '../core/http.js';
import { buildUploadFormData } from '../core/upload.js';
import type { AudioAnalysisResult } from '../types/analysis.js';
import type { AnalyzeOptions } from '../types/analysis.js';

export class AnalysisResource {
  constructor(private readonly http: HttpClient) {}

  async analyze(options: AnalyzeOptions): Promise<AudioAnalysisResult> {
    const form = buildUploadFormData(options.file, { filename: options.filename });
    return this.http.post<AudioAnalysisResult>('/api/v1/audio/analyze', form);
  }
}
