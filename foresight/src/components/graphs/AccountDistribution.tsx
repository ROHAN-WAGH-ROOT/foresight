import { ArrowLeft, Loader2, ShieldAlert } from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { getLoanRiskDistributionTypeApi } from "../api";

export interface DistributionDataItem {
  category: string;
  count: number;
  [key: string]: any;
}

interface AccountDistributionProps {
  distributions: DistributionDataItem[];
}

const COLORS: string[] = [
  "#10b981", // Emerald 500
  "#f59e0b", // Amber 500
  "#ef4444", // Red 500
  "#6366f1", // Indigo 500
];

// Alternate palette for drill-down view to visually distinguish it from the main view
const DRILLDOWN_COLORS: string[] = [
  "#3b82f6", // Blue 500
  "#8b5cf6", // Purple 500
  "#ec4899", // Pink 500
  "#14b8a6", // Teal 500
  "#ce4257", // Coral Red
  "#f59e0b", // Amber 500
];

export default function AccountDistribution({
  distributions,
}: AccountDistributionProps): React.JSX.Element {
  // Tracks the active data array currently rendered by the chart
  const [chartData, setChartData] =
    useState<DistributionDataItem[]>(distributions);

  // Keeps track of the selected risk category (null means main view)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Sync internal chart data if the initial parent distributions prop changes
  useEffect(() => {
    if (!selectedCategory) {
      setChartData(distributions);
    }
  }, [distributions, selectedCategory]);

  // Click handler for the Pie Chart slices
  const handleSliceClick = async (data: any) => {
    // Prevent drilling down further if we are already in a sub-view
    if (selectedCategory || !data || !data.category) return;

    const riskCategory = data.category.toLowerCase();
    setSelectedCategory(data.category);
    setIsLoading(true);
    setError(null);

    try {
      const response = await getLoanRiskDistributionTypeApi(riskCategory);

      // Map the API response fields (loan_type -> category, loan_count -> count)
      const mappedResult: DistributionDataItem[] = response.map(
        (item: any) => ({
          category: item.loan_type,
          count: item.loan_count,
          total_outstanding: item.total_outstanding, // Keeps this field available if you want to use it in a tooltip
        }),
      );

      setChartData(mappedResult);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
      // Revert state if request fails
      setChartData(distributions);
      setSelectedCategory(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset chart back to primary risk level distribution
  const handleBackToMain = () => {
    setSelectedCategory(null);
    setChartData(distributions);
    setError(null);
  };

  return (
    <div className="bg-white dark:bg-slate-900/60 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs flex flex-col justify-between min-h-105 relative">
      {/* Header Area */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="text-lg font-bold tracking-tight flex items-center gap-2">
            <div className="p-2 bg-rose-50 dark:bg-rose-950/50 rounded-lg text-rose-600 dark:text-rose-400">
              <ShieldAlert className="w-4 h-4" />
            </div>
            {selectedCategory
              ? `${selectedCategory.charAt(0).toUpperCase()}${selectedCategory
                  .slice(1)
                  .toLowerCase()} Risk Breakdown`
              : "Risk Segment Distribution"}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {selectedCategory
              ? `Showing product breakdown for ${selectedCategory.toLowerCase()} risk category.`
              : "Distribution of customers across risk classes."}
          </p>
        </div>

        {/* Dynamic Back Button */}
        {selectedCategory && !isLoading && (
          <button
            onClick={handleBackToMain}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors rounded-lg cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back
          </button>
        )}
      </div>

      {/* Main Chart Presentation Layer */}
      <div className="h-92.5 w-full pt-4 flex items-center justify-center relative">
        {isLoading ? (
          <div className="flex flex-col items-center gap-2 text-slate-500 dark:text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            <span className="text-xs font-medium">
              Loading sub-distribution data...
            </span>
          </div>
        ) : error ? (
          <div className="text-center p-4">
            <p className="text-sm text-red-500 font-medium mb-2">{error}</p>
            <button
              onClick={handleBackToMain}
              className="text-xs text-blue-500 underline font-medium cursor-pointer"
            >
              Return to main view
            </button>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                  fontSize: "12px font-medium",
                }}
              />

              <Pie
                data={chartData}
                dataKey="count"
                nameKey="category"
                cx="50%"
                cy="45%"
                innerRadius={1} // Changed to 60 for a premium donut chart aesthetic
                outerRadius={120}
                paddingAngle={0}
                cornerRadius={5}
                isAnimationActive={true}
                animationDuration={600}
                // Intercept click slice data object
                onClick={handleSliceClick}
                activeShape={{ strokeWidth: 2 }}
                // activeClassName="transition-all duration-300 ease-out origin-center scale-105 filter drop-shadow-md"
                className="cursor-pointer focus:outline-none"
              >
                {chartData.map((_, index: number) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      selectedCategory
                        ? DRILLDOWN_COLORS[index % DRILLDOWN_COLORS.length]
                        : COLORS[index % COLORS.length]
                    }
                    stroke="transparent"
                  />
                ))}
              </Pie>

              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="circle"
                iconSize={8}
                formatter={(value: string) => (
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-400 px-1 capitalize">
                    {value}
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
