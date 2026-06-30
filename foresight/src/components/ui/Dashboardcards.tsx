import { LucideCircleDollarSign } from "lucide-react";

interface DashboardCardProps {
  title: string;
  data: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

export function DashboardCard({ title, data, icon, trend }: DashboardCardProps) {
  return (
    <div className="relative w-full group cursor-default">
      {/* Subtle background glow layer that only appears on hover */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-slate-100/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none dark:from-zinc-900/50" />
      
      {/* Main Card Element */}
      <div className="relative flex flex-col justify-between h-44 p-6 rounded-2xl border border-slate-200/80 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.03),0_4px_12px_-1px_rgba(15,23,42,0.02)] transition-all duration-300 group-hover:border-slate-300 group-hover:shadow-[0_12px_30px_-4px_rgba(15,23,42,0.06)] group-hover:-translate-y-0.5 dark:border-zinc-800 dark:bg-zinc-950 dark:group-hover:border-zinc-700 dark:group-hover:shadow-none">
        
        {/* Top Content Row */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1.5 min-w-0">
            {/* Title: Muted, professional typography */}
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 truncate">
              {title}
            </span>
            {/* Value: Strong, dense emphasis */}
            <span className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-zinc-50 truncate">
              {data}
            </span>
          </div>

          {/* Icon Wrapper: Crisp institutional container that expands on hover */}
          <div className="p-3 rounded-xl border border-slate-100 bg-slate-50 text-slate-600 shadow-[inset_0_1px_1px_rgba(255,255,255,1)] transition-all duration-300 group-hover:scale-105 group-hover:bg-slate-900 group-hover:text-white dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:group-hover:bg-zinc-100 dark:group-hover:text-zinc-900 flex-shrink-0">
            {icon ? icon : <LucideCircleDollarSign className="w-5 h-5" />}
          </div>
        </div>

        {/* Divider Line */}
        <div className="h-px w-full bg-slate-100 dark:bg-zinc-900 mt-4" />

        {/* Bottom Metadata Row */}
        <div className="flex items-center justify-between pt-3">
          {trend ? (
            <div className="flex items-center gap-2">
              {/* Perfectly balanced trend badges */}
              <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold border ${
                trend.isPositive 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/30' 
                  : 'bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-900/30'
              }`}>
                {trend.value}
              </span>
              <span className="text-[11px] font-medium text-slate-400 dark:text-zinc-500">
                vs last month
              </span>
            </div>
          ) : (
            <span className="text-[11px] font-medium text-slate-400 dark:text-zinc-500">
              Live updates
            </span>
          )}
          
          {/* Status Dot: IDBI Corporate Amber/Orange Indicator */}
          <div className="flex items-center justify-center w-4 h-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-40 dark:bg-emerald-400"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500 dark:bg-emerald-500"></span>
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}