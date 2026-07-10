import {
  Building2,
  ShieldAlert as MediumIcon,
  ShieldAlert,
  ShieldCheck,
  ShieldX
} from "lucide-react";
import { useEffect, useState } from "react";

import {
  getLatestMsmeRiskApi,
  getMsmeBusinessProfileApi,
  getMsmeDashboardApi,
  predictMsmeRiskApi,
  predictMsmeRiskBatchApi,
  type MsmeBatchRiskPredictionResponse,
  type MsmeBusinessProfile,
  type MsmeDashboardData,
  type MsmeRiskPrediction,
} from "../components/api/msme";

import HighRiskPortfolio from "@/components/msme/HighRiskPortfolio";
import MSMERiskDrillDownChart from "@/components/msme/MSMERiskDrillDownChart";

export default function MsmeDashboard() {
  // Sample dashboard data (provided by user) for demo/preview
  const initialDashboardData: MsmeDashboardData = {
    portfolio_summary: {
      total_businesses: 4000,
      total_credit_lines: 8567,
      total_outstanding: 6516176859.9,
      avg_pd_score: 0.2137,
      risk_distribution: {
        LOW: 219,
        MEDIUM: 15,
        HIGH: 6,
        CRITICAL: 57,
      },
      high_risk_count: 6,
      critical_risk_count: 57,
      npa_rate: 0.0,
      avg_owner_credit_score: 672.64,
      high_risk: 0,
      medium_risk: 0,
      low_risk: 0,
      average_risk_score: 0
    },
    top_alerts: [],
    risk_trend: [],
  };

  // Global dashboard summary state (Endpoint 5)
  const [dashboardData, setDashboardData] = useState<MsmeDashboardData | null>(
    initialDashboardData,
  );
  
  const [topN, setTopN] = useState<number>(10);
  const [isOverviewLoading, setIsOverviewLoading] = useState<boolean>(true);

  // Single business intelligence inspector state (Endpoints 1, 3, 4)
  const [searchId, setSearchId] = useState<string>("101");
  const [forceRefresh, setForceRefresh] = useState<boolean>(false);
  const [inspectProfile, setInspectProfile] =
    useState<MsmeBusinessProfile | null>(null);
  const [inspectPrediction, setInspectPrediction] =
    useState<MsmeRiskPrediction | null>(null);
  const [inspectLoading, setInspectLoading] = useState<boolean>(false);
  const [inspectError, setInspectError] = useState<string | null>(null);
  const [inspectTab, setInspectTab] = useState<"visual" | "json">("visual");
  const [inspectLastAction, setInspectLastAction] = useState<string>("");
  const [rawJsonResponse, setRawJsonResponse] = useState<any>(null);

  // Batch prediction state (Endpoint 2)
  const [batchIdsText, setBatchIdsText] = useState<string>("101, 102, 103");
  const [batchResponse, setBatchResponse] =
    useState<MsmeBatchRiskPredictionResponse | null>(null);
  const [isBatchLoading, setIsBatchLoading] = useState<boolean>(false);
  const [batchError, setBatchError] = useState<string | null>(null);
  const [batchTab, setBatchTab] = useState<"visual" | "json">("visual");

  // Load Dashboard summary data
  const loadDashboardSummary = async () => {
    setIsOverviewLoading(true);
    try {
      const data:any = await getMsmeDashboardApi(topN);

      setDashboardData(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsOverviewLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardSummary();
  }, [topN]);

  // Handler: Get Business Profile (Endpoint 4)
  // const handleFetchProfile = async () => {
  //   if (!searchId.trim()) return;
  //   const idVal = Number(searchId);
  //   if (isNaN(idVal) || idVal <= 0) {
  //     setInspectError("Please enter a valid positive Business ID.");
  //     setInspectProfile(null);
  //     setInspectPrediction(null);
  //     setRawJsonResponse(null);
  //     return;
  //   }
  //   setInspectLoading(true);
  //   setInspectError(null);
  //   setInspectLastAction("Get Business Profile");
  //   try {
  //     const profile = await getMsmeBusinessProfileApi(idVal);
  //     setInspectProfile(profile);
  //     setRawJsonResponse(profile);
  //   } catch (err: any) {
  //     setInspectError(err.message || "Failed to load business profile");
  //     setInspectProfile(null);
  //     setRawJsonResponse(null);
  //   } finally {
  //     setInspectLoading(false);
  //   }
  // };

  // Handler: Get Latest Risk Prediction (Endpoint 3)
  // const handleFetchLatestRisk = async () => {
  //   if (!searchId.trim()) return;
  //   const idVal = Number(searchId);
  //   if (isNaN(idVal) || idVal <= 0) {
  //     setInspectError("Please enter a valid positive Business ID.");
  //     setInspectProfile(null);
  //     setInspectPrediction(null);
  //     setRawJsonResponse(null);
  //     return;
  //   }
  //   setInspectLoading(true);
  //   setInspectError(null);
  //   setInspectLastAction("Get Latest Risk Prediction");
  //   try {
  //     const risk = await getLatestMsmeRiskApi(idVal);
  //     setInspectPrediction(risk);
  //     setRawJsonResponse(risk);
  //   } catch (err: any) {
  //     setInspectError(err.message || "Failed to load risk prediction");
  //     setInspectPrediction(null);
  //     setRawJsonResponse(null);
  //   } finally {
  //     setInspectLoading(false);
  //   }
  // };

  // Handler: Predict Risk Single Business (Endpoint 1)
  // const handlePredictRisk = async () => {
  //   if (!searchId.trim()) return;
  //   const idVal = Number(searchId);
  //   if (isNaN(idVal) || idVal <= 0) {
  //     setInspectError("Please enter a valid positive Business ID.");
  //     setInspectProfile(null);
  //     setInspectPrediction(null);
  //     setRawJsonResponse(null);
  //     return;
  //   }
  //   setInspectLoading(true);
  //   setInspectError(null);
  //   setInspectLastAction("Predict Risk (Single)");
  //   try {
  //     const risk = await predictMsmeRiskApi(idVal, forceRefresh);
  //     setInspectPrediction(risk);
  //     setRawJsonResponse(risk);
  //     // Refresh dashboard summary in background (high-risk list refreshes itself independently)
  //     loadDashboardSummary();
  //   } catch (err: any) {
  //     setInspectError(err.message || "Risk prediction failed");
  //     setInspectPrediction(null);
  //     setRawJsonResponse(null);
  //   } finally {
  //     setInspectLoading(false);
  //   }
  // };

  // Handler: Predict Risk Batch (Endpoint 2)
  // const handleBatchPredict = async () => {
  //   if (!batchIdsText.trim()) return;
  //   setIsBatchLoading(true);
  //   setBatchError(null);
  //   try {
  //     const ids = batchIdsText
  //       .split(",")
  //       .map((s) => Number(s.trim()))
  //       .filter((n) => !isNaN(n) && n > 0);

  //     if (ids.length === 0) {
  //       throw new Error("Please enter valid comma-separated numerical IDs.");
  //     }

  //     const response = await predictMsmeRiskBatchApi(ids);
  //     setBatchResponse(response);
  //     // Refresh dashboard summary in background
  //     loadDashboardSummary();
  //   } catch (err: any) {
  //     setBatchError(err.message || "Batch prediction failed");
  //     setBatchResponse(null);
  //   } finally {
  //     setIsBatchLoading(false);
  //   }
  // };

  // const portfolio = dashboardData?.portfolio_summary || {
  //   total_businesses: 500,
  //   high_risk: 45,
  //   medium_risk: 150,
  //   low_risk: 305,
  //   average_risk_score: 41.6,
  // };

  return (
    <div className="space-y-6 text-zinc-800 dark:text-zinc-200">
      {/* 1. Portfolio Overview Metrics & Trend Graph */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Metric Summaries */}
        <div className="lg:col-span-1 flex flex-col gap-1 justify-between">
          <div className="grid grid-cols-2 gap-4">
            {/* Total Businesses */}
            <div className="col-span-2 p-5 bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xs">
              <div className="flex justify-between items-start">
                <p className="text-xs font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                  Total Businesses
                </p>
                <Building2 className="w-4 h-4 text-zinc-400 dark:text-zinc-500" />
              </div>
              <h3 className="text-3xl font-bold text-zinc-900 dark:text-white mt-1.5">
                {isOverviewLoading
                  ? "..."
                  : dashboardData?.portfolio_summary?.total_businesses?.toLocaleString()}
              </h3>
              <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-2">
                Aggregated commercial credit clients
              </p>
            </div>

            {/* Critical Risk */}
            <div className="p-4 bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xs min-h-[110px] flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start">
                  <p className="text-[11px] font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                    Critical
                  </p>
                  <ShieldX className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
                </div>
                <h4 className="text-xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">
                  {isOverviewLoading
                    ? "..."
                    : dashboardData?.portfolio_summary?.critical_risk_count}
                </h4>
              </div>
              <p className="text-[10px] text-zinc-400 dark:text-zinc-500">
                Requires review
              </p>
            </div>

            {/* High Risk Count */}
            <div className="p-4 bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xs min-h-[110px] flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start">
                  <p className="text-[11px] font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                    High Risk
                  </p>
                  <ShieldAlert className="w-4 h-4 text-rose-500 dark:text-rose-400" />
                </div>
                <h4 className="text-xl font-bold text-rose-600 dark:text-rose-400 mt-1">
                  {isOverviewLoading
                    ? "..."
                    : dashboardData?.portfolio_summary?.high_risk_count}
                </h4>
              </div>
              <p className="text-[10px] text-zinc-400 dark:text-zinc-500">
                Requires review
              </p>
            </div>

            {/* Medium Risk */}
            <div className="p-4 bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xs min-h-[110px] flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start">
                  <p className="text-[11px] font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                    Medium Risk
                  </p>
                  <MediumIcon className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                </div>
                <h4 className="text-xl font-bold text-amber-600 dark:text-amber-450 mt-1">
                  {isOverviewLoading
                    ? "..."
                    : dashboardData?.portfolio_summary?.risk_distribution
                        ?.MEDIUM}
                </h4>
              </div>
              <p className="text-[10px] text-zinc-400 dark:text-zinc-500">
                Regular checks
              </p>
            </div>

            {/* Low Risk */}
            <div className="p-4 bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xs min-h-[110px] flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start">
                  <p className="text-[11px] font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                    Low Risk
                  </p>
                  <ShieldCheck className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                </div>
                <h4 className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                  {isOverviewLoading
                    ? "..."
                    : dashboardData?.portfolio_summary?.risk_distribution?.LOW}
                </h4>
              </div>
              <p className="text-[10px] text-zinc-400 dark:text-zinc-500">
                Standard monitoring
              </p>
            </div>
          </div>
        </div>

        
        <MSMERiskDrillDownChart />
      </div>

      {/* 4. High Risk Businesses Registry
          Self-contained component: owns its own data/page/loading state,
          so pagination clicks inside it never re-render this parent. */}
      <HighRiskPortfolio pageSize={6} />


      
    </div>
  );
}
