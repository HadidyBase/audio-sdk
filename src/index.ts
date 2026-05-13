export { AudioClient } from './client.js';
export type { AudioClientOptions } from './client.js';

export * from './types/index.js';

export {
  HadidyError,
  AuthenticationError,
  ForbiddenError,
  NotFoundError,
  RateLimitError,
  ValidationError,
  ServerError,
  NetworkError,
  TimeoutError,
} from './core/errors.js';

export { AuthResource } from './resources/auth.js';
export { JobsResource } from './resources/jobs.js';
export { PresetsResource } from './resources/presets.js';
export { CodecsResource } from './resources/codecs.js';
export { StreamingResource } from './resources/streaming.js';
export { AnalysisResource } from './resources/analysis.js';
export { AudioToolsResource } from './resources/audio-tools.js';
export { WebhooksResource } from './resources/webhooks.js';
export { BillingResource } from './resources/billing.js';
export { FoldersResource } from './resources/folders.js';
export { SharingResource } from './resources/sharing.js';
export { LiveResource } from './resources/live.js';
