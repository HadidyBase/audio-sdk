export type WebhookEventType =
  | 'job.completed'
  | 'job.failed'
  | 'job.processing'
  | 'live.session.started'
  | 'live.session.stopped'
  | 'live.session.error';

export type WebhookStatus = 'active' | 'disabled' | 'failing';

export interface Webhook {
  id: string;
  url: string;
  events: WebhookEventType[];
  status: WebhookStatus;
  secret: string;
  description: string | null;
  failure_count: number;
  last_triggered_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface WebhookCreateOptions {
  url: string;
  events: WebhookEventType[];
  description?: string;
}

export interface WebhookUpdateOptions {
  url?: string;
  events?: WebhookEventType[];
  description?: string;
  status?: 'active' | 'disabled';
}

export type WebhookDeliveryStatus = 'success' | 'failed' | 'pending';

export interface WebhookDelivery {
  id: string;
  webhook_id: string;
  event_type: WebhookEventType;
  status: WebhookDeliveryStatus;
  response_code: number | null;
  response_body: string | null;
  attempt_count: number;
  delivered_at: string | null;
  created_at: string;
}

export interface WebhookEvent<T = unknown> {
  id: string;
  type: WebhookEventType;
  created_at: string;
  data: T;
}
