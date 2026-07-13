import {
  Building2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Landmark,
  Percent,
  ShieldAlert,
} from "lucide-react";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
// Integrated the risk category api here
import {
  getHighRiskMsmeBusinessesApi,
  getMsmeAccountsByRiskCategoryApi,
} from "../api/msme";
import MSMEProfileModal from "./MSMEProfileModal";

export interface HighRiskBusinessItem {
  business_id: number;
  business_name: string;
  credit_lines_count: number;
  default_probability_pct: number;
  industry: string;
  pd_score: number;
  risk_category: string;
  risk_score: number;
  total_outstanding: number;
}

interface HighRiskData {
  items: HighRiskBusinessItem[];
  total: number;
  page: number;
  pages: number;
  size: number;
}

const getRiskLevelBadge = (level: string) => {
  switch (level?.toUpperCase()) {
    case "CRITICAL":
      return "bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-450 border-rose-100 dark:border-rose-900/30";
    case "HIGH":
      return "bg-orange-50 dark:bg-orange-950/20 text-orange-600 dark:text-orange-400 border-orange-100 dark:border-orange-900/30";
    case "MEDIUM":
      return "bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900/30";
    case "LOW":
      return "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30";
    default:
      return "bg-zinc-50 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border-zinc-150 dark:border-zinc-800";
  }
};

interface HighRiskPortfolioProps {
  pageSize?: number;
}

