import { ArrowLeft, Loader2, ShieldAlert } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import {
  getLoanRiskDistributionnTypeApi,
  getRiskDistributionnApi,
  type LoanDistributionItem,
  type RiskDistributionItem,
} from '../api'; // Adjust this import path to your actual api file layout

// Standardized structure used by the chart component internally
interface UnifiedChartItem {
  category: string;
  count: number;
  extraInfo?: number; // Holds avg_pd_score or total_outstanding for custom tooltips
}

// 4 distinct risk level colors
const RISK_COLORS = [
  '#10b981', // Emerald 500 (LOW)
  '#f59e0b', // Amber 500 (MEDIUM)
  '#ef4444', // Red 500 (HIGH)
  '#6366f1', // Indigo 500 (CRITICAL)
];

// 6 distinct flat colors for the drill-down items
const DRILLDOWN_COLORS = [
  '#3b82f6', // Blue 500
  '#8b5cf6', // Purple 500
  '#ec4899', // Pink 500
  '#14b8a6', // Teal 500
  '#ce4257', // Coral Red
  '#f59e0b'  // Amber 500
];

export default function MSMERiskDrillDownChart(): React.JSX.Element {
  const [chartData, setChartData] = useState<UnifiedChartItem[]>([]);
  const [initialRiskData, setInitialRiskData] = useState<UnifiedChartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch primary risk distribution data on initial mount
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data: RiskDistributionItem[] = await getRiskDistributionnApi();
        const mappedData = data.map((item) => ({
          category: item.category,
          count: item.count,
          extraInfo: item.avg_pd_score
        }));
        setInitialRiskData(mappedData);
        setChartData(mappedData);
      } catch (err: any) {
        setError(err.message || 'Failed to load initial risk distribution');
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Click handler for the primary Pie Chart slices
  const handleSliceClick = async (clickedSlice: any) => {
    // Only drill down if we are on the main view and have valid slice data
    if (selectedCategory || !clickedSlice || !clickedSlice.category) return;

    const riskCategory = clickedSlice.category;
    setSelectedCategory(riskCategory);
    setIsLoading(true);
    setError(null);

    try {
      const response: LoanDistributionItem[] = await getLoanRiskDistributionnTypeApi(riskCategory);
      
      // Map API response keys (loan_type -> category, loan_count -> count)
      const mappedResult: UnifiedChartItem[] = response.map((item) => ({
        category: item.loan_type,
        count: item.loan_count,
        extraInfo: item.total_outstanding
      }));
      
      setChartData(mappedResult);
    } catch (err: any) {
      setError(err.message || `Failed to fetch sub-data for ${riskCategory}`);
      setChartData(initialRiskData);
      setSelectedCategory(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Resets the view state back to primary distribution level
  const handleBackToMain = () => {
    setSelectedCategory(null);
    setChartData(initialRiskData);
    setError(null);
  };

  return (
    <div className="bg-white dark:bg-slate-900/60 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs flex flex-col justify-between min-h-[420px] relative">
      
      {/* Dynamic Title Headers */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="text-lg font-bold tracking-tight flex items-center gap-2">
            <div className="p-2 bg-rose-50 dark:bg-rose-950/50 rounded-lg text-rose-600 dark:text-rose-400">
              <ShieldAlert className="w-4 h-4" />
            </div>
            {selectedCategory ? `${selectedCategory} Risk Breakdown` : 'MSME Account Segment Distribution'}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {selectedCategory 
              ? `Showing product line item distributions matching ${selectedCategory.toLowerCase()} risk criteria.`
              : 'Overview distribution of enterprise clients across active internal risk tiers.'
            }
          </p>
        </div>

        {/* Back Navigation Trigger */}
        {selectedCategory && !isLoading && (
          <button
            onClick={handleBackToMain}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors rounded-lg cursor-pointer border border-transparent"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back
          </button>
        )}
      </div>

      {/* Interactive Pie Graph Panel Area */}
      <div className="h-[270px] w-full pt-4 flex items-center justify-center relative">
        {isLoading ? (
          <div className="flex flex-col items-center gap-2 text-slate-500 dark:text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            <span className="text-xs font-medium">Communicating with core servers...</span>
          </div>
        ) : error ? (
          <div className="text-center p-4">
            <p className="text-sm text-red-500 font-medium mb-2">{error}</p>
            <button 
              onClick={handleBackToMain}
              className="text-xs text-blue-500 underline font-medium cursor-pointer"
            >
              Return to main summary view
            </button>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip 
                contentStyle={{
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  fontSize: '12px'
                }}
                formatter={(value: any, props: any) => {
                  const extra = props?.payload?.extraInfo;
                  if (selectedCategory) {
                    // Drill-down view format layout (Count & Total Outstanding)
                    return [
                      `${value} Loans (₹${extra?.toLocaleString('en-IN') || 0})`,
                      'Breakdown'
                    ];
                  }
                  // Main view layout (Count & Avg PD Score)
                  return [`${value} Accounts (Avg PD: ${extra || 0})`, 'Volume'];
                }}
              />
              
              <Pie
                data={chartData}
                dataKey="count"
                nameKey="category"
                cx="50%"
                cy="45%"
                innerRadius={1}    // Solid shape implementation look per specification
                outerRadius={90}
                paddingAngle={0}  
                cornerRadius={5}   
                
                isAnimationActive={true}
                animationDuration={600}
                onClick={handleSliceClick}
                
                activeShape={{ strokeWidth: 2 }}
                // activeClassName="tran  sition-all duration-300 ease-out origin-center scale-105 filter drop-shadow-md"
                className="cursor-pointer focus:outline-none"
              >
                {chartData.map((_, index: number) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={
                      selectedCategory 
                        ? DRILLDOWN_COLORS[index % DRILLDOWN_COLORS.length]
                        : RISK_COLORS[index % RISK_COLORS.length]
                    } 
                    stroke="transparent"
                  />
                ))}
              </Pie>

              <Legend 
                verticalAlign="bottom" 
                height={48}
                iconType="circle"
                iconSize={8}
                formatter={(value: string) => (
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-400 px-1 capitalize">
                    {value.toLowerCase()}
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}