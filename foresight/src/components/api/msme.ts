import type { EarlyWarningAlert, HighRiskCustomer, RiskHistoryItem } from ".";
import { api } from "./axios";

// MSME Types
export interface MsmeRiskPrediction {
  business_id: number;
  business_name: string;
  risk_score: number;
  risk_level: "HIGH" | "MEDIUM" | "LOW" | "CRITICAL";
  probability_of_default: number;
  confidence_score: number;
  recommendation: string;
  risk_factors: string[];
  recommended_actions: string[];
  prediction_date: string;
  isMocked?: boolean;
}

export interface MsmeBatchRiskPredictionResponse {
  predicted: number;
  failed: number;
  errors: string[];
  predictions: {
    business_id: number;
    risk_score: number;
    risk_level: string;
    business_name?: string;
  }[];
  isMocked?: boolean;
}

export interface MsmeBusinessProfile {
  id: number;
  business_name: string;
  owner_name: string;
  industry: string;
  annual_turnover: number;
  city: string;
  state: string;
  status: string;
  isMocked?: boolean;
}

export interface MsmeDashboardData {
  portfolio_summary: {
    total_businesses: number;
    high_risk: number;
    medium_risk: number;
    low_risk: number;
    average_risk_score: number;
    total_credit_lines: number;
    total_outstanding: number;
    avg_pd_score: number;
    risk_distribution: {
      LOW: number;
        MEDIUM: number;
        HIGH: number,
        CRITICAL: number,
    };
    high_risk_count: number;
    critical_risk_count: number;
    npa_rate: number;
    avg_owner_credit_score: number;
  };
  top_alerts: {
    business_id: number;
    business_name: string;
    alert: string;
    severity: "HIGH" | "MEDIUM" | "LOW" | "CRITICAL";
  }[];
  risk_trend: {
    date: string;
    average_risk_score: number;
    total_predictions: number;
    high_risk_count: number;
  }[];
  isMocked?: boolean;
}

export interface MsmeHighRiskResponse {
  page: number;
  size: number;
  total: number;
  pages: number;
  items: {
    business_id: number;
    business_name: string;
    risk_score: number;
    risk_level: string;
    probability_of_default: number;
  }[];
  isMocked?: boolean;
}


export interface BusinessProfile {
  id: number;
  business_id: string;
  business_name: string;
  legal_name: string;
  business_type: string;
  gstin: string | null;
  pan: string;
  cin: string | null;
  udyam_number: string | null;
  incorporation_date: string;
  years_in_business: number;
  industry: string;
  sub_industry: string;
  employee_count: number;
  annual_turnover: number;
  email: string;
  phone: string;
  registered_address: string;
  city: string;
  state: string;
  pincode: string;
  status: 'ACTIVE' | 'INACTIVE' | string;
  created_at: string;
  updated_at: string | null;
}

export interface LatestRisk {
  id: number;
  business_id: number;
  prediction_id: string;
  model_version: string;
  risk_score: number;
  pd_score: number;
  default_probability_pct: number;
  prediction_threshold: number;
  risk_category: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' | string;
  will_default_12m: boolean;
  recommended_action: string; // JSON string array: string[]
  risk_reasons: string;        // JSON string array: string[]
  feature_importance: string;  // JSON string object: Record<string, number>
  is_active: boolean;
  predicted_at: string;
}

export interface MSMEProfileResponse {
  business: BusinessProfile;
  latest_risk: LatestRisk;
  active_loans_count: number;
  total_outstanding: number;
}


export interface RiskCategoryItem {
  business_id: number;
  business_name: string;
  industry: string;
  business_type: string;
  status: string;
  risk_category: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | string;
  pd_score: number;
  risk_score: number;
  default_probability_pct: number;
  predicted_at: string;
}

export interface RiskCategoryResponse {
  total: number;
  page: number;
  size: number;
  pages: number;
  items: RiskCategoryItem[];
}

