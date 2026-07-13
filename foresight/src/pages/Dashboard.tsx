import AccountDistribution from "@/components/graphs/AccountDistribution";
import PortfolioTrend from "@/components/graphs/PortfolioTrend";
import {
  Calendar,
  Landmark,
  Loader2,
  LucideCircleDollarSign,
  ShieldAlert,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  getDashboardOverviewApi,
  getLoanPerformanceApi,
  getRiskDistributionApi,
  getRiskTrendApi,
  getTopDefaultersApi,
  type DashboardOverview,
  type RiskDistributionItem,
  type RiskTrendItem,
} from "../components/api";
import { DashboardCard } from "../components/ui/Dashboardcards";
import MsmeDashboard from "./MsmeDashboard";

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

  const [isLoading, setIsLoading] = useState(true);

  // Fetch loan list specific to selected type on Personal Dashboard
  useEffect(() => {
    if (dashboardType !== "personal") return;
  }, [dashboardType]);

  // Fetch overview metrics on Personal Dashboard mount
  useEffect(() => {
    if (dashboardType !== "personal") return;

    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        const [overviewRes, trendsRes, distRes] = await Promise.all([
          getDashboardOverviewApi(),
          getRiskTrendApi(),
          getRiskDistributionApi(),
          getLoanPerformanceApi(),
          getTopDefaultersApi(15),
        ]);

        setOverview(overviewRes);
        setTrends(trendsRes);
        setDistributions(distRes);
      } catch (error) {
        console.error("Dashboard data load failed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [dashboardType]);

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
              ? "Predict business defaults, audit enterprise credit risks and inspect commercial profiles."
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
              <div className="hidden md:flex items-center gap-2 text-xs font-semibold px-3 py-1.5 sm:px-3.5 sm:py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 text-slate-500 shadow-xs whitespace-nowrap shrink-0">
                <Calendar className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                <span>
                  Last Synced:{" "}
                  {new Date(overview.generated_at).toLocaleString(undefined, {
                    dateStyle: "short",
                    timeStyle: "short",
                  })}
                </span>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 w-full">
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
        </>
      )}
    </div>
  );
}

export default Dashboard;
