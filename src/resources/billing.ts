import type { HttpClient } from '../core/http.js';
import { paginate } from '../core/pagination.js';
import type { PaginatedResponse } from '../types/common.js';
import type {
  BillingBalance,
  BillingTransaction,
  BillingHistoryParams,
  ServiceCost,
} from '../types/billing.js';

export class BillingResource {
  constructor(private readonly http: HttpClient) {}

  async balance(): Promise<BillingBalance> {
    return this.http.get<BillingBalance>('/api/v1/billing/balance');
  }

  async history(params?: BillingHistoryParams): Promise<PaginatedResponse<BillingTransaction>> {
    return this.http.get<PaginatedResponse<BillingTransaction>>(
      '/api/v1/billing/history',
      params as Record<string, unknown>,
    );
  }

  async *historyAll(params?: Omit<BillingHistoryParams, 'page'>): AsyncGenerator<BillingTransaction> {
    yield* paginate<BillingTransaction>(
      (p) => this.http.get<PaginatedResponse<BillingTransaction>>('/api/v1/billing/history', { ...params, ...p }),
    );
  }

  async serviceCosts(): Promise<ServiceCost[]> {
    return this.http.get<ServiceCost[]>('/api/v1/auth/service-costs');
  }
}
