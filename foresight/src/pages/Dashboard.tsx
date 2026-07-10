import AccountDistribution from "@/components/graphs/AccountDistribution";
import PortfolioTrend from "@/components/graphs/PortfolioTrend";
import {
  Briefcase,
  Building2,
  Calendar,
  Car,
  ChevronLeft,
  ChevronRight,
  Coins,
  GraduationCap,
  Home,
  Landmark,
  Loader2,
  LucideCircleDollarSign,
  Percent,
  ShieldAlert,
  User,
  Users
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  getDashboardOverviewApi,
  getLoanPerformanceApi,
  getLoansByTypeApi,
  getRiskDistributionApi,
  getRiskTrendApi,
  getTopDefaultersApi,
  type DashboardOverview,
  type ListLoansResponse,
  type LoanPerformanceItem,
  type RiskDistributionItem,
  type RiskTrendItem,
  type TopDefaulter,
} from "../components/api";
import { DashboardCard } from "../components/ui/Dashboardcards";
import MsmeDashboard from "./MsmeDashboard";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/50 p-4 rounded-xl shadow-xl space-y-2 min-w-[180px]">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            {label}
          </span>
          <span className="flex h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
        </div>
        <div className="space-y-1">
          {payload.map((item: any, idx: number) => (
            <div
              key={idx}
              className="flex items-center justify-between gap-4 text-xs"
            >
              <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: item.stroke || item.fill }}
                />
                <span>{item.name}:</span>
              </div>
              <span className="font-semibold text-slate-900 dark:text-slate-50">
                {typeof item.value === "number" && item.value < 1
                  ? `${(item.value * 100).toFixed(1)}%`
                  : item.value.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

const loanTypes = [
  { name: "Home Loan", icon: Home, barColor: "bg-indigo-500" },
  { name: "Personal Loan", icon: User, barColor: "bg-fuchsia-500" },
  { name: "Auto Loan", icon: Car, barColor: "bg-rose-500" },
  { name: "Business Loan", icon: Briefcase, barColor: "bg-cyan-500" },
  { name: "Education Loan", icon: GraduationCap, barColor: "bg-violet-500" },
  { name: "Gold Loan", icon: Coins, barColor: "bg-amber-500" },
];

function Dashboard() {
  const [dashboardType, setDashboardType] = useState<"personal" | "msme">(
    "personal",
  );

  // Personal Dashboard State
  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [trends, setTrends] = useState<RiskTrendItem[]>([]);
  const [distributions, setDistributions] = useState<RiskDistributionItem[]>(
    [],
  );
  const [performance, setPerformance] = useState<LoanPerformanceItem[]>([]);
  const [defaulters, setDefaulters] = useState<TopDefaulter[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedLoanType, setSelectedLoanType] = useState<string>("Home Loan");
  const [typeLoansResponse, setTypeLoansResponse] =
    useState<ListLoansResponse | null>(null);
  const [isTypeLoansLoading, setIsTypeLoansLoading] = useState(false);
  const [typeLoansPage, setTypeLoansPage] = useState(1);

  // Fetch loan list specific to selected type on Personal Dashboard
  useEffect(() => {
    if (dashboardType !== "personal") return;

    const fetchLoansByType = async () => {
      setIsTypeLoansLoading(true);
      try {
        const res = await getLoansByTypeApi(selectedLoanType, typeLoansPage, 8);
        setTypeLoansResponse(res);
      } catch (error) {
        console.error("Failed to fetch loans by type:", error);
      } finally {
        setIsTypeLoansLoading(false);
      }
    };

    fetchLoansByType();
  }, [selectedLoanType, typeLoansPage, dashboardType]);

  // Fetch overview metrics on Personal Dashboard mount
  useEffect(() => {
    if (dashboardType !== "personal") return;

    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        const [overviewRes, trendsRes, distRes, perfRes, defsRes] =
          await Promise.all([
            getDashboardOverviewApi(),
            getRiskTrendApi(),
            getRiskDistributionApi(),
            getLoanPerformanceApi(),
            getTopDefaultersApi(15),
          ]);

        setOverview(overviewRes);
        setTrends(trendsRes);
        setDistributions(distRes);
        setPerformance(perfRes);
        setDefaulters(defsRes);
      } catch (error) {
        console.error("Dashboard data load failed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [dashboardType]);

  const handleLoanTypeSelect = (type: string) => {
    setSelectedLoanType(type);
    setTypeLoansPage(1);
  };

  // Personal Dashboard Loading indicator
  if (dashboardType === "personal" && isLoading) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center gap-3 bg-slate-50 dark:bg-slate-950 text-slate-400">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
        <span className="text-sm font-semibold">
          Loading portfolios risk matrices...
        </span>
      </div>
    );
  }

  const summary = overview?.portfolio_summary || {
    total_customers: 0,
    total_loans: 0,
    total_outstanding: 0,
    avg_pd_score: 0,
    risk_distribution: { CRITICAL: 0, MEDIUM: 0, HIGH: 0, LOW: 0 },
    high_risk_count: 0,
    critical_risk_count: 0,
    npa_rate: 0,
    avg_credit_score: 0,
  };

  const getRiskColor = (category: string) => {
    switch (category?.toUpperCase()) {
      case "CRITICAL":
        return "text-rose-600 bg-rose-50 border-rose-200 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-900/30";
      case "HIGH":
        return "text-orange-600 bg-orange-50 border-orange-200 dark:bg-orange-950/30 dark:text-orange-400 dark:border-orange-900/30";
      case "MEDIUM":
        return "text-amber-600 bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/30";
      case "LOW":
        return "text-emerald-600 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/30";
      default:
        return "text-slate-500 bg-slate-50 border-slate-200 dark:bg-zinc-900 dark:text-zinc-400";
    }
  };

  const formatINR = (value: number) => {
    if (value === undefined || value === null || isNaN(value)) return "₹0.00";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(value);
  };

  const containerBg =
    "bg-slate-50 text-slate-800 dark:bg-slate-950 min-h-screen dark:text-slate-400 transition-colors duration-550 text-left select-none";

  return (
    <div className={`w-full p-6 space-y-8 ${containerBg}`}>
      {/* Dynamic Unified Header with Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-5 border-slate-200/85 dark:border-slate-800/80">
        <div>
          <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {dashboardType === "msme"
              ? "MSME Enterprise Risk Command"
              : "Credit Risk & AI Analytics"}
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {dashboardType === "msme"
              ? "Predict business defaults, audit enterprise credit risks, evaluate batch models, and inspect commercial profiles."
              : "Real-time portfolio evaluation, risk classifications, and predictive alerts."}
          </p>
        </div>

        {/* Workspace Switcher Pill Controls */}
        <div className="flex items-center gap-3 self-start sm:self-center">
          <div className="flex items-center gap-0.5 p-0.5 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-inner">
            <button
              onClick={() => setDashboardType("personal")}
              className={`px-3.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                dashboardType === "personal"
                  ? "bg-white dark:bg-zinc-800 text-zinc-950 dark:text-zinc-50 shadow-xs"
                  : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
              }`}
            >
              Individual
            </button>
            <button
              onClick={() => setDashboardType("msme")}
              className={`px-3.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                dashboardType === "msme"
                  ? "bg-white dark:bg-zinc-800 text-zinc-950 dark:text-zinc-50 shadow-xs"
                  : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
              }`}
            >
              MSME
            </button>
          </div>

          {["personal", "msme"].includes(dashboardType) &&
            overview?.generated_at && (
              <div className="hidden md:flex items-center gap-2 text-xs font-semibold px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 text-slate-500 shadow-xs">
                <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                Last Synced: {new Date(overview.generated_at).toLocaleString()}
              </div>
            )}
        </div>
      </div>

      {/* Render Active Workspace Screen */}
      {dashboardType === "msme" ? (
        <MsmeDashboard />
      ) : (
        <>
          {/* Metric Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 w-full">
            <DashboardCard
              title="Total Outstanding"
              data={`₹${(summary.total_outstanding / 10000000).toFixed(2)} Cr`}
              icon={
                <LucideCircleDollarSign className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
              }
              trend={{
                value: `${summary.npa_rate.toFixed(1)}% NPA Rate`,
                isPositive: summary.npa_rate < 15,
              }}
            />
            <DashboardCard
              title="Active Loans"
              data={summary.total_loans.toLocaleString()}
              icon={
                <Landmark className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
              }
              trend={{
                value: `${summary.total_customers.toLocaleString()} Customers`,
                isPositive: true,
              }}
            />
            <DashboardCard
              title="Critical Risk Accounts"
              data={summary.critical_risk_count.toString()}
              icon={<ShieldAlert className="w-5 h-5 text-rose-500" />}
              trend={{
                value: `${summary.high_risk_count} High Risk`,
                isPositive: false,
              }}
            />
            <DashboardCard
              title="Average Credit Score"
              data={summary.avg_credit_score.toFixed(0)}
              icon={<Users className="w-5 h-5 text-amber-500" />}
              trend={{
                value: `PD Score: ${(summary.avg_pd_score * 100).toFixed(1)}%`,
                isPositive: summary.avg_pd_score < 0.25,
              }}
            />
          </div>

          {/* Charts & Analytics Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PortfolioTrend trends={trends} />
            <AccountDistribution distributions={distributions} />
          </div>

          {/* Accounts Split Segment by Loan Types */}
          {/* <div className="p-5 bg-white dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xs">
            <div className="border-b border-zinc-100 dark:border-zinc-800 pb-4 mb-5">
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
                <Building2 className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
                Accounts Ledger by Loan Segment
              </h3>
              <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">
                Inspect segmented retail facilities and predictive parameters across credit types.
              </p>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-4 scrollbar-none">
              {loanTypes.map((item) => {
                const IconComp = item.icon;
                const isSelected = selectedLoanType === item.name;
                return (
                  <button
                    key={item.name}
                    onClick={() => handleLoanTypeSelect(item.name)}
                    className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg border whitespace-nowrap cursor-pointer transition-colors ${
                      isSelected
                        ? "bg-indigo-50 border-indigo-200 text-indigo-600 dark:bg-indigo-950/40 dark:border-indigo-900/50 dark:text-indigo-400"
                        : "bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800/60"
                    }`}
                  >
                    <IconComp className={`w-3.5 h-3.5 ${isSelected ? "text-indigo-500" : "text-zinc-400"}`} />
                    {item.name}
                  </button>
                );
              })}
            </div>

            {isTypeLoansLoading && !typeLoansResponse ? (
              <div className="py-16 text-center text-xs font-mono text-zinc-400">
                Fetching retail segments ledger...
              </div>
            ) : typeLoansResponse && typeLoansResponse.items.length > 0 ? (
              <div className={`space-y-5 transition-opacity duration-200 ${isTypeLoansLoading ? "opacity-65" : "opacity-100"}`}>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                  {typeLoansResponse.items.map((loan: any) => (
                    <div
                      key={loan.id || loan.loan_id}
                      className="bg-zinc-50/50 dark:bg-zinc-950/20 border border-zinc-200/80 dark:border-zinc-800/80 rounded-xl p-4 flex flex-col justify-between min-h-[140px]"
                    >
                      <div className="space-y-1 text-left">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-mono font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-1.5 py-0.5 rounded">
                            #{loan.id || loan.loan_id}
                          </span>
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold border uppercase ${getRiskColor(loan.risk_level || loan.risk_category)}`}>
                            {loan.risk_level || loan.risk_category || "UNKNOWN"}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-zinc-900 dark:text-white truncate pt-1">
                          {loan.customer_name || loan.business_name}
                        </h4>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-3 border-t border-zinc-100 dark:border-zinc-800/60 text-left">
                        <div>
                          <div className="text-[9px] text-zinc-400 font-medium mb-0.5 flex items-center gap-0.5">
                            <LucideCircleDollarSign className="w-2.5 h-2.5 shrink-0 text-zinc-300" /> Balance
                          </div>
                          <div className="text-xs font-bold text-zinc-800 dark:text-zinc-200 truncate">
                            {formatINR(loan.total_outstanding || loan.outstanding_amount)}
                          </div>
                        </div>
                        <div>
                          <div className="text-[9px] text-zinc-400 font-medium mb-0.5 flex items-center gap-0.5">
                            <Percent className="w-2.5 h-2.5 shrink-0 text-zinc-300" /> Default Prob.
                          </div>
                          <div className="text-xs font-bold text-zinc-800 dark:text-zinc-200 font-mono">
                            {((loan.probability_of_default || loan.pd_score || 0) * 100).toFixed(1)}%
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {typeLoansResponse.pages > 1 && (
                  <div className="p-2.5 bg-zinc-50 dark:bg-zinc-900/30 rounded-lg border border-zinc-200 dark:border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] font-medium text-zinc-500">
                    <span>
                      Showing matching items out of <strong className="text-zinc-700 dark:text-zinc-300">{typeLoansResponse.total}</strong> accounts
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setTypeLoansPage((p) => Math.max(p - 1, 1))}
                        disabled={typeLoansPage === 1 || isTypeLoansLoading}
                        className="p-1 rounded bg-white hover:bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 disabled:opacity-30 disabled:pointer-events-none cursor-pointer transition-colors"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-2 py-0.5 bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 rounded border border-zinc-200 dark:border-zinc-800 font-mono">
                        {typeLoansPage} / {typeLoansResponse.pages}
                      </span>
                      <button
                        onClick={() => setTypeLoansPage((p) => Math.min(p + 1, typeLoansResponse.pages))}
                        disabled={typeLoansPage === typeLoansResponse.pages || isTypeLoansLoading}
                        className="p-1 rounded bg-white hover:bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 disabled:opacity-30 disabled:pointer-events-none cursor-pointer transition-colors"
                      >
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-12 text-center text-xs text-zinc-400 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl">
                No active loans found under the "{selectedLoanType}" facility type.
              </div>
            )}
          </div> */}
        </>
      )}
    </div>
  );
}

export default Dashboard;