import type { HttpClient } from '../core/http.js';

export interface UserInfo {
  id: string;
  email: string;
  name: string | null;
  plan: string;
  api_key_prefix: string;
  created_at: string;
}

export interface UsageStats {
  period_reads: number;
  period_writes: number;
  plan_reads_limit: number | null;
  plan_writes_limit: number | null;
  total_reads: number;
  total_writes: number;
  period_start: string;
  period_end: string;
}

export interface ServiceCostEntry {
  service: string;
  cost_per_unit: number;
  unit: string;
  description: string;
}

export class AuthResource {
  constructor(private readonly http: HttpClient) {}

  async me(): Promise<UserInfo> {
    return this.http.get<UserInfo>('/api/v1/auth/me');
  }

  async stats(): Promise<UsageStats> {
    return this.http.get<UsageStats>('/api/v1/auth/stats');
  }

  async serviceCosts(): Promise<ServiceCostEntry[]> {
    return this.http.get<ServiceCostEntry[]>('/api/v1/auth/service-costs');
  }
}