export interface RiskCategoryParams {
  page?: number;
  size?: number;
}
// ----------------------------------------------------
// Mock Databases
// ----------------------------------------------------
export const MOCK_MSME_PROFILES: MsmeBusinessProfile[] = [
  { id: 101, business_name: "ABC Industries", owner_name: "John Doe", industry: "Manufacturing", annual_turnover: 25000000, city: "Pune", state: "Maharashtra", status: "ACTIVE" },
  { id: 102, business_name: "TechSolutions Inc", owner_name: "Jane Smith", industry: "Technology", annual_turnover: 45000000, city: "Bangalore", state: "Karnataka", status: "ACTIVE" },
  { id: 103, business_name: "GreenField Farms", owner_name: "Ram Charan", industry: "Agriculture", annual_turnover: 12000000, city: "Guntur", state: "Andhra Pradesh", status: "ACTIVE" },
  { id: 104, business_name: "OceanBlue Logistics", owner_name: "Vikram Malhotra", industry: "Logistics", annual_turnover: 35000000, city: "Mumbai", state: "Maharashtra", status: "ACTIVE" },
  { id: 105, business_name: "Elite Builders", owner_name: "Rajesh Kulkarni", industry: "Construction", annual_turnover: 85000000, city: "Pune", state: "Maharashtra", status: "ACTIVE" },
  { id: 106, business_name: "Golden Harvest Retail", owner_name: "Sita Devi", industry: "Retail", annual_turnover: 8000000, city: "Patna", state: "Bihar", status: "ACTIVE" },
  { id: 107, business_name: "Apex Software Services", owner_name: "Anand Verma", industry: "Technology", annual_turnover: 15000000, city: "Noida", state: "Uttar Pradesh", status: "ACTIVE" },
  { id: 108, business_name: "Radiant Healthcare", owner_name: "Dr. Sunita Rao", industry: "Healthcare", annual_turnover: 30000000, city: "Hyderabad", state: "Telangana", status: "ACTIVE" },
  { id: 109, business_name: "Zenith Textiles Ltd", owner_name: "Amit Patel", industry: "Manufacturing", annual_turnover: 18000000, city: "Surat", state: "Gujarat", status: "ACTIVE" },
  { id: 110, business_name: "EcoFriendly Packaging", owner_name: "Neha Gupta", industry: "Manufacturing", annual_turnover: 11000000, city: "Indore", state: "Madhya Pradesh", status: "ACTIVE" },
  { id: 111, business_name: "Solaris Power Solutions", owner_name: "Sanjay Dutta", industry: "Energy", annual_turnover: 52000000, city: "Kolkata", state: "West Bengal", status: "ACTIVE" },
  { id: 112, business_name: "Nova Food Products", owner_name: "Preeti Singh", industry: "Food Processing", annual_turnover: 19000000, city: "Ludhiana", state: "Punjab", status: "ACTIVE" },
  { id: 113, business_name: "Delta Metal Works", owner_name: "Harish Sharma", industry: "Metallurgy", annual_turnover: 28000000, city: "Jamshedpur", state: "Jharkhand", status: "ACTIVE" },
  { id: 114, business_name: "Quantum Tech Labs", owner_name: "Ramesh Iyer", industry: "Technology", annual_turnover: 60000000, city: "Chennai", state: "Tamil Nadu", status: "ACTIVE" },
  { id: 115, business_name: "Pioneer Agro Exports", owner_name: "Gurpreet Singh", industry: "Agriculture", annual_turnover: 34000000, city: "Amritsar", state: "Punjab", status: "ACTIVE" }
];

export const MOCK_MSME_PREDICTIONS: Record<number, MsmeRiskPrediction> = {
  101: {
    business_id: 101,
    business_name: "ABC Industries",
    risk_score: 72.45,
    risk_level: "HIGH",
    probability_of_default: 0.78,
    confidence_score: 0.91,
    recommendation: "Review account immediately",
    risk_factors: [
      "High credit utilization",
      "Frequent late EMI payments",
      "Declining quarterly revenue growth"
    ],
    recommended_actions: [
      "Manual review",
      "Reduce exposure"
    ],
    prediction_date: "2026-07-03T11:30:00"
  },
  102: {
    business_id: 102,
    business_name: "TechSolutions Inc",
    risk_score: 45.10,
    risk_level: "MEDIUM",
    probability_of_default: 0.45,
    confidence_score: 0.87,
    recommendation: "Periodic evaluation in 90 days",
    risk_factors: [
      "Working capital cycle stretch",
      "Higher debtor days"
    ],
    recommended_actions: [
      "Request quarterly debtor ledger",
      "Verify collateral value"
    ],
    prediction_date: "2026-07-03T11:45:00"
  },
  103: {
    business_id: 103,
    business_name: "GreenField Farms",
    risk_score: 18.70,
    risk_level: "LOW",
    probability_of_default: 0.15,
    confidence_score: 0.94,
    recommendation: "Standard account maintenance",
    risk_factors: [
      "Vulnerability to seasonal rain patterns"
    ],
    recommended_actions: [
      "No critical actions required",
      "Eligible for credit limits upgrade"
    ],
    prediction_date: "2026-07-03T12:00:00"
  },
  104: {
    business_id: 104,
    business_name: "OceanBlue Logistics",
    risk_score: 82.50,
    risk_level: "HIGH",
    probability_of_default: 0.84,
    confidence_score: 0.89,
    recommendation: "Halt additional credit disbursements",
    risk_factors: [
      "Fuel costs inflation pressure",
      "Multiple bank account defaults",
      "Debt Service Coverage Ratio (DSCR) < 1.0"
    ],
    recommended_actions: [
      "Initiate legal restructuring checks",
      "Execute lien on collateral"
    ],
    prediction_date: "2026-07-03T12:15:00"
  },
  105: {
    business_id: 105,
    business_name: "Elite Builders",
    risk_score: 61.20,
    risk_level: "MEDIUM",
    probability_of_default: 0.58,
    confidence_score: 0.83,
    recommendation: "Review project milestones completion status",
    risk_factors: [
      "Slower sales velocity in housing segment",
      "High leverage ratio"
    ],
    recommended_actions: [
      "Audit project escrow account",
      "Establish milestone checks for next disbursement"
    ],
    prediction_date: "2026-07-03T12:30:00"
  }
};

