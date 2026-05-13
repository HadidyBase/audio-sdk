import { HttpClient, type HttpClientOptions } from './core/http.js';
import { AuthResource } from './resources/auth.js';
import { JobsResource } from './resources/jobs.js';
import { PresetsResource } from './resources/presets.js';
import { CodecsResource } from './resources/codecs.js';
import { StreamingResource } from './resources/streaming.js';
import { AnalysisResource } from './resources/analysis.js';
import { AudioToolsResource } from './resources/audio-tools.js';
import { WebhooksResource } from './resources/webhooks.js';
import { BillingResource } from './resources/billing.js';
import { FoldersResource } from './resources/folders.js';
import { SharingResource } from './resources/sharing.js';
import { LiveResource } from './resources/live.js';
import { DEFAULT_BASE_URL } from './core/version.js';

export interface AudioClientOptions {
  apiKey: string;
  baseUrl?: string;
  /** Request timeout in milliseconds. Default: 30 000. */
  timeoutMs?: number;
  retries?: number;
  fetch?: typeof fetch;
}

export class AudioClient {
  readonly auth: AuthResource;
  readonly jobs: JobsResource;
  readonly presets: PresetsResource;
  readonly codecs: CodecsResource;
  readonly streaming: StreamingResource;
  readonly analysis: AnalysisResource;
  readonly audio: AudioToolsResource;
  readonly webhooks: WebhooksResource;
  readonly billing: BillingResource;
  readonly folders: FoldersResource;
  readonly sharing: SharingResource;
  readonly live: LiveResource;

  private readonly _http: HttpClient;
  readonly baseUrl: string;

  constructor(options: AudioClientOptions) {
    const { apiKey, baseUrl = DEFAULT_BASE_URL, timeoutMs, retries, fetch: fetchImpl } = options;

    const httpOptions: HttpClientOptions = { apiKey, baseUrl, timeoutMs, retries };
    if (fetchImpl) httpOptions.fetch = fetchImpl;

    this._http = new HttpClient(httpOptions);
    this.baseUrl = baseUrl;

    this.auth = new AuthResource(this._http);
    this.jobs = new JobsResource(this._http);
    this.presets = new PresetsResource(this._http);
    this.codecs = new CodecsResource(this._http);
    this.streaming = new StreamingResource(this._http, baseUrl);
    this.analysis = new AnalysisResource(this._http);
    this.audio = new AudioToolsResource(this._http);
    this.webhooks = new WebhooksResource(this._http);
    this.billing = new BillingResource(this._http);
    this.folders = new FoldersResource(this._http);
    this.sharing = new SharingResource(this._http);
    this.live = new LiveResource(this._http);
  }
}
