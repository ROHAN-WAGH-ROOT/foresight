import { Modal } from "@/components/ui/CustomModal";
import {
  AlertOctagon,
  Briefcase,
  Clock,
  Database,
  FileText,
  Loader2,
  MapPin,
  RefreshCw,
  Search,
  ShieldAlert,
  TrendingUp,
  User
} from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  // batchRiskPredictionApi,
  getCustomerLoansApi,
  getCustomerProfileApi,
  getCustomerRiskHistoryApi,
  getEarlyCustomerWarningAlertsApi,
  getHighRiskCustomersApi,
  predictCustomerRiskApi,
  searchCustomerApi,
  type Customer,
  type CustomerProfile,
  // type EarlyWarningAlert,
  type HighRiskCustomer,
  type Loan,
  type RiskHistoryItem,
} from "../components/api";

function CustomerRisk() {
  // Search & Navigation
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Customer[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(
    null,
  );

  // Alert queues
  const [highRiskList, setHighRiskList] = useState<HighRiskCustomer[]>([]);
  // const [earlyWarnings, setEarlyWarnings] = useState<EarlyWarningAlert[]>([]);
  // const [activeQueueTab, setActiveQueueTab] = useState<
  //   "warnings" | "highrisk" | "results"
  // >("warnings");

  // Profile data
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [history, setHistory] = useState<RiskHistoryItem[]>([]);
  const [activeDetailTab, setActiveDetailTab] = useState<
    "risk" | "loans" | "history"
  >("risk");

  // Batch action state
  // const [batchStatus, setBatchStatus] = useState<string | null>(null);
  // const [isBatchRunning, setIsBatchRunning] = useState(false);

  // Loaders
  const [isSearching, setIsSearching] = useState(false);
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [revealedHistoryCount, setRevealedHistoryCount] = useState(0);

  // Initialize early warnings and high risk queue
  const loadQueues = async () => {
    try {
      const warnings = await getEarlyCustomerWarningAlertsApi();
        (warnings);
      // setEarlyWarnings((prev) => [...prev, highRisk])

      const highRisk = await getHighRiskCustomersApi("HIGH");
      setHighRiskList(highRisk);
    } catch (error) {
      console.error("Failed to load warning queues:", error);
    }
  };

  useEffect(() => {
    loadQueues();
  }, []);
  {
    console.log(profile?.latest_risk);
  }

  // Search handler
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    // setActiveQueueTab("results");
    try {
      // Search using general queries: try full_name, email, phone, customer_id
      const query = searchQuery.trim();
      const results = await searchCustomerApi({
        q: query,
        customer_id: query.startsWith("CUS") ? query : undefined,
        email: query.includes("@") ? query : undefined,
        phone: query.startsWith("+") ? query : undefined,
      });
      setSearchResults(results);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsSearching(false);
    }
  };

  // Select customer detail page
  const selectCustomer = async (id: number) => {
    setSelectedCustomerId(id);
    setIsProfileLoading(true);
    setActiveDetailTab("risk");
    try {
      const profileData = await getCustomerProfileApi(id);
      setProfile(profileData);

      const loanData = await getCustomerLoansApi(id);
      setLoans(loanData);

      const historyData = await getCustomerRiskHistoryApi(id);
      setHistory(Array.isArray(historyData) ? historyData : [historyData]);
    } catch (error) {
      console.error("Failed to load customer profile details:", error);
    } finally {
      setIsProfileLoading(false);
    }
  };

  // Trigger evaluation
  const handleEvaluate = async () => {
    if (!selectedCustomerId) return;
    setIsEvaluating(true);
    try {
      await predictCustomerRiskApi(selectedCustomerId, true);
      // Reload profile
      await selectCustomer(selectedCustomerId);
      // Refresh early warning alerts/high risk queues
      await loadQueues();
    } catch (error) {
      console.error("Failed to evaluate risk:", error);
    } finally {
      setIsEvaluating(false);
    }
  };
  useEffect(() => {
    if (activeDetailTab !== "history" || history.length === 0) {
      setRevealedHistoryCount(0);
      return;
    }
    setRevealedHistoryCount(0);
    let i = 0;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const step = () => {
      i += 1;
      setRevealedHistoryCount(i);
      if (i < history.length) timers.push(setTimeout(step, 90));
    };
    timers.push(setTimeout(step, 100));
    return () => timers.forEach(clearTimeout);
  }, [activeDetailTab, history]);

  // Run Batch evaluation
  // const handleBatchEvaluate = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   const ids = batchInput
  //     .split(",")
  //     .map((id) => parseInt(id.trim()))
  //     .filter((id) => !isNaN(id));

  //   if (ids.length === 0) {
  //     // setBatchStatus("Please enter valid, comma-separated customer IDs.");
  //     return;
  //   }

  //   // setIsBatchRunning(true);
  //   // setBatchStatus("Executing batch predictions...");
  //   try {
  //     // const res = await batchRiskPredictionApi(ids);
  //     // setBatchStatus(
  //     //   `Successfully processed ${res.processed} customers. Batch completed.`,
  //     // );
  //     setBatchInput("");
  //     await loadQueues();
  //   } catch (error: any) {
  //     console.error("Batch run failed:", error);
  //     // setBatchStatus("Batch prediction failed. Check inputs or connection.");
  //   } finally {
  //     // setIsBatchRunning(false);
  //   }
  // };

  // Parse JSON representations safely
  const parseJsonList = (jsonStr: any): string[] => {
    if (!jsonStr) return [];
    if (Array.isArray(jsonStr)) return jsonStr;
    try {
      const parsed = JSON.parse(jsonStr);
      return Array.isArray(parsed) ? parsed : [jsonStr.toString()];
    } catch {
      return [jsonStr.toString()];
    }
  };

  // const parseJsonObject = (jsonStr: any): Record<string, number> => {
  //   if (!jsonStr) return {};
  //   if (typeof jsonStr === "object") return jsonStr;
  //   try {
  //     return JSON.parse(jsonStr);
  //   } catch {
  //     return {};
  //   }
  // };

  const getRiskColor = (category: string) => {
    switch (category?.toUpperCase()) {
      case "CRITICAL":
        return "text-rose-600 bg-rose-50 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-900/30";
      case "HIGH":
        return "text-orange-600 bg-orange-50 border-orange-200 dark:bg-orange-950/30 dark:text-orange-400 dark:border-orange-900/30";
      case "MEDIUM":
        return "text-amber-600 bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/30";
      case "LOW":
        return "text-emerald-600 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/30";
      default:
        return "text-slate-500 bg-slate-50 border-slate-200";
    }
  };

  const getHistoryRiskMeta = (category: string) => {
    switch (category?.toUpperCase()) {
      case "CRITICAL":
        return {
          text: "text-rose-600 dark:text-rose-400",
          border: "border-rose-300/60 dark:border-rose-800/60",
          dot: "bg-rose-500",
          grad: "from-rose-500/10 via-rose-500/[0.03] to-transparent",
          badge:
            "text-rose-600 bg-rose-50 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-900/30",
          glow: "shadow-[0_0_0_1px_rgba(244,63,94,0.06)] hover:shadow-[0_8px_28px_-8px_rgba(244,63,94,0.35)]",
          ring: "#f43f5e",
        };
      case "HIGH":
        return {
          text: "text-orange-600 dark:text-orange-400",
          border: "border-orange-300/60 dark:border-orange-800/60",
          dot: "bg-orange-500",
          grad: "from-orange-500/10 via-orange-500/[0.03] to-transparent",
          badge:
            "text-orange-600 bg-orange-50 border-orange-200 dark:bg-orange-950/30 dark:text-orange-400 dark:border-orange-900/30",
          glow: "shadow-[0_0_0_1px_rgba(249,115,22,0.06)] hover:shadow-[0_8px_28px_-8px_rgba(249,115,22,0.35)]",
          ring: "#f97316",
        };
      case "MEDIUM":
        return {
          text: "text-amber-600 dark:text-amber-400",
          border: "border-amber-300/60 dark:border-amber-800/60",
          dot: "bg-amber-500",
          grad: "from-amber-500/10 via-amber-500/[0.03] to-transparent",
          badge:
            "text-amber-600 bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/30",
          glow: "shadow-[0_0_0_1px_rgba(245,158,11,0.06)] hover:shadow-[0_8px_28px_-8px_rgba(245,158,11,0.35)]",
          ring: "#f59e0b",
        };
      default: // LOW
        return {
          text: "text-emerald-600 dark:text-emerald-400",
          border: "border-emerald-300/60 dark:border-emerald-800/60",
          dot: "bg-emerald-500",
          grad: "from-emerald-500/10 via-emerald-500/[0.03] to-transparent",
          badge:
            "text-emerald-600 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/30",
          glow: "shadow-[0_0_0_1px_rgba(16,185,129,0.06)] hover:shadow-[0_8px_28px_-8px_rgba(16,185,129,0.35)]",
          ring: "#10b981",
        };
    }
  };

  // small conic-gradient dial for default probability
  function HistoryScoreRing({
    value,
    color,
  }: {
    value: number;
    color: string;
  }) {
    const pct = Math.round(value * 100);
    return (
      <div
        className="relative w-12 h-12 rounded-full flex items-center justify-center shrink-0"
        style={{
          background: `conic-gradient(${color} ${pct * 3.6}deg, rgba(148,163,184,0.15) 0deg)`,
        }}
      >
        <div className="absolute inset-[3px] rounded-full bg-white dark:bg-slate-900 flex items-center justify-center">
          <span className="text-[10px] font-bold text-slate-800 dark:text-slate-200">
            {pct}%
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-6 flex flex-col xl:flex-row gap-6 transition-colors duration-300">
      {/* Left panel - Search, Queue, Batch predictions */}
      <div className="w-full xl:w-96 flex flex-col gap-6 flex-shrink-0">
        {/* Customer Search Panel */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4">
          <h2 className="text-sm font-bold tracking-wider text-slate-900 dark:text-white">
            Customer Lookup
          </h2>
          <form onSubmit={handleSearch} className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Search Name, ID, Email, Phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </form>
        </div>
        {/* Audit Queue Container */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm overflow-hidden flex-1 flex flex-col min-h-0 w-full">
          {/* Header/Title Info */}
          <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/40 flex justify-between items-center">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 tracking-wide uppercase">
              {searchResults.length > 0 ? "Search Results" : "Risk Audit Queue"}
            </span>
            <span className="text-[10px] bg-slate-200/60 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-full font-medium">
              {searchResults.length > 0
                ? searchResults.length
                : highRiskList.length}{" "}
              items
            </span>
          </div>

          {/* Queue List Content Area */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 max-h-[60vh] sm:max-h-[80vh] md:max-h-screen">
            {/* 1. Search Results State (Overrides standard list when a active search exists) */}
            {searchResults.length > 0 ? (
              isSearching ? (
                <div className="p-6 text-center flex items-center justify-center gap-2 text-slate-400 text-xs">
                  <Loader2 className="w-4 h-4 animate-spin" /> Searching...
                </div>
              ) : (
                searchResults.map((customer) => (
                  <div
                    key={customer.id}
                    onClick={() => selectCustomer(customer.id)}
                    className={`p-4 text-left hover:bg-slate-50/70 dark:hover:bg-slate-800/30 cursor-pointer transition-colors ${selectedCustomerId === customer.id ? "bg-slate-100/50 dark:bg-slate-800/60" : ""}`}
                  >
                    <div className="font-semibold text-xs text-slate-900 dark:text-slate-100">
                      {customer.full_name || customer.name}
                    </div>

                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 flex flex-wrap gap-x-2 gap-y-0.5">
                      <span>
                        ID: {customer.customer_id || `CUS-${customer.id}`}
                      </span>
                      <span className="text-slate-300 dark:text-slate-700">
                        •
                      </span>
                      <span>Credit Score: {customer.credit_score}</span>
                      <span className="w-full block text-slate-400">
                        {customer.city}, {customer.state}
                      </span>
                    </div>
                  </div>
                ))
              )
            ) : /* 2. Default High Risk List View */
            highRiskList.length === 0 ? (
              <div className="p-6 text-center text-slate-400 text-xs">
                No risk customers listed.
              </div>
            ) : (
              highRiskList.map((risk) => (
                <div
                  key={risk.customer_id}
                  onClick={() => selectCustomer(risk.customer_id)}
                  className={`p-4 text-left hover:bg-slate-50/70 dark:hover:bg-slate-800/30 cursor-pointer transition-colors ${selectedCustomerId === risk.customer_id ? "bg-slate-100/50 dark:bg-slate-800/60" : ""}`}
                >
                  <div className="flex justify-between items-start gap-2 mb-1">
                    <span className="font-semibold text-xs text-slate-900 dark:text-slate-100 truncate">
                      {risk.customer_name}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded font-bold border shrink-0 text-orange-600 bg-orange-50 border-orange-200 dark:bg-orange-950/30 dark:text-orange-400 dark:border-orange-900/30">
                      {risk.risk_category}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Right panel - Selected Customer profile & detailed risk assessment sheets */}
      <div className="flex-1 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl shadow-sm flex flex-col overflow-hidden min-h-[600px]">
        {isProfileLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 text-slate-400">
            <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
            <span className="text-sm font-semibold">
              Decrypting credit risk profiles...
            </span>
          </div>
        ) : !profile ? (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-450 p-8 text-center">
            <ShieldAlert className="w-12 h-12 text-slate-300 dark:text-slate-700 mb-3" />
            <h3 className="text-lg font-bold">No Customer Inspected</h3>
            <p className="text-sm text-slate-400 max-w-sm mt-1">
              Select an account from the early warning alert queues, high risk
              arrays, or perform lookup.
            </p>
          </div>
        ) : (
          <div className="flex-1 flex flex-col overflow-y-auto">
            {/* Header info sheet */}
            <div className="p-6 bg-slate-50/70 dark:bg-slate-800/30 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-start gap-4 text-left">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <User className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h2 className="text-xl font-bold tracking-tight text-slate-950 dark:text-white">
                    {profile.customer.full_name || profile.customer.name}{" "}
                    <span
                      className={`inline-flex px-2.5 py-0.5 text-xs font-extrabold rounded-md border uppercase tracking-wider ${getRiskColor(profile.latest_risk.risk_category)}`}
                    >
                      {profile.latest_risk.risk_category}
                    </span>
                  </h2>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400 font-medium">
                    <span>
                      ID:{" "}
                      {profile.customer.customer_id ||
                        `CUS-${profile.customer.id}`}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" /> {profile.customer.city}
                      , {profile.customer.state}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Briefcase className="w-3.5 h-3.5" />{" "}
                      {profile.customer.employment_type?.replace("_", " ")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action refresh risk prediction */}
              <div className="flex gap-1.5">
                <button
                  onClick={handleEvaluate}
                  disabled={isEvaluating}
                  className="self-start md:self-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-40 disabled:pointer-events-none"
                >
                  {isEvaluating ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <RefreshCw className="w-3.5 h-3.5" />
                  )}
                  Run Risk Evaluation
                </button>

                <button
                  onClick={() => {
                    setOpenModal(true);
                  }}
                  className="self-start md:self-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-40 disabled:pointer-events-none"
                >
                  AI Recommended Action Plan
                </button>
              </div>
            </div>

            {/* Assumes 'data' variable contains your object:
  { customer_id: 2996, default_probability_pct: 73.98, feature_importance: "...", ... } 
*/}

            <Modal
              isOpen={openModal}
              onClose={() => setOpenModal(false)}
              title="AI Recommended Action"
            >
              {/* Modern Gradient Backdrop Accent inside the Modal */}
              <div className="absolute top-0 right-0 -z-10 h-32 w-32 rounded-full bg-gradient-to-tr from-rose-400/20 to-amber-300/30 blur-2xl" />
              <div className="absolute top-12 left-0 -z-10 h-24 w-24 rounded-full bg-gradient-to-br from-indigo-400/10 to-purple-400/20 blur-xl" />

              {(() => {
                // Safely parse incoming data arrays & weights
                const features = JSON.parse(
                  profile?.latest_risk?.feature_importance || "{}",
                );
                const actions = JSON.parse(
                  profile?.latest_risk?.recommended_action || "[]",
                );
                const reasons = JSON.parse(
                  profile?.latest_risk?.risk_reasons || "[]",
                );

                return (
                  <div className="space-y-5">
                    {/* Highlighted AI Warning Banner with Gradient Border effect */}
                    <div className="relative overflow-hidden rounded-xl bg-neutral-900 dark:bg-slate-950 p-4 text-white shadow-lg border border-neutral-800 dark:border-slate-800">
                      {/* Background radial gradient glow */}
                      <div className="absolute -right-4 -top-8 h-24 w-24 rounded-full bg-rose-500/30 blur-xl" />

                      <div className="flex items-start gap-3">
                        <div className="rounded-lg bg-rose-500/20 p-2 text-rose-400 border border-rose-500/30 shrink-0">
                          <svg
                            className="h-5 w-5 animate-pulse"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                          </svg>
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[14px] font-mono text-white">
                              Name: {profile?.customer?.full_name}
                            </span>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-rose-400 bg-rose-950/80 px-2 py-0.5 rounded-full border border-rose-800/50">
                              {profile?.latest_risk?.risk_category ||
                                "CRITICAL"}{" "}
                              Status
                            </span>
                          </div>
                          <h4 className="text-base font-bold text-neutral-100 mt-1">
                            {profile?.latest_risk?.will_default_12m
                              ? "Imminent Default Risk Flagged"
                              : "Monitored Account Status"}
                          </h4>
                          <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                            {reasons[0] ||
                              "AI models have noted high variance metrics across primary billing benchmarks."}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Cards & Graphs Section */}
                    <div className="grid grid-cols-2 gap-3">
                      {/* Metric Card */}
                      <div className="rounded-xl border border-neutral-200 dark:border-slate-800 bg-neutral-50/50 dark:bg-slate-900/40 p-3 shadow-sm">
                        <span className="text-xs font-medium text-neutral-500 dark:text-slate-400 block">
                          Risk Score
                        </span>
                        <div className="mt-1 flex items-baseline gap-1">
                          <span className="text-2xl font-black tracking-tight text-neutral-900 dark:text-slate-50">
                            {profile?.latest_risk?.risk_score || "0"}%
                          </span>
                        </div>
                      </div>

                      {/* Mini Risk-Trajectory Graph representing Feature Weights */}


                      {/* <div className="rounded-xl border border-neutral-200 dark:border-slate-800 bg-neutral-50/50 dark:bg-slate-900/40 p-3 shadow-sm flex flex-col justify-between">
                        <div>
                          <span className="text-xs font-medium text-neutral-500 dark:text-slate-400 block">
                            Top Trigger Profile
                          </span>
                          <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 mt-0.5 block truncate capitalize">
                            {Object.keys(features)[0]?.replace(/_/g, " ") ||
                              "No metrics matched"}
                          </span>
                        </div>
                        
                        <div className="mt-2 flex items-end gap-1.5 h-6">
                          {Object.values(features).map((val: any, index) => (
                            <div
                              key={index}
                              className="w-full bg-indigo-500 dark:bg-indigo-600 rounded-t-xs transition-all duration-300"
                              style={{
                                height: `${Math.min((val / 2) * 100, 100)}%`,
                              }}
                              title={`Weight: ${val}`}
                            />
                          ))}
                        </div>
                      </div> */}
                    </div>

                    {/* Dynamic Underlying Reasons Box */}
                    {reasons.length > 1 && (
                      <div className="mt-3 rounded-xl border border-red-200 bg-red-50 p-3 dark:border-red-900/40 dark:bg-red-950/20">
                        <span className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-red-600 dark:text-red-400">
                          Supporting Indicators
                        </span>

                        <ul className="space-y-1.5 pl-5 text-[13px] text-red-700 dark:text-red-300 list-disc marker:text-red-500 dark:marker:text-red-400">
                          {reasons
                            .slice(1, 4)
                            .map((reason: string, idx: number) => (
                              <li key={idx} className="leading-relaxed">
                                {reason}
                              </li>
                            ))}
                        </ul>
                      </div>
                    )}

                    {/* Highlights & AI Action Steps */}
                    <div className="space-y-2.5">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-slate-500">
                        AI Pre-emptive Action Plan
                      </h4>

                      <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                        {actions.map((action: string, i: number) => {
                          const isUrgent = action.startsWith("URGENT");
                          return (
                            <div
                              key={i}
                              className={`group flex items-start gap-3 rounded-lg border p-2.5 shadow-sm transition-colors ${
                                isUrgent
                                  ? "bg-red-50/60 dark:bg-red-950/20 border-red-200 dark:border-red-900/50 text-red-950 dark:text-red-200"
                                  : "bg-white dark:bg-slate-900 border-neutral-100 dark:border-slate-800 text-neutral-800 dark:text-slate-300 hover:border-indigo-200 dark:hover:border-indigo-900"
                              }`}
                            >
                              <span
                                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-xs font-bold ${
                                  isUrgent
                                    ? "bg-red-600 text-white"
                                    : "bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400"
                                }`}
                              >
                                {i + 1}
                              </span>
                              <div>
                                <h5 className="text-xs font-bold leading-tight">
                                  {action}
                                </h5>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Modal Footer actions */}
                    <div className="flex items-center justify-between pt-3 border-t border-neutral-100 dark:border-slate-800">
                      <span className="text-[10px] font-mono text-neutral-400 dark:text-slate-500">
                        {/* Sync timestamp section */}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setOpenModal(false)}
                          className="rounded-lg border border-neutral-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-sm font-medium text-neutral-700 dark:text-slate-300 hover:bg-neutral-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </Modal>
            {/* Profile Overview Indicators Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-5 border-b border-slate-100 dark:border-slate-800 text-left">
              {/* Credit Score */}
              <div className="p-4.5 border-r border-slate-100 dark:border-slate-800 space-y-1">
                <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                  Credit Score
                </span>
                <div className="text-[18px] font-extrabold">
                  {profile.customer.credit_score}
                </div>
                <span className="text-[10px] text-slate-400 dark:text-slate-500">
                  Underwriting scoring range
                </span>
              </div>

              {/* Monthly Income */}
              <div className="p-4.5 border-r border-slate-100 dark:border-slate-800 space-y-1">
                <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                  Monthly Income
                </span>
                <div className="text-[18px] font-extrabold">
                  ₹{profile.customer.monthly_income?.toLocaleString() || 0}
                </div>
                <span className="text-[10px] text-slate-400 dark:text-slate-500">
                  Declared salary/revenue
                </span>
              </div>

              {/* Total Loans */}
              <div className="p-4.5 border-r border-slate-100 dark:border-slate-800 space-y-1">
                <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                  Total Loans
                </span>
                <div className="text-[18px] font-extrabold text-indigo-600 dark:text-indigo-400">
                  {profile.active_loans_count}
                </div>
                <span className="text-[10px] text-slate-400 dark:text-slate-500">
                  Total loans taken
                </span>
              </div>

              {/* Total Outstanding */}
              <div className="p-4 border-r border-slate-100 dark:border-slate-800 space-y-1">
                <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                  Total Outstanding
                </span>
                <div className="text-[18px] font-extrabold text-rose-500">
                  ₹{profile.total_outstanding.toLocaleString()}
                </div>
                <span className="text-[10px] text-slate-400 dark:text-slate-500">
                  Total remaining liabilities
                </span>
              </div>

              {/* Fifth Card */}
              <div className="p-4 space-y-1">
                <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                  Probability Default
                </span>

                <div className="text-[18px] font-extrabold text-rose-500 dark:text-rose-50000">
                  {(profile.latest_risk.pd_score * 100).toFixed(2)}%
                </div>

                <span className="text-[10px] text-slate-400 dark:text-slate-500">
                  PD engine index score
                </span>
              </div>
            </div>

            {/* Detailed Tabs Header */}
            <div className="flex border-b border-slate-100 dark:border-slate-800 text-xs font-bold">
              <button
                onClick={() => setActiveDetailTab("risk")}
                className={`px-6 py-4 transition-all border-b-2 cursor-pointer ${
                  activeDetailTab === "risk"
                    ? "border-indigo-500 text-indigo-600 dark:text-indigo-400"
                    : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
                }`}
              >
                Risk Assessment Summary
              </button>
              <button
                onClick={() => setActiveDetailTab("loans")}
                className={`px-6 py-4 transition-all border-b-2 cursor-pointer ${
                  activeDetailTab === "loans"
                    ? "border-indigo-500 text-indigo-600 dark:text-indigo-400"
                    : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
                }`}
              >
                Loans list ({loans.length})
              </button>
              <button
                onClick={() => setActiveDetailTab("history")}
                className={`px-6 py-4 transition-all border-b-2 cursor-pointer ${
                  activeDetailTab === "history"
                    ? "border-indigo-500 text-indigo-600 dark:text-indigo-400"
                    : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
                }`}
              >
                Risk Evaluation History ({history.length})
              </button>
            </div>

            {/* Tabs Details Content */}
            <div className="p-6 flex-1 text-left">
              {/* Tab 1: Risk Assessment Summary */}
              {activeDetailTab === "risk" &&
                (!profile.latest_risk ? (
                  <div className="py-12 text-center text-slate-400 text-sm">
                    <Database className="w-8 h-8 mx-auto mb-2 text-slate-350" />
                    No previous risk assessments recorded. Please execute a Risk
                    Evaluation.
                  </div>
                ) : (
                  <div className="space-y-8 animate-fade-in">
                    {/* Risk parameters */}
                    {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="p-4 rounded-2xl  border border-slate-200/60 dark:bg-indigo-500 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/10 space-y-1">
                        <span className="text-[10px] font-semibold text-slate-400 dark:text-white uppercase tracking-wider">
                          Probability of Default (PD)
                        </span>
                        <div className="text-2xl font-black text-slate-900 dark:text-white">
                          {(profile.latest_risk.pd_score * 100).toFixed(2)}%
                        </div>
                        <div className="text-[10px] text-slate-400 dark:text-white font-medium">
                          PD engine index score
                        </div>
                      </div>

                      <div className="p-4 rounded-2xl border dark:bg-indigo-500 border-slate-200/60 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/10 space-y-1">
                        <span className="text-[10px] font-semibold text-slate-400 dark:text-white uppercase tracking-wider">
                          Risk Classification
                        </span>
                        <div>
                          <span
                            className={`inline-flex px-2.5 py-0.5 text-xs font-extrabold rounded-md border uppercase tracking-wider ${getRiskColor(profile.latest_risk.risk_category)}`}
                          >
                            {profile.latest_risk.risk_category}
                          </span>
                        </div>
                        <div className="text-[10px]  text-slate-400 dark:text-white font-medium mt-1">
                          Classified credit category
                        </div>
                      </div>

                      <div className="p-4 rounded-2xl dark:bg-indigo-500 border border-slate-200/60 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/10 space-y-1">
                        <span className="text-[10px] font-semibold text-slate-400 dark:text-white uppercase tracking-wider">
                          Model evaluation score
                        </span>
                        <div className="text-2xl font-black text-slate-900 dark:text-white">
                          {profile.latest_risk.risk_score}
                        </div>
                        <div className="text-[10px] text-slate-400 dark:text-white font-medium">
                          Credit engine model version:{" "}
                          {profile.latest_risk.model_version}
                        </div>
                      </div>
                    </div> */}

                    {/* Breakdown reasons and recommendations */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Risk Reasons */}
                      <div className="space-y-3">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                          <AlertOctagon className="w-4 h-4 text-rose-500" />
                          Risk Factors Flagged
                        </h3>
                        <div className="bg-rose-500/5 border border-rose-500/10 rounded-2xl p-4 space-y-2 text-xs">
                          {parseJsonList(profile.latest_risk.risk_reasons).map(
                            (reason, idx) => (
                              <div
                                key={idx}
                                className="flex items-start gap-2.5 text-rose-800 dark:text-rose-350 font-medium"
                              >
                                <span className="mt-1 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-rose-500" />
                                <span>{reason}</span>
                              </div>
                            ),
                          )}
                        </div>
                      </div>

                      {/* Recommended Actions */}
                      <div className="space-y-3">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                          <FileText className="w-4 h-4 text-emerald-500" />
                          AI-Underwriting Directives
                        </h3>
                        <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-2xl p-4 space-y-2 text-xs">
                          {parseJsonList(
                            profile.latest_risk.recommended_action,
                          ).map((action, idx) => (
                            <div
                              key={idx}
                              className="flex items-start gap-2.5 text-emerald-800 dark:text-emerald-350 font-medium"
                            >
                              <span className="mt-1 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              <span>{action}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Feature Importance Indicators */}
                    {/* <div className="space-y-3">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                        Model Feature Attribution weights
                      </h3>
                      <div className="p-5 border border-slate-200/70 dark:border-slate-800 rounded-2xl space-y-4">
                        {Object.entries(
                          parseJsonObject(
                            profile.latest_risk.feature_importance,
                          ),
                        ).length === 0 ? (
                          <div className="text-slate-400 text-xs">
                            No model feature attribution metadata recorded.
                          </div>
                        ) : (
                          Object.entries(
                            parseJsonObject(
                              profile.latest_risk.feature_importance,
                            ),
                          )
                            .sort((a, b) => b[1] - a[1])
                            .map(([key, weight]) => (
                              <div key={key} className="space-y-1.5 text-xs">
                                <div className="flex justify-between font-semibold">
                                  <span className="text-slate-600 dark:text-slate-400 capitalize">
                                    {key.replace(/_/g, " ")}
                                  </span>
                                  <span className="text-slate-900 dark:text-slate-200">
                                    {(weight).toFixed(1)}% weight
                                  </span>
                                </div>
                                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                                  <div
                                    className="bg-indigo-600 dark:bg-indigo-500 h-full rounded-full"
                                    style={{ width: `${weight * 60}%` }}
                                  />
                                </div>
                              </div>
                            ))
                        )}
                      </div>
                    </div> */}

                    <div className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 text-right">
                      Report audited at:{" "}
                      {new Date(
                        profile.latest_risk.predicted_at,
                      ).toLocaleString()}
                    </div>
                  </div>
                ))}

              {/* Tab 2: Loans list */}
              {activeDetailTab === "loans" &&
                (loans.length === 0 ? (
                  <div className="py-12 text-center text-slate-400 text-sm">
                    <Database className="w-8 h-8 mx-auto mb-2 text-slate-350" />
                    No active loan records detected for this customer.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-400 dark:text-slate-500 border-b border-slate-150 dark:border-slate-800">
                          <th className="py-3 px-4">Loan ID</th>
                          <th className="py-3 px-4">Bank Name</th>
                          <th className="py-3 px-4">Type</th>
                          <th className="py-3 px-4 text-right">Principal</th>
                          <th className="py-3 px-4 text-right">Outstanding</th>
                          <th className="py-3 px-4 text-right">Rate</th>
                          <th className="py-3 px-4 text-right">Tenure</th>
                          <th className="py-3 px-4 text-right">DPD</th>
                          <th className="py-3 px-4 text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
                        {loans.map((loan) => (
                          <tr
                            key={loan.id}
                            className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20"
                          >
                            <td className="py-3 px-4 font-semibold text-slate-900 dark:text-slate-100">
                              {loan.loan_id}
                            </td>
                            <td className="py-3 px-4 font-medium">
                              {loan.bank_name}
                            </td>
                            <td className="py-3 px-4 font-medium">
                              {loan.loan_type}
                            </td>
                            <td className="py-3 px-4 text-right font-medium">
                              ₹{loan.principal_amount.toLocaleString()}
                            </td>
                            <td className="py-3 px-4 text-right font-medium text-rose-500">
                              ₹{loan.outstanding_balance.toLocaleString()}
                            </td>
                            <td className="py-3 px-4 text-right text-slate-500">
                              {loan.interest_rate}%
                            </td>
                            <td className="py-3 px-4 text-right text-slate-500">
                              {loan.tenure_months} mo
                            </td>
                            <td
                              className={`py-3 px-4 text-right font-bold ${loan.dpd > 0 ? "text-rose-500" : "text-slate-400"}`}
                            >
                              {loan.dpd}
                            </td>
                            <td className="py-3 px-4 text-center">
                              <span
                                className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold ${
                                  loan.status === "ACTIVE"
                                    ? "bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/30"
                                    : loan.status === "CLOSED"
                                      ? "bg-slate-100 text-slate-500 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700"
                                      : "bg-rose-50 text-rose-700 border border-rose-100 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-900/30 animate-pulse"
                                }`}
                              >
                                {loan.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))}

              {/* Tab 3: Risk Evaluation History */}
              {/* Tab 3: Risk Evaluation History */}
              {activeDetailTab === "history" &&
                (history.length === 0 ? (
                  <div className="py-12 text-center text-slate-400 text-sm">
                    <Database className="w-8 h-8 mx-auto mb-2 text-slate-350" />
                    No previous risk history data records.
                  </div>
                ) : (
                  <div className="relative pl-1">
                    {/* connective timeline spine */}
                    <div className="absolute left-[15px] top-2 bottom-2 w-px bg-gradient-to-b from-slate-300 dark:from-slate-700 via-slate-200/60 dark:via-slate-800/60 to-transparent" />

                    <div className="space-y-3">
                      {history.map((item, index) => {
                        const meta = getHistoryRiskMeta(item.risk_category);
                        const revealed = index < revealedHistoryCount;
                        return (
                          <div
                            key={item.id}
                            className="relative pl-8"
                            style={{
                              opacity: revealed ? 1 : 0,
                              transform: revealed
                                ? "translateX(0)"
                                : "translateX(-12px)",
                              transition: `opacity 420ms cubic-bezier(0.16,1,0.3,1) ${index * 80}ms, transform 420ms cubic-bezier(0.16,1,0.3,1) ${index * 80}ms`,
                            }}
                          >
                            {/* timeline node */}
                            <div
                              className={`absolute left-[7px] top-6 w-2.5 h-2.5 rounded-full ${meta.dot} ring-4 ring-white dark:ring-slate-900`}
                            />

                            <div
                              className={`group relative rounded-2xl border ${meta.border} bg-gradient-to-br ${meta.grad} bg-white dark:bg-slate-900/60 backdrop-blur-sm p-4 transition-all duration-300 hover:-translate-y-0.5 ${meta.glow} flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs overflow-hidden`}
                            >
                              <div className="space-y-1.5 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                                    {item.prediction_id}
                                  </span>
                                  <span
                                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${meta.badge}`}
                                  >
                                    {item.risk_category}
                                  </span>
                                  {item.will_default_12m && (
                                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold border border-rose-300 bg-rose-50 text-rose-600 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-400 animate-pulse">
                                      Default flagged
                                    </span>
                                  )}
                                </div>
                                <div className="text-[11px] text-slate-400 font-medium">
                                  Model v{item.model_version} •{" "}
                                  {item.will_default_12m
                                    ? "Default Flagged"
                                    : "Active"}
                                </div>
                              </div>

                              <div className="flex items-center gap-4 md:gap-5 shrink-0">
                                {/* <HistoryScoreRing
                                  value={item.pd_score}
                                  color={meta.ring}
                                /> */}
                                <div className="text-right hidden sm:block">
                                  <div
                                    className={`flex items-center justify-end gap-1 font-bold ${meta.text}`}
                                  >
                                    <TrendingUp className="w-3 h-3" />
                                    {(item.pd_score * 100).toFixed(2)}%
                                  </div>
                                  <span className="text-[10px] text-slate-400">
                                    Default Probability
                                  </span>
                                </div>
                                <div className="text-right border-l border-slate-100 dark:border-slate-800 pl-4 hidden lg:block">
                                  <div className="flex items-center gap-1 text-[10px] text-slate-400 justify-end">
                                    <Clock className="w-3 h-3" />
                                    {new Date(
                                      item.predicted_at,
                                    ).toLocaleString()}
                                  </div>
                                </div>
                                {/* <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-700 group-hover:text-slate-500 group-hover:translate-x-0.5 transition-all duration-300 hidden md:block" /> */}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CustomerRisk;