// Auxiliary generator for dynamic business profiles
export const getOrCreateProfile = (businessId: number): MsmeBusinessProfile => {
  const existing = MOCK_MSME_PROFILES.find(p => p.id === businessId);
  if (existing) return existing;

  const names = ["Apex Enterprise", "Vertex Corp", "Falcon Logistics", "Matrix Retail", "Infinity Solutions", "Sigma Foundry", "Pinnacle Agritech", "Vanguard Pharma"];
  const industries = ["Manufacturing", "Services", "Technology", "Agriculture", "Logistics", "Retail", "Healthcare", "Textiles"];
  const cities = ["Pune", "Mumbai", "Bangalore", "Delhi", "Hyderabad", "Surat", "Ahmedabad", "Chennai"];
  const states = ["Maharashtra", "Karnataka", "Delhi NCR", "Telangana", "Gujarat", "Tamil Nadu"];
  
  const hash = (businessId * 9301 + 49297) % 233280;
  const name = names[hash % names.length] + " " + businessId;
  const industry = industries[(hash >> 2) % industries.length];
  const city = cities[(hash >> 4) % cities.length];
  const state = states[(hash >> 6) % states.length];
  const turnover = 5000000 + (hash % 95) * 1000000;
  
  return {
    id: businessId,
    business_name: name,
    owner_name: `Entrepreneur #${businessId}`,
    industry,
    annual_turnover: turnover,
    city,
    state,
    status: "ACTIVE",
    isMocked: true
  };
};

// Dynamic risk prediction generator
const getOrCreatePrediction = (businessId: number): MsmeRiskPrediction => {
  if (MOCK_MSME_PREDICTIONS[businessId]) return MOCK_MSME_PREDICTIONS[businessId];
  
  const profile = getOrCreateProfile(businessId);
  const hash = (businessId * 7517 + 13107) % 65536;
  const risk_score = 10 + (hash % 85) + (hash % 10) / 10;
  
  let risk_level: MsmeRiskPrediction["risk_level"] = "LOW";
  let recommendation = "Standard account maintenance";
  let risk_factors: string[] = [];
  let recommended_actions: string[] = [];
  
  if (risk_score >= 70) {
    risk_level = "HIGH";
    recommendation = "Review account immediately";
    risk_factors = ["High debt burden", "Weak interest coverage ratio", "Frequent delays in client billing"];
    recommended_actions = ["Manual underwriting audit", "Reduce exposure limits"];
  } else if (risk_score >= 40) {
    risk_level = "MEDIUM";
    recommendation = "Monitor operations quarterly";
    risk_factors = ["Stretched credit terms", "Slight dip in inventory turnover"];
    recommended_actions = ["Obtain updated bank statements", "Verify trade receivables"];
  } else {
    risk_factors = ["Minor administrative delay in audits"];
    recommended_actions = ["Promote loyalty loan schemes"];
  }

  const pd = risk_score / 100;
  const conf = 0.8 + (hash % 15) / 100;

  return {
    business_id: businessId,
    business_name: profile.business_name,
    risk_score,
    risk_level,
    probability_of_default: parseFloat(pd.toFixed(2)),
    confidence_score: parseFloat(conf.toFixed(2)),
    recommendation,
    risk_factors,
    recommended_actions,
    prediction_date: new Date().toISOString(),
    isMocked: true
  };
};

