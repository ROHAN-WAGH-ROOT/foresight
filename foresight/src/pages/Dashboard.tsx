import { useEffect, useState } from "react";
import { DashboardCard } from "../components/ui/Dashboardcards";
import { 
  LucideCircleDollarSign, 
  Landmark, 
  ShieldAlert, 
  Calendar, 
  Loader2,
  AlertTriangle,
  Users,
  LineChart as LineIcon
} from "lucide-react";
import { 
  ComposedChart, 
  Line, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  BarChart
} from "recharts";
import {
  getDashboardOverviewApi,
  getRiskTrendApi,
  getRiskDistributionApi,
  getLoanPerformanceApi,
  getTopDefaultersApi,
  type DashboardOverview,
  type RiskTrendItem,
  type RiskDistributionItem,
  type LoanPerformanceItem,
  type TopDefaulter
} from "../components/api";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/50 p-4 rounded-xl shadow-xl space-y-2 min-w-[180px]">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">{label}</span>
          <span className="flex h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
        </div>
        <div className="space-y-1">
          {payload.map((item: any, idx: number) => (
            <div key={idx} className="flex items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.stroke || item.fill }} />
                <span>{item.name}:</span>
              </div>
              <span className="font-semibold text-slate-900 dark:text-slate-50">
                {typeof item.value === "number" && item.value < 1 ? `${(item.value * 100).toFixed(1)}%` : item.value.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

function Dashboard() {
  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [trends, setTrends] = useState<RiskTrendItem[]>([]);
  const [distributions, setDistributions] = useState<RiskDistributionItem[]>([]);
  const [performance, setPerformance] = useState<LoanPerformanceItem[]>([]);
  const [defaulters, setDefaulters] = useState<TopDefaulter[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [overviewRes, trendsRes, distRes, perfRes, defsRes] = await Promise.all([
          getDashboardOverviewApi(),
          getRiskTrendApi(),
          getRiskDistributionApi(),
          getLoanPerformanceApi(),
          getTopDefaultersApi(15)
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
  }, []);

  if (isLoading) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center gap-3 bg-slate-50 dark:bg-slate-950 text-slate-400">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
        <span className="text-sm font-semibold">Loading portfolios risk matrices...</span>
      </div>
    );
  }

  // Fallback / Defaults if overview is empty
  const summary = overview?.portfolio_summary || {
    total_customers: 0,
    total_loans: 0,
    total_outstanding: 0,
    avg_pd_score: 0,
    risk_distribution: { CRITICAL: 0, MEDIUM: 0, HIGH: 0, LOW: 0 },
    high_risk_count: 0,
    critical_risk_count: 0,
    npa_rate: 0,
    avg_credit_score: 0
  };

  const getRiskColor = (category: string) => {
    switch (category?.toUpperCase()) {
      case "CRITICAL":
        return "text-rose-600 bg-rose-50 border-rose-200 dark:bg-rose-950/30 dark:text-rose-450 dark:border-rose-900/30";
      case "HIGH":
        return "text-orange-600 bg-orange-50 border-orange-200 dark:bg-orange-950/30 dark:text-orange-450 dark:border-orange-900/30";
      case "MEDIUM":
        return "text-amber-600 bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:text-amber-405 dark:border-amber-900/30";
      case "LOW":
        return "text-emerald-600 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-450 dark:border-emerald-900/30";
      default:
        return "text-slate-500 bg-slate-50 border-slate-200";
    }
  };

  return (
    <div className="w-full p-6 space-y-8 bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-900 dark:text-slate-100 transition-colors duration-300 text-left">
      
      {/* 1. Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Credit Risk & AI Analytics</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Real-time portfolio evaluation, risk classifications, and predictive alerts.
          </p>
        </div>
        {overview?.generated_at && (
          <div className="flex items-center gap-2 text-xs font-semibold px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 text-slate-500 self-start sm:self-center shadow-xs">
            <Calendar className="w-3.5 h-3.5 text-indigo-500" />
            Last Synced: {new Date(overview.generated_at).toLocaleString()}
          </div>
        )}
      </div>

      {/* 2. Metric Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
        <DashboardCard 
          title="Total Outstanding Portfolio" 
          data={`₹${(summary.total_outstanding / 10000000).toFixed(2)} Cr`} 
          icon={<LucideCircleDollarSign className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />} 
          trend={{ value: `${summary.npa_rate.toFixed(1)}% NPA Rate`, isPositive: summary.npa_rate < 15 }}
        />
        <DashboardCard 
          title="Active Accounts" 
          data={summary.total_loans.toLocaleString()} 
          icon={<Landmark className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />} 
          trend={{ value: `${summary.total_customers.toLocaleString()} Customers`, isPositive: true }}
        />
        <DashboardCard 
          title="Critical Risk Accounts" 
          data={summary.critical_risk_count.toString()} 
          icon={<ShieldAlert className="w-5 h-5 text-rose-500" />} 
          trend={{ value: `${summary.high_risk_count} High Risk`, isPositive: false }} 
        />
        <DashboardCard 
          title="Average Credit Score" 
          data={summary.avg_credit_score.toFixed(0)} 
          icon={<Users className="w-5 h-5 text-amber-500" />} 
          trend={{ value: `PD Score: ${(summary.avg_pd_score * 100).toFixed(1)}%`, isPositive: summary.avg_pd_score < 0.25 }} 
        />
      </div>

      {/* 3. Charts & Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Trend Forecast Composed Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900/60 backdrop-blur-xs p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-6 flex flex-col justify-between">
          <div className="space-y-1">
            <div className="text-lg font-bold tracking-tight flex items-center gap-2">
              <div className="p-2 bg-indigo-50 dark:bg-indigo-950/50 rounded-lg text-indigo-600 dark:text-indigo-400">
                <LineIcon className="w-4 h-4" />
              </div>
              Portfolio Risk & Prediction Trend
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Forward-looking history of aggregate monthly prediction volumes and average default probabilities.</p>
          </div>
          
          <div className="h-[300px] w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={trends} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="4 4" vertical={false} className="text-slate-200 dark:text-slate-800" />
                <XAxis dataKey="date" stroke="currentColor" className="text-slate-400" fontSize={11} fontWeight={500} tickLine={false} dy={10} />
                <YAxis yAxisId="left" stroke="#6366f1" fontSize={11} fontWeight={500} tickLine={false} label={{ value: 'TOTAL PREDICTIONS', angle: -90, position: 'insideLeft', style: {textAnchor: 'middle', fill: '#6366f1', fontSize: 9, fontWeight: 700} }} />
                <YAxis yAxisId="right" orientation="right" stroke="#f59e0b" fontSize={11} fontWeight={500} tickLine={false} label={{ value: 'PROBABILITY OF DEFAULT (PD)', angle: 90, position: 'insideRight', style: {textAnchor: 'middle', fill: '#f59e0b', fontSize: 9, fontWeight: 700} }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend verticalAlign="top" height={36} iconType="circle" iconSize={6} wrapperStyle={{ fontSize: '11px', fontWeight: 600 }} />
                
                <Bar yAxisId="left" dataKey="total_predictions" name="Evaluations Processed" fill="#e0e7ff" stroke="#818cf8" strokeWidth={1} radius={[4, 4, 0, 0]} maxBarSize={45} className="fill-indigo-100/50 dark:fill-indigo-950/20" />
                <Line yAxisId="right" type="monotone" dataKey="avg_pd_score" name="Avg Default Probability" stroke="#f59e0b" strokeWidth={3} dot={{ r: 3 }} activeDot={{ r: 5 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk Distribution Bar Chart */}
        <div className="bg-white dark:bg-slate-900/60 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs flex flex-col justify-between">
          <div className="space-y-1">
            <div className="text-lg font-bold tracking-tight flex items-center gap-2">
              <div className="p-2 bg-rose-50 dark:bg-rose-950/50 rounded-lg text-rose-600 dark:text-rose-400">
                <ShieldAlert className="w-4 h-4" />
              </div>
              Account Segment distribution
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Distribution of customers across risk classes.</p>
          </div>

          <div className="h-[300px] w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={distributions} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="4 4" vertical={false} className="text-slate-200 dark:text-slate-800" />
                <XAxis dataKey="category" stroke="currentColor" className="text-slate-400" fontSize={11} fontWeight={500} tickLine={false} dy={10} />
                <YAxis stroke="currentColor" className="text-slate-400" fontSize={11} fontWeight={500} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" name="Accounts Volume" fill="#f43f5e" radius={[4, 4, 0, 0]} maxBarSize={40} className="fill-rose-500/80 dark:fill-rose-600/60" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* 4. Lower Analytics: Loan Yield & Defaulters Registry */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Top Defaulters Sheet */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs rounded-2xl overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold">Top Delinquent Defaulters</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">List of critical credit default exposure risk accounts.</p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/70 dark:bg-slate-800/40 text-xs font-semibold text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800">
                    <th className="py-3 px-4">Rank</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">City</th>
                    <th className="py-3 px-4 text-center">Credit Score</th>
                    <th className="py-3 px-4 text-right">PD Score</th>
                    <th className="py-3 px-4 text-right">Outstanding</th>
                    <th className="py-3 px-4 text-center">Risk Tier</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
                  {defaulters.slice(0, 8).map((row) => (
                    <tr key={row.customer_id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20">
                      <td className="py-3 px-4 font-bold text-slate-400">{row.rank}</td>
                      <td className="py-3 px-4 font-semibold">{row.customer_name}</td>
                      <td className="py-3 px-4 text-slate-500">{row.city}</td>
                      <td className="py-3 px-4 text-center font-medium">{row.credit_score}</td>
                      <td className="py-3 px-4 text-right font-semibold text-rose-500">{(row.pd_score * 100).toFixed(1)}%</td>
                      <td className="py-3 px-4 text-right font-medium">₹{row.total_outstanding.toLocaleString()}</td>
                      <td className="py-3 px-4 text-center">
                        <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold border ${getRiskColor(row.risk_category)}`}>
                          {row.risk_category}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Loan Yield Performance Sheet */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs rounded-2xl overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-5 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold">Loan Product Yield</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Yield and default counts aggregated per loan product type.</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/70 dark:bg-slate-800/40 font-semibold text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800">
                    <th className="py-3.5 px-5">Product Type</th>
                    <th className="py-3.5 px-5 text-center">Status</th>
                    <th className="py-3.5 px-5 text-right">Count</th>
                    <th className="py-3.5 px-5 text-right">Outstanding</th>
                    <th className="py-3.5 px-5 text-right">Avg DPD</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                  {performance.slice(0, 8).map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20">
                      <td className="py-3.5 px-5 font-semibold text-slate-900 dark:text-slate-100">{row.loan_type}</td>
                      <td className="py-3.5 px-5 text-center">
                        <span className={`inline-flex px-2 py-0.5 rounded text-[9px] font-bold ${
                          row.status === "ACTIVE" 
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400" 
                            : row.status === "CLOSED"
                            ? "bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-zinc-400"
                            : "bg-rose-50 text-rose-700 dark:bg-rose-950/20 dark:text-rose-400 animate-pulse"
                        }`}>
                          {row.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-5 text-right font-semibold">{row.count}</td>
                      <td className="py-3.5 px-5 text-right text-rose-600 dark:text-rose-450">₹{(row.total_outstanding / 10000000).toFixed(2)} Cr</td>
                      <td className={`py-3.5 px-5 text-right font-bold ${row.avg_dpd > 30 ? "text-rose-500" : "text-slate-400"}`}>{row.avg_dpd.toFixed(1)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>

      {/* 5. Alerts Section Feed */}
      {overview && overview.top_alerts && overview.top_alerts.length > 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs rounded-2xl p-6 text-left">
          <div className="flex items-center gap-2 mb-4 border-b border-slate-100 dark:border-slate-800 pb-3">
            <AlertTriangle className="w-5 h-5 text-rose-500" />
            <h3 className="text-base font-bold text-rose-600 dark:text-rose-400">Critical Underwriting Alerts Feed</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {overview.top_alerts.slice(0, 6).map((alert) => (
              <div 
                key={alert.customer_id} 
                className="p-4 border border-rose-100 dark:border-rose-950 bg-rose-500/5 hover:bg-rose-500/10 transition-colors rounded-xl flex flex-col justify-between text-xs gap-2.5"
              >
                <div className="flex justify-between items-start">
                  <span className="font-semibold text-slate-950 dark:text-white">{alert.customer_name}</span>
                  <span className="font-bold text-[10px] px-2 py-0.5 bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-400 rounded">
                    {alert.risk_category}
                  </span>
                </div>
                <p className="text-slate-600 dark:text-slate-350 text-[11px] font-medium leading-relaxed">
                  {alert.top_reason}
                </p>
                <div className="flex justify-between items-center text-[10px] text-slate-400 font-semibold border-t border-rose-100/30 dark:border-rose-950/30 pt-2">
                  <span>ID: {alert.customer_code}</span>
                  <span>PD: {(alert.pd_score * 100).toFixed(2)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}

export default Dashboard;