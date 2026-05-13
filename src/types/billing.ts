export interface BillingBalance {
  balance_usd: number;
  plan: string;
  plan_reads_used: number;
  plan_reads_limit: number | null;
  plan_writes_used: number;
  plan_writes_limit: number | null;
  reset_at: string | null;
}

export type TransactionType =
  | 'top_up'
  | 'deduction'
  | 'refund'
  | 'plan_charge';

export interface BillingTransaction {
  id: string;
  type: TransactionType;
  amount_usd: number;
  description: string;
  reference_id: string | null;
  created_at: string;
}

export interface BillingHistoryParams {
  page?: number;
  per_page?: number;
  type?: TransactionType;
  from?: string;
  to?: string;
}

export interface ServiceCost {
  service: string;
  cost_per_unit: number;
  unit: string;
  description: string;
}