// ----------------------------------------------------
// API Functions with Graceful Mock Fallbacks
// ----------------------------------------------------

/**
 * 1. Predict Risk (Single Business)
 * POST api/v1/msme/predict
 */
export const predictMsmeRiskApi = async (
  businessId: number,
  forceRefresh = false
): Promise<MsmeRiskPrediction> => {
  try {
    const { data } = await api.post<MsmeRiskPrediction>("/api/v1/msme/predict", {
      business_id: businessId,
      force_refresh: forceRefresh,
    });
    return data;
  } catch (error) {
    console.warn(`[API Msme Predict] Falling back to mock data for business_id: ${businessId}`, error);
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    return getOrCreatePrediction(businessId);
  }
};

/**
 * 2. Predict Risk (Batch)
 * POST api/v1/msme/predict/batch
 */
export const predictMsmeRiskBatchApi = async (
  businessIds: number[]
): Promise<MsmeBatchRiskPredictionResponse> => {
  try {
    const { data } = await api.post<MsmeBatchRiskPredictionResponse>("/api/v1/msme/predict/batch", {
      business_ids: businessIds,
    });
    return data;
  } catch (error) {
    console.warn("[API Msme Predict Batch] Falling back to mock data for batch ids", businessIds, error);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    const predictions = businessIds.map((id) => {
      const pred = getOrCreatePrediction(id);
      return {
        business_id: id,
        risk_score: pred.risk_score,
        risk_level: pred.risk_level,
        business_name: pred.business_name
      };
    });

    return {
      predicted: businessIds.length,
      failed: 0,
      errors: [],
      predictions,
      isMocked: true
    };
  }
};

/**
 * 3. Get Latest Risk Prediction
 * GET api/v1/msme/risk/{business_id}
 */
export const getLatestMsmeRiskApi = async (
  businessId: number
): Promise<MsmeRiskPrediction> => {
  try {
    const { data } = await api.get<MsmeRiskPrediction>(`/api/v1/msme/risk/${businessId}`);
    return data;
  } catch (error) {
    console.warn(`[API Msme Latest Risk] Falling back to mock data for business_id: ${businessId}`, error);
    await new Promise((resolve) => setTimeout(resolve, 600));
    return getOrCreatePrediction(businessId);
  }
};

/**
 * 4. Get Business Profile
 * GET api/v1/msme/businesses/{business_id}/profile
 */
// export const getMsmeBusinessProfileApi = async (
//   businessId: number
// ): Promise<MsmeBusinessProfile> => {
//   try {
//     const { data } = await api.get<MsmeBusinessProfile>(`/api/v1/msme/businesses/${businessId}/profile`);
//     return data;
//   } catch (error) {
//     console.warn(`[API Msme Profile] Falling back to mock data for business_id: ${businessId}`, error);
//     await new Promise((resolve) => setTimeout(resolve, 500));
//     return getOrCreateProfile(businessId);
//   }
// };


/**
 * Fetches the complete profile and risk details for a specific MSME business.
 * Endpoint: GET /api/v1/msme/{businessId}/profile
 * @param businessId The internal database ID of the business (e.g., 5001)
 */
