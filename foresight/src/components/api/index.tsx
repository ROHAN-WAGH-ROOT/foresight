import { api } from "./axios";

// 1. Authentication APIs
export const loginApi = async (username: string, password: string) => {
  const params = new URLSearchParams();
  params.append("username", username);
  params.append("password", password);

  const { data } = await api.post("/api/v1/auth/token", params, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
  return data; // returns { access_token, token_type }
};

export const getMeApi = async () => {
  const { data } = await api.get("/api/v1/auth/me");
  return data; // returns { username, role }
};

// 2. Customer APIs
export interface Customer {
  id: number;
  customer_code?: string;
  customer_id?: string;
  name?: string;
  full_name?: string;
  email?: string;
  phone?: string;
  city?: string;
  state?: string;
  pincode?: string;
  credit_score: number;
  date_of_birth?: string;
  gender?: string;
  address?: string;
  employment_type?: string;
  monthly_income?: number;
  years_with_bank?: number;
  num_dependents?: number;
  is_active?: boolean;
  created_at?: string;
}

export const listCustomersApi = async () => {
  const { data } = await api.get<Customer[]>("/api/v1/customers/");
  return data;
};

export const searchCustomerApi = async (params: {
  full_name?: string;
  customer_id?: string;
  email?: string;
  phone?: string;
}) => {
  const activeParams = Object.fromEntries(
    Object.entries(params).filter(([_, v]) => v !== undefined && v !== "")
  );
  const { data } = await api.get<Customer[]>("/api/v1/customers/search", {
    params: activeParams,
  });
  return data;
};

export const getCustomerByIdApi = async (customerId: string | number) => {
  const { data } = await api.get<Customer>(`/api/v1/customers/${customerId}`);
  return data;
};

export interface CustomerProfile {
  customer: Customer;
  latest_risk?: {
    prediction_id: string;
    pd_score: number;
    risk_category: string;
    default_probability_pct: number;
    recommended_action: string; // JSON string or array representation
    feature_importance: string; // JSON string or object representation
    prediction_threshold: number;
    is_active: boolean;
    customer_id: number;
    id: number;
    risk_score: number;
    risk_reasons: string; // JSON string or array representation
    model_version: string;
    will_default_12m?: boolean | null;
    predicted_at: string;
  } | null;
  active_loans_count: number;
  total_outstanding: number;
}

export const getCustomerProfileApi = async (customerId: string | number) => {
  const { data } = await api.get<CustomerProfile>(`/api/v1/customers/${customerId}/profile`);
  return data;
};

// 3. Loan APIs
export interface Loan {
  id: number;
  loan_id: string;
  customer_id: number;
  loan_type: string;
  principal_amount: number;
  outstanding_balance: number;
  interest_rate: number;
  tenure_months: number;
  emi_amount: number;
  disbursement_date: string;
  maturity_date: string;
  dpd: number;
  missed_emis: number;
  restructured: boolean;
  collateral_value: number;
  ltv_ratio: number;
  status: string; // "ACTIVE", "CLOSED", "DELINQUENT"
  created_at: string;
}

export interface ListLoansResponse {
  total: number;
  page: number;
  size: number;
  pages: number;
  items: Loan[];
}

export const listLoansApi = async (page = 1, size = 50) => {
  const { data } = await api.get<ListLoansResponse>("/api/v1/loans/", {
    params: { page, size },
  });
  return data;
};

export const listNpaLoansApi = async () => {
  const { data } = await api.get<Loan[]>("/api/v1/loans/npa");
  return data;
};

export const getCustomerLoansApi = async (customerId: string | number) => {
  const { data } = await api.get<Loan[]>(`/api/v1/loans/customer/${customerId}`);
  return data;
};

// 4. Risk & AI Engine APIs
export interface PredictRiskResponse {
  id: number;
  prediction_id: string;
  customer_id: number;
  pd_score: number;
  risk_score: number;
  risk_category: string;
  default_probability_pct: number;
  will_default_12m: boolean;
  prediction_threshold: number;
  risk_reasons: string[];
  recommended_action: string[];
  model_version: string;
  feature_importance: Record<string, number>;
  predicted_at: string;
}

export const predictCustomerRiskApi = async (customerId: number, forceRefresh = true) => {
  const { data } = await api.post<PredictRiskResponse>("/api/v1/risk/predict", {
    customer_id: customerId,
    force_refresh: forceRefresh,
  });
  return data;
};

export const batchRiskPredictionApi = async (customerIds: number[]) => {
  const { data } = await api.post<{ processed: number; status: string }>(
    "/api/v1/risk/predict/batch",
    { customer_ids: customerIds }
  );
  return data;
};

export interface RiskHistoryItem {
  id: number;
  prediction_id: string;
  customer_id: number;
  pd_score: number;
  risk_score: number;
  risk_category: string;
  default_probability_pct: number;
  will_default_12m: boolean;
  prediction_threshold: number;
  risk_reasons: string; // JSON string
  recommended_action: string; // JSON string
  model_version: string;
  feature_importance: string; // JSON string
  predicted_at: string;
}

export const getCustomerRiskHistoryApi = async (customerId: string | number) => {
  const { data } = await api.get<RiskHistoryItem[]>(
    `/api/v1/risk/customer/${customerId}/history`
  );
  return data;
};

export interface HighRiskCustomer {
  customer_id: number;
  customer_name: string;
  risk_category: string;
  pd_score: number;
  risk_score: number;
  default_probability_pct: number;
  risk_reasons: string; // JSON string
  recommended_action: string; // JSON string
  total_outstanding: number;
  loan_count: number;
}

export const getHighRiskCustomersApi = async (category: "HIGH" | "LOW" = "HIGH") => {
  const { data } = await api.get<HighRiskCustomer[]>("/api/v1/risk/high-risk", {
    params: { risk_category: category, category },
  });
  return data;
};

export interface PortfolioSummary {
  total_customers: number;
  total_loans: number;
  total_outstanding: number;
  avg_pd_score: number;
  risk_distribution: {
    CRITICAL: number;
    MEDIUM: number;
    HIGH: number;
    LOW: number;
  };
  high_risk_count: number;
  critical_risk_count: number;
  npa_rate: number;
  avg_credit_score: number;
}

export const getPortfolioRiskSummaryApi = async () => {
  const { data } = await api.get<PortfolioSummary>("/api/v1/risk/portfolio/summary");
  return data;
};

export interface EarlyWarningAlert {
  customer_id: number;
  customer_name: string;
  risk_category: string;
  pd_score: number;
  risk_score: number;
  default_probability_pct: number;
  top_reason: string;
  all_reasons: string[];
  recommended_action: string;
  all_actions: string[];
  loans_count: number;
  total_outstanding: number;
}

export const getEarlyWarningAlertsApi = async () => {
  const { data } = await api.get<EarlyWarningAlert[]>("/api/v1/risk/alerts/early-warning");
  return data;
};

// 5. Dashboard APIs
export interface DashboardAlert {
  customer_id: number;
  customer_name: string;
  customer_code: string;
  risk_category: string;
  pd_score: number;
  risk_score: number;
  top_reason: string;
  predicted_at: string;
}

export interface DashboardOverview {
  portfolio_summary: PortfolioSummary;
  top_alerts: DashboardAlert[];
  generated_at: string;
}

export const getDashboardOverviewApi = async () => {
  const { data } = await api.get<DashboardOverview>("/api/v1/dashboard/overview");
  return data;
};

export interface RiskTrendItem {
  date: string;
  avg_pd_score: number;
  avg_risk_score: number;
  total_predictions: number;
}

export const getRiskTrendApi = async () => {
  const { data } = await api.get<RiskTrendItem[]>("/api/v1/dashboard/risk-trend");
  return data;
};

export interface RiskDistributionItem {
  category: string;
  count: number;
  avg_pd_score: number;
}

export const getRiskDistributionApi = async () => {
  const { data } = await api.get<RiskDistributionItem[]>("/api/v1/dashboard/risk-distribution");
  return data;
};

export interface LoanPerformanceItem {
  loan_type: string;
  status: string;
  count: number;
  total_outstanding: number;
  avg_dpd: number;
}

export const getLoanPerformanceApi = async () => {
  const { data } = await api.get<LoanPerformanceItem[]>("/api/v1/dashboard/loan-performance");
  return data;
};

export interface TopDefaulter {
  rank: number;
  customer_id: number;
  customer_code: string;
  customer_name: string;
  city: string;
  credit_score: number;
  risk_category: string;
  pd_score: number;
  default_probability_pct: number;
  risk_score: number;
  active_loans: number;
  total_outstanding: number;
}

export const getTopDefaultersApi = async (limit = 20) => {
  const { data } = await api.get<TopDefaulter[]>("/api/v1/dashboard/top-defaulters", {
    params: { limit },
  });
  return data;
};