function HighRiskPortfolio({ pageSize = 6 }: HighRiskPortfolioProps) {
  const [highRiskData, setHighRiskData] = useState<HighRiskData | null>(null);
  const [highRiskPage, setHighRiskPage] = useState<number>(1);
  const [isHighRiskLoading, setIsHighRiskLoading] = useState<boolean>(true);
  const [hasLoadedOnce, setHasLoadedOnce] = useState<boolean>(false);
  const [selectedBusinessId, setSelectedBusinessId] = useState<
    string | number | null
  >(null);

  // Category Dropdown Filter State
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const requestIdRef = useRef(0);

  // Close custom dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Updated layout logic to fetch either global list or filtered subset from servers
  const loadHighRiskRegistry = useCallback(
    async (page: number, size: number, category: string) => {
      const requestId = ++requestIdRef.current;
      setIsHighRiskLoading(true);
      try {
        let data;
        if (category === "ALL") {
          data = await getHighRiskMsmeBusinessesApi(page, size);
        } else {
          data = await getMsmeAccountsByRiskCategoryApi(
            category.toLowerCase(),
            { page, size },
          );
        }

        if (requestId !== requestIdRef.current) return;
        setHighRiskData(data as unknown as HighRiskData);
      } catch (e) {
        console.error(e);
      } finally {
        if (requestId === requestIdRef.current) {
          setIsHighRiskLoading(false);
          setHasLoadedOnce(true);
        }
      }
    },
    [],
  );

  const formatINR = (value: number) => {
    if (value === undefined || value === null || isNaN(value)) return "₹0.00";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(value);
  };

  // Re-fetch data matrix when page or selected category updates
  useEffect(() => {
    loadHighRiskRegistry(highRiskPage, pageSize, selectedCategory);
  }, [highRiskPage, pageSize, selectedCategory, loadHighRiskRegistry]);

  const goToPage = useCallback((updater: (prev: number) => number) => {
    setHighRiskPage((prev) => {
      const next = updater(prev);
      return next;
    });
  }, []);

  // Now handles items directly as filtered results are returned directly from our APIs
  const filteredItems = useMemo(() => {
    return highRiskData?.items || [];
  }, [highRiskData?.items]);

  const showInitialLoading = isHighRiskLoading && !hasLoadedOnce;

  return (
    <div className="p-5 bg-white dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xs">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-4 mb-5">
        <div className="text-left">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-500 dark:text-rose-400" />{" "}
            High-Risk Business Portfolio
          </h3>
          <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">
            Real-time monitoring of commercial assets exceeding default
            parameters.
          </p>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto">
          {/* Subtle inline indicator */}
          {isHighRiskLoading && hasLoadedOnce && (
            <span className="text-[10px] font-medium text-zinc-400 dark:text-zinc-500 inline-flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
              Refreshing…
            </span>
          )}

          {/* Top Right Dropdown Selection Filter */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 shadow-2xs hover:bg-zinc-50 dark:hover:bg-zinc-800/60 cursor-pointer transition-colors min-w-30 justify-between"
            >
              <span className="capitalize">
                {selectedCategory.toLowerCase()} Risk
              </span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-zinc-400 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
              />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-1.5 w-40 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl z-30 overflow-hidden py-1">
                {["ALL", "CRITICAL", "HIGH", "MEDIUM", "LOW"].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(cat);
                      setHighRiskPage(1); // Reset page calculation back to 1 on filter alteration
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs font-medium cursor-pointer transition-colors ${
                      selectedCategory === cat
                        ? "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-semibold"
                        : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                    }`}
                  >
                    {cat === "ALL"
                      ? "All Risks"
                      : cat.charAt(0) + cat.slice(1).toLowerCase()}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {showInitialLoading ? (
        <div className="py-24 text-center text-xs text-zinc-400 dark:text-zinc-500 font-medium font-mono tracking-wide">
          Querying high-risk ledger...
        </div>
      ) : highRiskData ? (
        <div
          className={`space-y-5 transition-opacity duration-200 ${isHighRiskLoading ? "opacity-60" : "opacity-100"}`}
        >
          {filteredItems.length > 0 ? (
            /* Responsive Card Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredItems.map((row) => (
                <div
                  key={row.business_id}
                  onClick={() => setSelectedBusinessId(row.business_id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ")
                      setSelectedBusinessId(row.business_id);
                  }}
                  className="group relative bg-zinc-50/50 dark:bg-zinc-950/20 hover:bg-white dark:hover:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800/80 rounded-xl p-5 transition-all duration-200 hover:shadow-sm cursor-pointer hover:border-indigo-200 dark:hover:border-indigo-900/50 hover:-translate-y-0.5"
                >
                  {/* Card Top Header */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="space-y-1 min-w-0 text-left">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-mono font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-1.5 py-0.5 rounded">
                          #{row.business_id}
                        </span>
                        <span
                          className={`inline-flex px-2 py-0.5 rounded-lg text-[9px] font-bold tracking-wide border uppercase ${getRiskLevelBadge(row.risk_category || "")}`}
                        >
                          {row.risk_category || "UNKNOWN"}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-zinc-900 dark:text-white tracking-tight pt-0.5 truncate">
                        {row.business_name}
                      </h4>
                      <p className="text-[11px] text-zinc-400 dark:text-zinc-500 flex items-center gap-1 truncate">
                        <Building2 className="w-3 h-3 text-zinc-300 dark:text-zinc-600 shrink-0" />
                        {row.industry}
                      </p>
                    </div>

                    {/* Risk Score Banner */}
                    <div className="text-right bg-rose-50/60 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 rounded-lg p-2 min-w-17.5 shrink-0">
                      <div className="text-[9px] font-bold text-rose-500 dark:text-rose-400/80 uppercase tracking-wider">
                        Risk Score
                      </div>
                      <div className="text-base font-black text-rose-600 dark:text-rose-400">
                        {(row.risk_score ?? 0).toFixed(1)}%
                      </div>
                    </div>
                  </div>

                  {/* Grid Metrics Base */}
                  <div className="grid grid-cols-3 gap-2 pt-3 border-t border-zinc-100 dark:border-zinc-800/60 text-left">
                    <div className="min-w-0">
                      <div className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium mb-0.5 flex items-center gap-1">
                        <Landmark className="w-3 h-3 text-zinc-300 shrink-0" />{" "}
                        Outstanding
                      </div>
                      <div className="text-xs font-bold text-zinc-800 dark:text-zinc-200 truncate">
                        {formatINR(row.total_outstanding)}
                      </div>
                    </div>

                    <div className="min-w-0">
                      <div className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium mb-0.5 flex items-center gap-1">
                        <Percent className="w-3 h-3 text-zinc-300 shrink-0" />{" "}
                        Default Prob.
                      </div>
                      <div className="text-xs font-bold text-zinc-800 dark:text-zinc-200 font-mono">
                        {(
                          row.default_probability_pct ?? row.pd_score * 100
                        ).toFixed(2)}
                        %
                      </div>
                    </div>

                    <div className="text-right min-w-0">
                      <div className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium mb-0.5">
                        Credit Lines
                      </div>
                      <div className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                        {row.credit_lines_count ?? 0} active
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-16 text-center text-xs text-zinc-400 dark:text-zinc-500 font-medium border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl">
              No portfolios match the "{selectedCategory.toLowerCase()}" risk
              level filter.
            </div>
          )}

          {/* Clean Pagination controls */}
          {highRiskData.pages > 1 && (
            <div className="p-3 bg-zinc-50 dark:bg-zinc-900/30 rounded-lg border border-zinc-200 dark:border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
              <span>
                Showing current page profiles out of{" "}
                <strong className="text-zinc-700 dark:text-zinc-300">
                  {highRiskData.total}
                </strong>{" "}
                portfolios
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => goToPage((p) => Math.max(p - 1, 1))}
                  disabled={highRiskPage === 1 || isHighRiskLoading}
                  className="p-1 rounded bg-white hover:bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-350 disabled:opacity-30 disabled:pointer-events-none cursor-pointer transition-colors"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <span className="px-2.5 py-1 bg-white dark:bg-zinc-900 text-indigo-650 dark:text-indigo-400 rounded-md border border-zinc-200 dark:border-zinc-800 font-mono shadow-2xs">
                  Page {highRiskPage} of {highRiskData.pages}
                </span>
                <button
                  onClick={() =>
                    goToPage((p) => Math.min(p + 1, highRiskData.pages))
                  }
                  disabled={
                    highRiskPage === highRiskData.pages || isHighRiskLoading
                  }
                  className="p-1 rounded bg-white hover:bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-350 disabled:opacity-30 disabled:pointer-events-none cursor-pointer transition-colors"
                  aria-label="Next page"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="py-16 text-center text-xs text-zinc-500">
          No high-risk businesses listed.
        </div>
      )}

      <MSMEProfileModal
        businessId={selectedBusinessId}
        onClose={() => setSelectedBusinessId(null)}
      />
    </div>
  );
}

export default React.memo(HighRiskPortfolio);