export const getMSMEProfileApi = async (businessId: number | string): Promise<MSMEProfileResponse> => {
  try {
    const response = await api.get<MSMEProfileResponse>(`/api/v1/msme/${businessId}/profile`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching profile data for MSME ID ${businessId}:`, error);
    throw error;
  }
};

export const getMsmeBusinessProfileApi = async (
  businessId: number
): Promise<MsmeBusinessProfile> => {
  try {
    const { data } = await api.get<MsmeBusinessProfile>(`/api/v1/msme/businesses/${businessId}/profile`);
    return data;
  } catch (error) {
    console.warn(`[API Msme Profile] Falling back to mock data for business_id: ${businessId}`, error);
    await new Promise((resolve) => setTimeout(resolve, 500));
    return getOrCreateProfile(businessId);
  }
};
export const getEarlyBusinessWarningAlertsApi = async () => {
  const { data } = await api.get<EarlyWarningAlert[]>("/api/v1/msme/alerts/early-warning");
  return data;
};

export const getHighRiskBusinessesApi = async (category: "HIGH" | "LOW" = "HIGH") => {
  const { data } = await api.get<HighRiskCustomer[]>("/api/v1/msme/high-risk", {
    params: { risk_category: category, category },
  });
  return data;
};

export const getBusinessRiskHistoryApi = async (businessId: string | number) => {
  const { data } = await api.get<RiskHistoryItem[]>(
    `/api/v1/msme/business/${businessId}/history`
  );
  return data;
};

export const getMSMELoansApi = async (businessId: string | number) => {
  const { data } = await api.get<any>(`/api/v1/msme/${businessId}/loans`);
  return data;
};


export const predictBusinessRiskApi = async (businessId: number, forceRefresh = true) => {
  const { data } = await api.post<any>("/api/v1/msme/predict", {
    business_id: businessId,
    force_refresh: forceRefresh,
  });
  return data;
};

/**
 * 5. Dashboard API
 * GET api/v1/msme/dashboard?top_n=10
 */
export const getMsmeDashboardApi = async (
  topN = 10
): Promise<MsmeDashboardData> => {
  try {
    const { data } = await api.get<MsmeDashboardData>("/api/v1/msme/dashboard", {
      params: { top_n: topN }
    });
    return data;
  } catch (error) {
    console.warn("[API Msme Dashboard] Falling back to mock data", error);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Generate risk trend
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];
    const risk_trend = months.map((_, idx) => ({
      date: `2026-${String(idx + 1).padStart(2, '0')}-01`,
      average_risk_score: parseFloat((45 - (idx * 0.8) + (idx % 2 === 0 ? 1.5 : -1)).toFixed(1)),
      total_predictions: 120 + (idx * 15),
      high_risk_count: 50 - (idx * 2)
    }));

    return {
      portfolio_summary: {
        total_businesses: 500,
        high_risk: 45,
        medium_risk: 150,
        low_risk: 305,
        average_risk_score: 41.6,
        total_credit_lines: 0,
        total_outstanding: 0,
        avg_pd_score: 0,
        risk_distribution: {
          LOW: 0,
          MEDIUM: 0,
          HIGH: 0,
          CRITICAL: 0
        },
        high_risk_count: 0,
        critical_risk_count: 0,
        npa_rate: 0,
        avg_owner_credit_score: 0
      },
      top_alerts: [
        {
          business_id: 101,
          business_name: "ABC Industries",
          alert: "Credit utilization exceeded 90%",
          severity: "HIGH"
        },
        {
          business_id: 104,
          business_name: "OceanBlue Logistics",
          alert: "Multiple recent checks bounced in bank feed",
          severity: "HIGH"
        },
        {
          business_id: 105,
          business_name: "Elite Builders",
          alert: "Pending litigation on secondary project site",
          severity: "MEDIUM"
        },
        {
          business_id: 109,
          business_name: "Zenith Textiles Ltd",
          alert: "Raw materials inventory holding period > 120 days",
          severity: "MEDIUM"
        }
      ],
      risk_trend,
      isMocked: true
    };
  }
};

/**
 * 6. High Risk Businesses
 * GET api/v1/msme/high-risk?page=1&size=20
 */

export const getMsmeAccountsByRiskCategoryApi = async (
  riskCategory: string,
  params: RiskCategoryParams = {}
): Promise<RiskCategoryResponse> => {
  const { data } = await api.get<RiskCategoryResponse>(
    `/api/v1/msme/risk-category/${encodeURIComponent(riskCategory.toLowerCase())}`,
    { params }
  );
  return data;
};

export const getHighRiskMsmeBusinessesApi = async (
  page = 1,
  size = 15
): Promise<MsmeHighRiskResponse> => {
  try {
    const { data } = await api.get<MsmeHighRiskResponse>("/api/v1/msme/high-risk", {
      params: { page, size }
    });
    
    return data;
  } catch (error) {
    console.warn(`[API Msme High Risk] Falling back to mock data for page: ${page}`, error);
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Filter MOCK profiles and predictions to find high risk
    const allHighRisk = MOCK_MSME_PROFILES.map((p) => {
      const pred = getOrCreatePrediction(p.id);
      return {
        business_id: p.id,
        business_name: p.business_name,
        risk_score: pred.risk_score,
        risk_level: pred.risk_level,
        probability_of_default: pred.probability_of_default
      };
    }).filter(item => item.risk_level === "HIGH" || item.risk_level === "CRITICAL" || item.risk_score > 60);

    const total = allHighRisk.length;
    console.log(total)
    const pages = Math.ceil(total / size) || 1;
    const startIndex = (page - 1) * size;
    const items = allHighRisk.slice(startIndex, startIndex + size);

    return {
      page,
      size,
      total,
      pages,
      items,
      isMocked: true
    };
  }
};