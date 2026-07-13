import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Search,
} from "lucide-react";
import { useEffect, useState } from "react";
import { listLoansApi, listNpaLoansApi, type Loan } from "../components/api";

function Loans() {
  const [activeTab, setActiveTab] = useState<"all" | "npa">("all");
  const [loans, setLoans] = useState<Loan[]>([]);
  const [npaLoans, setNpaLoans] = useState<Loan[]>([]);

  // Pagination & Loading States
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchLoans = async () => {
    setIsLoading(true);
    try {
      if (activeTab === "all") {
        const response = await listLoansApi(currentPage, 25);
        setLoans(response.items);
        setTotalPages(response.pages);
        setTotalItems(response.total);
      } else {
        const response = await listNpaLoansApi();
        setNpaLoans(response);
        setTotalItems(response.length);
        setTotalPages(1);
      }
    } catch (error) {
      console.error("Failed to fetch loans:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, [currentPage, activeTab]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleTabChange = (tab: "all" | "npa") => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  // Filter loans on the client-side for quick search
  const displayedLoans = (activeTab === "all" ? loans : npaLoans).filter(
    (loan) =>
      loan.loan_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loan.loan_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loan.customer_id.toString().includes(searchTerm),
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/30">
            Active
          </span>
        );
      case "CLOSED":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700">
            Closed
          </span>
        );
      case "DELINQUENT":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-100 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-900/30 animate-pulse">
            Delinquent
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
            {status}
          </span>
        );
    }
  };
  return (
    <div className="w-full p-6 space-y-8 bg-slate-50 dark:bg-slate-950 min-h-screen max-h-screen flex flex-col text-slate-900 dark:text-slate-100 transition-colors duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-50 dark:bg-slate-950 px-2 flex-none">
        <div>
          <div className="text-2xl font-extrabold tracking-tight">
            Loan Portfolio
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Monitor, inspect, and analyze institutional loan assets and
            delinquencies.
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl shadow-sm overflow-hidden flex flex-col flex-1 min-h-0">
        {/* Table Filters & Tab Toggles */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center md:justify-between gap-4 flex-none">
          <div className=" flex bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200/50 dark:border-slate-700/50 self-start">
            <button
              onClick={() => handleTabChange("all")}
              className={`px-5 py-2 text-xs font-semibold rounded-lg transition-all duration-200 cursor-pointer ${
                activeTab === "all"
                  ? "bg-white dark:bg-slate-950 text-indigo-600 dark:text-indigo-400 shadow-sm"
                  : "text-slate-500 hover:text-slate-950 dark:hover:text-slate-100"
              }`}
            >
              All Active Loans
            </button>
            <button
              onClick={() => handleTabChange("npa")}
              className={`px-5 py-2 text-xs font-semibold rounded-lg transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                activeTab === "npa"
                  ? "bg-white dark:bg-slate-950 text-rose-600 dark:text-rose-400 shadow-sm"
                  : "text-slate-500 hover:text-slate-950 dark:hover:text-slate-100"
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              Non-Performing Assets (NPAs)
            </button>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:max-w-xs">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Search loan ID, type or customer ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/80 dark:text-slate-100"
            />
          </div>
        </div>

        {/* Loan Table Container (Adjusted for absolute height scroll) */}
        <div className="overflow-auto flex-1 min-h-0">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full py-20 gap-3 text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
              <span className="text-sm font-medium">
                Fetching loan records...
              </span>
            </div>
          ) : displayedLoans.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-20 text-slate-400">
              <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-amber-500" />
              <p className="text-sm font-medium">
                No matching loan records found.
              </p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse relative">
              <thead>
                <tr className="text-xs font-semibold tracking-wider text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800">
                  {/* Applied sticky layout and backgrounds to header columns */}
                  <th className="sticky top-0 z-10 bg-slate-50/95 dark:bg-slate-800 py-4 px-6 backdrop-blur-sm">
                    Loan ID
                  </th>
                  <th className="sticky top-0 z-10 bg-slate-50/95 dark:bg-slate-800 py-4 px-6 backdrop-blur-sm">
                    Customer ID
                  </th>
                  <th className="sticky top-0 z-10 bg-slate-50/95 dark:bg-slate-800 py-4 px-6 backdrop-blur-sm">
                    Bank Name
                  </th>

                  <th className="sticky top-0 z-10 bg-slate-50/95 dark:bg-slate-800 py-4 px-6 backdrop-blur-sm">
                    Loan Type
                  </th>
                  <th className="sticky top-0 z-10 bg-slate-50/95 dark:bg-slate-800 py-4 px-6 backdrop-blur-sm text-right">
                    Principal
                  </th>
                  <th className="sticky top-0 z-10 bg-slate-50/95 dark:bg-slate-800 py-4 px-6 backdrop-blur-sm text-right">
                    Outstanding Balance
                  </th>
                  <th className="sticky top-0 z-10 bg-slate-50/95 dark:bg-slate-800 py-4 px-6 backdrop-blur-sm text-right">
                    Interest Rate
                  </th>
                  <th className="sticky top-0 z-10 bg-slate-50/95 dark:bg-slate-800 py-4 px-6 backdrop-blur-sm text-right">
                    EMI (Monthly)
                  </th>
                  <th className="sticky top-0 z-10 bg-slate-50/95 dark:bg-slate-800 py-4 px-6 backdrop-blur-sm text-right">
                    Tenure
                  </th>
                  <th className="sticky top-0 z-10 bg-slate-50/95 dark:bg-slate-800 py-4 px-6 backdrop-blur-sm text-right">
                    DPD
                  </th>
                  <th className="sticky top-0 z-10 bg-slate-50/95 dark:bg-slate-800 py-4 px-6 backdrop-blur-sm text-center">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-sm">
                {displayedLoans.map((loan) => (
                  <tr
                    key={loan.id}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors duration-150 group"
                  >
                    <td className="py-4 px-6 font-semibold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {loan.loan_id}
                    </td>
                    <td className="py-4 px-6 font-medium text-slate-500 dark:text-slate-400">
                      CUS-{loan.customer_id}
                    </td>
                    <td className="py-4 px-6 font-medium text-slate-500 dark:text-slate-400">
                      {loan.bank_name}
                    </td>
                    <td className="py-4 px-6 font-semibold">
                      {loan.loan_type}
                    </td>
                    <td className="py-4 px-6 text-right font-medium text-slate-950 dark:text-slate-100">
                      ₹{loan.principal_amount.toLocaleString()}
                    </td>
                    <td className="py-4 px-6 text-right font-medium text-rose-600 dark:text-rose-400">
                      ₹{loan.outstanding_balance.toLocaleString()}
                    </td>
                    <td className="py-4 px-6 text-right text-slate-500">
                      {loan.interest_rate}%
                    </td>
                    <td className="py-4 px-6 text-right text-slate-600 dark:text-slate-350">
                      ₹{loan.emi_amount.toLocaleString()}
                    </td>
                    <td className="py-4 px-4 text-right text-slate-500">
                      {loan.tenure_months} mo
                    </td>
                    <td
                      className={`py-4 px-6 text-right font-bold ${loan.dpd > 0 ? "text-rose-500" : "text-slate-400"}`}
                    >
                      {loan.dpd}
                    </td>
                    <td className="py-4 px-6 text-center">
                      {getStatusBadge(loan.status)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination controls for 'all' tab */}
        {activeTab === "all" && totalPages > 1 && !isLoading && (
          <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold flex-none bg-white dark:bg-slate-900">
            <span className="text-slate-500">
              Showing {(currentPage - 1) * 25 + 1} -{" "}
              {Math.min(currentPage * 25, totalItems)} of {totalItems} loan
              contracts
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Loans;
