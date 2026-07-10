import { BarChart3 } from 'lucide-react';
import React from 'react';
import { Bar, CartesianGrid, ComposedChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export interface TrendDataItem {
  date: string;
  total_predictions: number;
  default_yes: number;
  default_no: number;
}

interface PortfolioTrendProps {
  trends: TrendDataItem[];
}

export default function PortfolioTrend({ trends }: PortfolioTrendProps): React.JSX.Element {
  return (
    <div className="lg:col-span-1  bg-white dark:bg-slate-900/60 backdrop-blur-xs p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-6 flex flex-col justify-between">
      <div className="space-y-1">
        <div className="text-lg font-bold tracking-tight flex items-center gap-2">
          <div className="p-2 bg-indigo-50 dark:bg-indigo-950/50 rounded-lg text-indigo-600 dark:text-indigo-400">
            <BarChart3 className="w-4 h-4" />
          </div>
          Portfolio Risk & Prediction Trend
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Parallel historical analysis comparing predicted defaults versus non-defaults over time.
        </p>
      </div>

      <div className="h-[400px] w-full pt-4">
        <ResponsiveContainer width="100%" height="100%">
          {/* Removed negative margins to prevent side clipping of parallel bars */}
          <ComposedChart data={trends} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="4 4" vertical={false} className="stroke-slate-100 dark:stroke-slate-800/80" />
            
            <XAxis 
              dataKey="date" 
              stroke="currentColor" 
              className="text-slate-400" 
              fontSize={11} 
              fontWeight={500} 
              tickLine={false} 
              dy={10} 
            />
            
            <YAxis 
              stroke="currentColor" 
              className="text-slate-400"
              fontSize={11} 
              fontWeight={500} 
              tickLine={false} 
              label={{ 
                value: 'NUMBER OF ACCOUNTS', 
                angle: -90, 
                position: 'insideLeft', 
                style: { textAnchor: 'middle', fill: '#64748b', fontSize: 9, fontWeight: 700 } 
              }} 
            />
            
            <Tooltip 
              contentStyle={{
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                fontSize: '12px'
              }}
            />
            
            <Legend 
              verticalAlign="bottom" 
              height={35} 
              iconType="circle" 
              iconSize={8} 
              wrapperStyle={{ fontSize: '11px', fontWeight: 600, paddingTop: '15px' }} 
            />

            {/* Parallel Left Bar - Default Yes (Vibrant Rose/Red) */}
            <Bar 
              dataKey="default_yes" 
              name="Default (Yes)" 
              fill="#f43f5e"
              radius={[4, 4, 0, 0]} 
              maxBarSize={80} 
              isAnimationActive={true}
              animationDuration={750}
            />

            {/* Parallel Right Bar - Default No (Vibrant Emerald Green) */}
            <Bar 
              dataKey="default_no" 
              name="Non-Default (No)" 
              fill="#10b981"
              radius={[4, 4, 0, 0]} 
              maxBarSize={80} 
              isAnimationActive={true}
              animationDuration={750}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}