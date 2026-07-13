import {
  AlertCircle,
  Briefcase,
  Building2,
  Clock,
  Database,
  FileText,
  Loader2,
  MapPin,
  RefreshCw,
  ShieldAlert,
  TrendingUp,
  X,
} from "lucide-react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  getBusinessRiskHistoryApi,
  getMSMELoansApi,
  getMSMEProfileApi,
  predictMsmeRiskApi,
} from "../api/msme";
import { Modal } from "../ui/CustomModal";

interface MSMEProfileModalProps {
  businessId: string | number | null;
  onClose: () => void;
  onEvaluationComplete?: () => void;
}

const riskStyles = {
  CRITICAL: "text-rose-400 border-rose-500/30 bg-rose-500/10",
  HIGH: "text-amber-500 border-amber-500/30 bg-amber-500/10",
  MEDIUM: "text-yellow-400 border-yellow-500/30 bg-yellow-500/10",
  LOW: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
};

export default function MSMEProfileModal({
  businessId,
  onClose,
  onEvaluationComplete,
}: MSMEProfileModalProps) {
  // Profile Data States
  const [businessProfile, setBusinessProfile] = useState<any | null>(null);
  const [businessLoans, setBusinessLoans] = useState<any[]>([]);
  const [businessHistory, setBusinessHistory] = useState<any[]>([]);

  // Telemetry Process States
  const [isProfileLoading, setIsProfileLoading] = useState<boolean>(false);
  const [isLoansLoading, setIsLoansLoading] = useState<boolean>(false);
  const [isHistoryLoading, setIsHistoryLoading] = useState<boolean>(false);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState<boolean>(false);

  // Error States
  const [error, setError] = useState<string | null>(null);
  const [loansError, setLoansError] = useState<string | null>(null);
  const [historyError, setHistoryError] = useState<string | null>(null);
  const currentCategory = businessProfile?.latest_risk?.risk_category;
const activeStyle = riskStyles[currentCategory] || "text-white border-white/10 bg-slate-800/50";

  const [activeTab, setActiveTab] = useState<"summary" | "loans" | "history">(
    "summary",
  );

  const isOpen = businessId !== null && businessId !== undefined;
  // Fetch functions for profile segments
  const fetchProfile = useCallback(async (id: number) => {
    setIsProfileLoading(true);
    setError(null);
    try {
      const profileData = await getMSMEProfileApi(id);
      setBusinessProfile(profileData);
    } catch (err: any) {
      setError(err?.message || "Failed to parse business profile.");
      setBusinessProfile(null);
    } finally {
      setIsProfileLoading(false);
    }
  }, []);

  const fetchLoansList = useCallback(async (id: number) => {
    setIsLoansLoading(true);
    setLoansError(null);
    try {
      const loanData = await getMSMELoansApi(id);
      setBusinessLoans(loanData?.items || loanData || []);
    } catch (err: any) {
      setLoansError(err?.message || "Failed to sync loan registry.");
    } finally {
      setIsLoansLoading(false);
    }
  }, []);

  const fetchRiskHistory = useCallback(async (id: number) => {
    setIsHistoryLoading(true);
    setHistoryError(null);
    try {
      const historyData = await getBusinessRiskHistoryApi(id);
      setBusinessHistory(
        Array.isArray(historyData) ? historyData : [historyData],
      );
    } catch (err: any) {
      setHistoryError(
        err?.message || "Failed to track risk timeline matrices.",
      );
    } finally {
      setIsHistoryLoading(false);
    }
  }, []);

  // Trigger risk evaluation and re-synchronize metrics
  const handleEvaluateBusinessRisk = useCallback(async () => {
    if (!businessId) return;
    const numericId = Number(businessId);
    setIsEvaluating(true);
    try {
      await predictMsmeRiskApi(numericId, true);

      await Promise.all([
        fetchProfile(numericId),
        fetchLoansList(numericId),
        fetchRiskHistory(numericId),
      ]);

      if (onEvaluationComplete) {
        onEvaluationComplete();
      }
    } catch (err: any) {
      console.error("Failed to evaluate business MSME risk:", err);
    } finally {
      setIsEvaluating(false);
    }
  }, [
    businessId,
    fetchProfile,
    fetchLoansList,
    fetchRiskHistory,
    onEvaluationComplete,
  ]);

  // Orchestration context loop when specific business modal opens
  useEffect(() => {
    if (isOpen) {
      const numericId = Number(businessId);
      setActiveTab("summary");
      fetchProfile(numericId);
      fetchLoansList(numericId);
      fetchRiskHistory(numericId);
    } else {
      setBusinessProfile(null);
      setBusinessLoans([]);
      setBusinessHistory([]);
      setError(null);
    }
  }, [businessId, isOpen, fetchProfile, fetchLoansList, fetchRiskHistory]);

  // DOM escape keys and viewport scroll locks block
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    const originOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originOverflow;
    };
  }, [isOpen, onClose]);

  // Dynamic Array Parsing Safeguards
  const riskReasons = useMemo(() => {
    const rawReasons = businessProfile?.latest_risk?.risk_reasons;
    if (!rawReasons) return [];
    if (Array.isArray(rawReasons)) return rawReasons;
    try {
      return JSON.parse(rawReasons) as string[];
    } catch {
      return [rawReasons];
    }
  }, [businessProfile]);

  const recommendedActions = useMemo(() => {
    const rawActions = businessProfile?.latest_risk?.recommended_action;
    if (!rawActions) return [];
    if (Array.isArray(rawActions)) return rawActions;
    try {
      return JSON.parse(rawActions) as string[];
    } catch {
      return [rawActions];
    }
  }, [businessProfile]);

  // Indian Rupee currency format mask string generator
  const formatINR = (value: number) => {
    if (value === undefined || value === null || isNaN(value)) return "₹0.00";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(value);
  };

  const getHistoryRiskMeta = (category: string) => {
    switch (category?.toUpperCase()) {
      case "CRITICAL":
      case "HIGH":
        return {
          dot: "bg-rose-500 shadow-[0_0_8px_#f43f5e]",
          border: "border-rose-500/20 dark:border-rose-500/10",
          grad: "from-rose-500/5 to-transparent",
          glow: "hover:shadow-[0_4px_20px_-4px_rgba(244,63,94,0.15)]",
          badge:
            "bg-rose-500/10 text-rose-600 border-rose-500/20 dark:text-rose-400",
          text: "text-rose-600 dark:text-rose-400",
          ring: "#f43f5e",
        };
      case "MEDIUM":
        return {
          dot: "bg-amber-500 shadow-[0_0_8px_#f59e0b]",
          border: "border-amber-500/20 dark:border-amber-500/10",
          grad: "from-amber-500/5 to-transparent",
          glow: "hover:shadow-[0_4px_20px_-4px_rgba(245,158,11,0.15)]",
          badge:
            "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400",
          text: "text-amber-600 dark:text-amber-400",
          ring: "#f59e0b",
        };
      default:
        return {
          dot: "bg-emerald-500 shadow-[0_0_8px_#10b981]",
          border: "border-emerald-500/20 dark:border-emerald-500/10",
          grad: "from-emerald-500/5 to-transparent",
          glow: "hover:shadow-[0_4px_20px_-4px_rgba(16,185,129,0.15)]",
          badge:
            "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400",
          text: "text-emerald-600 dark:text-emerald-400",
          ring: "#10b981",
        };
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/40 backdrop-blur-xs p-4 sm:p-6 md:p-10 flex items-start justify-center"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop Glass Mask */}
      <div
        className="absolute inset-0 bg-slate-950/40 dark:bg-slate-950/80 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />
      {/* Main Structural Layout Viewport Frame */}
      <div className="relative max-w-6xl w-full  md:h-[89vh] min-h-0 max-h-full md:max-h-170 flex flex-col bg-white dark:bg-[#0A0E1A] border border-slate-200 dark:border-slate-900/50 rounded-2xl shadow-[0_24px_70px_-15px_rgba(0,0,0,0.15)] dark:shadow-[0_24px_70px_-15px_rgba(0,0,0,0.9)] overflow-hidden animate-in zoom-in-98 duration-150 text-slate-900 dark:text-slate-100">
        {/* TOP SYSTEM CONTROLS HEADER BAR */}
        <div className="flex items-center justify-end px-4 py-2 border-b border-slate-100 dark:border-slate-900/60 bg-slate-50 dark:bg-[#0E1322]/40 gap-2 shrink-0">
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Dynamic Inner Container Shell */}
        <div className="flex-1 flex flex-col overflow-y-auto p-6 space-y-6 bg-slate-50/50 dark:bg-transparent">
          {isProfileLoading ? (
            <div className="flex-1 flex flex-col items-center justify-center space-y-4">
              <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono tracking-widest uppercase">
                Querying MSME Registry Profile...
              </span>
            </div>
          ) : error || !businessProfile ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center max-w-sm mx-auto space-y-4">
              <AlertCircle className="w-8 h-8 text-rose-500 dark:text-rose-400" />
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {error || "No dashboard data profile resolved."}
              </p>
              <button
                onClick={() => fetchProfile(Number(businessId))}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all"
              >
                Retry Handshake
              </button>
            </div>
          ) : (
            <>
              {/* ================= HEADER IDENTITY INFRASTRUCTURE ================= */}
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-white dark:bg-[#0E1322] border border-slate-200 dark:border-slate-800/50 p-6 rounded-2xl relative overflow-hidden shadow-sm dark:shadow-none">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div className="space-y-1 min-w-0">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight leading-none">
                      {businessProfile?.business?.business_name}{" "}
                      <span
                        className={`px-2.5 py-0.5 text-[10px] font-black tracking-widest uppercase border rounded bg-black/20 ${activeStyle}`}
                      >
                        {businessProfile?.latest_risk?.risk_category ||
                          "UNKNOWN"}
                      </span>
                    </h2>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400 font-medium pt-1">
                      <span className="font-mono text-slate-400 dark:text-slate-500">
                        ID:{" "}
                        {businessProfile?.business?.business_id ||
                          businessProfile?.business?.id}
                      </span>
                      <span className="text-slate-300 dark:text-slate-800">
                        •
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />{" "}
                        {businessProfile?.business?.city},{" "}
                        {businessProfile?.business?.state}
                      </span>
                      <span className="text-slate-300 dark:text-slate-800">
                        •
                      </span>
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold tracking-wider text-[9px]">
                        <Briefcase className="w-2.5 h-2.5" />{" "}
                        {businessProfile?.business?.business_type}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={handleEvaluateBusinessRisk}
                    disabled={isEvaluating}
                    className="px-4 py-2 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs rounded-xl shadow-sm transition-all flex items-center gap-2 cursor-pointer disabled:opacity-40"
                  >
                    {isEvaluating ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <RefreshCw className="w-3.5 h-3.5" />
                    )}
                    Run Risk Evaluation
                  </button>

                  <button
                    onClick={() => setOpenModal(true)}
                    className="px-4 py-2 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white dark:hover:from-blue-500 dark:hover:to-indigo-500 dark:text-white font-semibold text-xs rounded-xl shadow-sm border border-slate-200 dark:border-transparent transition-all flex items-center gap-2 cursor-pointer"
                  >
                    AI Recommended Action Plan
                  </button>
                </div>
              </div>

              {/* ================= AI RECOMMENDED ACTIONS SUB-MODAL ================= */}
              <Modal
                isOpen={openModal}
                onClose={() => setOpenModal(false)}
                title="AI Recommended Action"
              >
                {(() => {
                  let actions = [];
                  let reasons = [];
                  try {
                    actions = JSON.parse(
                      businessProfile?.latest_risk?.recommended_action || "[]",
                    );
                  } catch (e) {}
                  try {
                    reasons = JSON.parse(
                      businessProfile?.latest_risk?.risk_reasons || "[]",
                    );
                  } catch (e) {}

                  return (
                    <div className="space-y-5 text-slate-800  dark:text-slate-200 ">
                      <div className="relative overflow-hidden rounded-xl bg-slate-900 p-4 text-white shadow-lg">
                        <div className="flex items-start gap-3">
                          <div className="rounded-lg bg-rose-500/20 p-2 text-rose-400 border border-rose-500/30 shrink-0">
                            <ShieldAlert className="h-5 w-5 animate-pulse" />
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-[13px] font-mono text-slate-300">
                                {businessProfile?.business?.business_name}
                              </span>
                              <span className="text-[9px] font-bold uppercase tracking-widest text-rose-400 bg-rose-955 px-2 py-0.5 rounded-full border border-rose-800/50">
                                {businessProfile?.latest_risk?.risk_category ||
                                  "CRITICAL"}{" "}
                                Status
                              </span>
                            </div>
                            <h4 className="text-base font-bold text-slate-100 mt-1">
                              {businessProfile?.latest_risk?.will_default_12m
                                ? "Imminent Default Risk Flagged"
                                : "Monitored Account Status"}
                            </h4>
                            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                              {reasons[0] ||
                                "AI models have noted high variance metrics across primary billing benchmarks."}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 p-3">
                          <span className="text-xs font-medium text-slate-500 block">
                            Risk Score
                          </span>
                          <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white mt-1 block">
                            {businessProfile?.latest_risk?.risk_score || "0"}%
                          </span>
                        </div>
                      </div>

                      {reasons.length > 1 && (
                        <div className="mt-3 rounded-xl border border-red-200 bg-red-50 p-3 dark:border-red-900/50 dark:bg-red-950/30">
                          <span className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-red-600 dark:text-red-400">
                            Supporting Indicators
                          </span>

                          <ul className="list-disc space-y-1.5 pl-5 text-[13px] text-red-700 dark:text-red-300 marker:text-red-500">
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

                      <div className="space-y-2.5">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                          AI Pre-emptive Action Plan
                        </h4>
                        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                          {actions.map((action: string, i: number) => {
                            const isUrgent = action.startsWith("URGENT");
                            return (
                              <div
                                key={i}
                                className={`flex items-start gap-3 rounded-lg border p-2.5 transition-colors ${
                                  isUrgent
                                    ? "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900/40 text-red-900 dark:text-red-400"
                                    : "bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200"
                                }`}
                              >
                                <span
                                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-xs font-bold ${isUrgent ? "bg-red-600 text-white" : "bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400"}`}
                                >
                                  {i + 1}
                                </span>
                                <h5 className="text-xs font-bold leading-tight mt-0.5">
                                  {action}
                                </h5>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="flex items-center justify-end pt-3 border-t border-slate-200 dark:border-slate-800">
                        <button
                          onClick={() => setOpenModal(false)}
                          className="rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  );
                })()}
              </Modal>

              {/* ================= HIGH LEVEL OVERVIEW FINANCIAL HERO NUMBERS ================= */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {[
                  {
                    title: "Risk Score",
                    val: businessProfile?.latest_risk?.risk_score ?? "—",
                    sub: "Underwriting scoring range",
                    txt: "text-slate-900 dark:text-white",
                  },
                  {
                    title: "Turnover",
                    val: businessProfile?.business?.annual_turnover
                      ? formatINR(businessProfile.business.annual_turnover)
                      : "—",
                    sub: "Declared revenue",
                    txt: "text-slate-900 dark:text-white font-mono",
                  },
                  {
                    title: "Total Loans",
                    val: businessProfile?.active_loans_count ?? 0,
                    sub: "Total loans taken",
                    txt: "text-blue-600 dark:text-blue-400 font-mono",
                  },
                  {
                    title: "Total Outstanding",
                    val: formatINR(businessProfile?.total_outstanding ?? 0),
                    sub: "Total remaining liabilities",
                    txt: "text-rose-600 dark:text-rose-500 font-mono",
                  },
                  {
                    title: "Probability of Default",
                    val: `${(
                      businessProfile?.latest_risk?.default_probability_pct ?? 0
                    ).toFixed(2)}%`,
                    sub: "PD engine index score",
                    txt: "text-rose-600 dark:text-rose-500 font-mono",
                  },
                ].map((card, idx) => (
                  <div
                    key={idx}
                    className="bg-white dark:bg-[#0E1322] border border-slate-200 dark:border-slate-800/40 p-4 rounded-xl space-y-0.5 shadow-sm dark:shadow-none"
                  >
                    <span className="text-[9px] font-bold tracking-wider uppercase text-slate-400 dark:text-slate-500">
                      {card.title}
                    </span>

                    <div className={`text-xl font-extrabold ${card.txt}`}>
                      {card.val}
                    </div>

                    <div className="text-[10px] font-medium text-slate-400 dark:text-slate-500">
                      {card.sub}
                    </div>
                  </div>
                ))}
              </div>

              {/* ================= TABS NAVIGATION HEADER ================= */}
              <div className="border-b border-slate-200 dark:border-slate-900 flex items-center gap-6 shrink-0">
                {[
                  { id: "summary", label: "Risk Assessment Summary" },
                  {
                    id: "loans",
                    label: `Loans list (${businessLoans.length})`,
                  },
                  {
                    id: "history",
                    label: `Risk Evaluation History (${businessHistory.length})`,
                  },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`pb-3 font-bold text-xs tracking-wider uppercase border-b-2 transition-all ${activeTab === tab.id ? "border-blue-500 text-blue-600 dark:text-blue-400" : "border-transparent text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"}`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* ================= TELEMETRY WORKSPACE VIEW PANELS ================= */}
              {activeTab === "summary" && (
                <div className="flex-1 bg-white dark:bg-[#0E1322] border border-slate-200 dark:border-slate-900/60 rounded-2xl overflow-auto shadow-sm dark:shadow-none animate-in fade-in duration-150">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    <div className="bg-white dark:bg-[#121226] border border-slate-200 dark:border-rose-950/40 p-5 rounded-2xl space-y-3.5 shadow-sm dark:shadow-none">
                      <h4 className="text-[11px] font-black tracking-widest uppercase text-rose-600 dark:text-rose-400 flex items-center gap-2">
                        <ShieldAlert className="w-4 h-4 text-rose-500" />
                        Risk Factors Flagged
                      </h4>
                      <div className="space-y-2.5">
                        {riskReasons.length > 0 ? (
                          riskReasons.map((reason, idx) => (
                            <div
                              key={idx}
                              className="flex items-start gap-3 p-3 bg-rose-500/5 rounded-xl border border-rose-500/10"
                            >
                              <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 bg-rose-500 shadow-[0_0_8px_#f43f5e]" />
                              <p className="text-xs font-semibold text-rose-700 dark:text-rose-300 leading-relaxed">
                                {reason}
                              </p>
                            </div>
                          ))
                        ) : (
                          <div className="text-xs text-slate-400 italic">
                            No historical anomalies parsed.
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="bg-white dark:bg-[#0D1824] border border-slate-200 dark:border-emerald-955/40 p-5 rounded-2xl space-y-3.5 shadow-sm dark:shadow-none">
                      <h4 className="text-[11px] font-black tracking-widest uppercase text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-emerald-500" />
                        AI-Underwriting Directives
                      </h4>
                      <div className="space-y-2.5">
                        {recommendedActions.length > 0 ? (
                          recommendedActions.map((action, idx) => (
                            <div
                              key={idx}
                              className="flex items-start gap-3 p-3 bg-emerald-500/5 rounded-xl border border-emerald-500/10"
                            >
                              <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 bg-emerald-400 shadow-[0_0_8px_#10b981]" />
                              <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 leading-relaxed">
                                {action}
                              </p>
                            </div>
                          ))
                        ) : (
                          <div className="text-xs text-slate-400 italic">
                            No recommendation blocks issued.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ================= LOANS LIST VIEW PANEL ================= */}
              {activeTab === "loans" && (
                <div className="flex-1 bg-white dark:bg-[#0E1322] border border-slate-200 dark:border-slate-900/60 rounded-2xl overflow-auto shadow-sm dark:shadow-none animate-in fade-in duration-150">
                  {isLoansLoading ? (
                    <div className="p-12 flex flex-col items-center justify-center space-y-3">
                      <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                      <span className="text-[10px] text-slate-400 font-mono tracking-wider">
                        Syncing Liability Matrices...
                      </span>
                    </div>
                  ) : loansError ? (
                    <div className="p-12 text-center text-xs text-rose-500">
                      {loansError}
                    </div>
                  ) : businessLoans.length === 0 ? (
                    <div className="p-12 text-center text-xs text-slate-400 italic">
                      No active loan records linked to this account.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-slate-200 dark:border-slate-900 bg-slate-50 dark:bg-slate-950/20">
                            <th className="p-4 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                              Reference ID
                            </th>
                            <th className="p-4 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                              Loan Type
                            </th>
                            <th className="p-4 text-[10px] font-bold uppercase tracking-wider text-slate-500 text-right">
                              Loan Amount
                            </th>
                            <th className="p-4 text-[10px] font-bold uppercase tracking-wider text-slate-500 text-right">
                              Outstanding
                            </th>
                            <th className="p-4 text-[10px] font-bold uppercase tracking-wider text-slate-500 text-center">
                              EMI / Int. Rate
                            </th>
                            <th className="p-4 text-[10px] font-bold uppercase tracking-wider text-slate-500 text-center">
                              DPD
                            </th>
                            <th className="p-4 text-[10px] font-bold uppercase tracking-wider text-slate-500 text-center">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-900/50 text-xs font-medium text-slate-600 dark:text-slate-300">
                          {businessLoans.map((loan, idx) => (
                            <tr
                              key={loan.id || idx}
                              className="hover:bg-slate-50 dark:hover:bg-slate-950/20 transition-colors"
                            >
                              <td className="p-4 font-mono text-slate-400 dark:text-slate-500">
                                {loan.credit_history_id}
                              </td>
                              <td className="p-4 text-slate-900 dark:text-white font-semibold">
                                {loan.loan_type}
                              </td>
                              <td className="p-4 text-right font-mono text-emerald-600 dark:text-emerald-400">
                                {formatINR(loan.loan_amount)}
                              </td>
                              <td className="p-4 text-right font-mono text-rose-600 dark:text-rose-400">
                                {formatINR(loan.outstanding_amount)}
                              </td>
                              <td className="p-4 text-center">
                                <span className="font-mono text-slate-900 dark:text-white">
                                  {formatINR(loan.emi)}
                                </span>
                                <span className="text-slate-400 block text-[10px] mt-0.5">
                                  {loan.interest_rate}% / {loan.loan_tenure} mo
                                </span>
                              </td>
                              <td className="p-4 text-center">
                                <span
                                  className={`px-2 py-0.5 rounded font-mono text-[11px] ${loan.days_past_due > 0 ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold" : "text-slate-400"}`}
                                >
                                  {loan.days_past_due}
                                </span>
                              </td>
                              <td className="p-4 text-center">
                                <span
                                  className={`px-2 py-0.5 rounded text-[10px] font-black tracking-wide ${loan.loan_status === "ACTIVE" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"}`}
                                >
                                  {loan.loan_status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* ================= RISK HISTORY TIMELINE PANEL ================= */}
              {activeTab === "history" && (
                <div className="flex-1 bg-white dark:bg-[#0E1322] border border-slate-200 dark:border-slate-900/60 rounded-2xl p-6 overflow-hidden shadow-sm dark:shadow-none animate-in fade-in duration-150">
                  {isHistoryLoading ? (
                    <div className="py-12 flex flex-col items-center justify-center space-y-3">
                      <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                      <span className="text-[10px] text-slate-400 font-mono tracking-wider uppercase">
                        Compiling Analytical Records...
                      </span>
                    </div>
                  ) : historyError ? (
                    <div className="py-12 text-center text-xs text-rose-500 font-medium">
                      {historyError}
                    </div>
                  ) : businessHistory.length === 0 ? (
                    <div className="py-12 text-center text-slate-400 text-sm flex flex-col items-center justify-center">
                      <Database className="w-8 h-8 mb-2 text-slate-300 dark:text-slate-600" />
                      <span>No previous risk history data records.</span>
                    </div>
                  ) : (
                    <div className="relative pl-1 max-h-[45vh] overflow-y-auto pr-2 custom-scrollbar">
                      {/* connective timeline spine */}
                      <div className="absolute left-3.75 top-4 bottom-4 w-px bg-linear-to-b from-slate-200 dark:from-slate-700 via-slate-100 dark:via-slate-800 to-transparent" />

                      <div className="space-y-3">
                        {businessHistory.map((item, index) => {
                          const meta = getHistoryRiskMeta(item.risk_category);
                          return (
                            <div
                              key={item.id || index}
                              className="relative pl-8 animate-in fade-in slide-in-from-left-3 duration-300"
                              style={{ animationDelay: `${index * 60}ms` }}
                            >
                              {/* timeline node */}
                              <div
                                className="absolute left-2.5 top-5.5 w-2.5 h-2.5 rounded-full bg-white dark:bg-slate-950 ring-2 ring-offset-2"
                                style={
                                  {
                                    "--tw-ring-color": meta.ring,
                                  } as React.CSSProperties
                                }
                              />

                              <div
                                className={`group relative rounded-2xl border ${meta.border} bg-linear-to-br ${meta.grad} bg-white dark:bg-slate-900/60 backdrop-blur-sm p-4 transition-all duration-300 hover:-translate-y-0.5 ${meta.glow} flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs overflow-hidden shadow-sm dark:shadow-none`}
                              >
                                <div className="space-y-1.5 min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="font-semibold text-slate-900 dark:text-slate-100 font-mono">
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
                                    Model v{item.model_version || "1.0"} •{" "}
                                    <span
                                      className={
                                        item.will_default_12m
                                          ? "text-rose-500"
                                          : "text-emerald-500 font-semibold"
                                      }
                                    >
                                      {item.will_default_12m
                                        ? "Default Flagged"
                                        : "Active"}
                                    </span>
                                  </div>
                                </div>

                                <div className="flex items-center justify-between md:justify-end gap-4 md:gap-5 shrink-0 border-t border-slate-100 dark:border-slate-800/60 md:border-0 pt-3 md:pt-0">
                                  <div className="flex items-center gap-3">
                                    <div className="text-right">
                                      <div
                                        className={`flex items-center justify-end gap-1 font-bold ${meta.text}`}
                                      >
                                        <TrendingUp className="w-3 h-3" />
                                        {(
                                          item.default_probability_pct ??
                                          item.pd_score * 100
                                        ).toFixed(2)}
                                        %
                                      </div>
                                      <span className="text-[10px] text-slate-400 font-medium">
                                        Default Probability
                                      </span>
                                    </div>
                                  </div>

                                  <div className="text-right border-l border-slate-100 dark:border-slate-800 pl-4 hidden sm:block">
                                    <div className="flex items-center gap-1 text-[10px] text-slate-400 justify-end font-mono">
                                      <Clock className="w-3 h-3 text-slate-400" />
                                      {item.predicted_at
                                        ? new Date(
                                            item.predicted_at,
                                          ).toLocaleString()
                                        : "—"}
                                    </div>
                                    <span className="text-[10px] text-slate-500 block mt-0.5">
                                      Timestamp
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
