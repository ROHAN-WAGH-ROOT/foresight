import React, { useEffect, useState } from "react";
import { 
  searchCustomerApi, 
  getCustomerProfileApi, 
  getCustomerLoansApi, 
  getCustomerRiskHistoryApi, 
  predictCustomerRiskApi, 
  batchRiskPredictionApi,
  getHighRiskCustomersApi,
  getEarlyWarningAlertsApi,
  type Customer, 
  type CustomerProfile, 
  type Loan, 
  type RiskHistoryItem,
  type HighRiskCustomer,
  type EarlyWarningAlert
} from "../components/api";
import { 
  Search, 
  ShieldAlert, 
  Activity, 
  RefreshCw, 
  Plus, 
  Loader2, 
  FileText, 
  AlertOctagon,
  User,
  MapPin,
  Briefcase,
  AlertCircle,
  Database
} from "lucide-react";

function CustomerRisk() {
  // Search & Navigation
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Customer[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);
  
  // Alert queues
  const [highRiskList, setHighRiskList] = useState<HighRiskCustomer[]>([]);
  const [earlyWarnings, setEarlyWarnings] = useState<EarlyWarningAlert[]>([]);
  const [activeQueueTab, setActiveQueueTab] = useState<"warnings" | "highrisk" | "results">("warnings");

  // Profile data
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [history, setHistory] = useState<RiskHistoryItem[]>([]);
  const [activeDetailTab, setActiveDetailTab] = useState<"risk" | "loans" | "history">("risk");

  // Batch action state
  const [batchInput, setBatchInput] = useState("");
  const [batchStatus, setBatchStatus] = useState<string | null>(null);
  const [isBatchRunning, setIsBatchRunning] = useState(false);

  // Loaders
  const [isSearching, setIsSearching] = useState(false);
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);

  // Initialize early warnings and high risk queue
  const loadQueues = async () => {
    try {
      const warnings = await getEarlyWarningAlertsApi();
      setEarlyWarnings(warnings);
      
      const highRisk = await getHighRiskCustomersApi("HIGH");
      setHighRiskList(highRisk);
    } catch (error) {
      console.error("Failed to load warning queues:", error);
    }
  };

  useEffect(() => {
    loadQueues();
  }, []);

  // Search handler
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setActiveQueueTab("results");
    try {
      // Search using general queries: try full_name, email, phone, customer_id
      const query = searchQuery.trim();
      const results = await searchCustomerApi({
        full_name: query,
        customer_id: query.startsWith("CUS") ? query : undefined,
        email: query.includes("@") ? query : undefined,
        phone: query.startsWith("+") ? query : undefined
      });
      setSearchResults(results);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsSearching(false);
    }
  };

  // Select customer detail page
  const selectCustomer = async (id: number) => {
    setSelectedCustomerId(id);
    setIsProfileLoading(true);
    setActiveDetailTab("risk");
    try {
      const profileData = await getCustomerProfileApi(id);
      setProfile(profileData);
      
      const loanData = await getCustomerLoansApi(id);
      setLoans(loanData);

      const historyData = await getCustomerRiskHistoryApi(id);
      setHistory(Array.isArray(historyData) ? historyData : [historyData]);
    } catch (error) {
      console.error("Failed to load customer profile details:", error);
    } finally {
      setIsProfileLoading(false);
    }
  };

  // Trigger evaluation
  const handleEvaluate = async () => {
    if (!selectedCustomerId) return;
    setIsEvaluating(true);
    try {
      await predictCustomerRiskApi(selectedCustomerId, true);
      // Reload profile
      await selectCustomer(selectedCustomerId);
      // Refresh early warning alerts/high risk queues
      await loadQueues();
    } catch (error) {
      console.error("Failed to evaluate risk:", error);
    } finally {
      setIsEvaluating(false);
    }
  };

  // Run Batch evaluation
  const handleBatchEvaluate = async (e: React.FormEvent) => {
    e.preventDefault();
    const ids = batchInput
      .split(",")
      .map(id => parseInt(id.trim()))
      .filter(id => !isNaN(id));

    if (ids.length === 0) {
      setBatchStatus("Please enter valid, comma-separated customer IDs.");
      return;
    }

    setIsBatchRunning(true);
    setBatchStatus("Executing batch predictions...");
    try {
      const res = await batchRiskPredictionApi(ids);
      setBatchStatus(`Successfully processed ${res.processed} customers. Batch completed.`);
      setBatchInput("");
      await loadQueues();
    } catch (error: any) {
      console.error("Batch run failed:", error);
      setBatchStatus("Batch prediction failed. Check inputs or connection.");
    } finally {
      setIsBatchRunning(false);
    }
  };

  // Parse JSON representations safely
  const parseJsonList = (jsonStr: any): string[] => {
    if (!jsonStr) return [];
    if (Array.isArray(jsonStr)) return jsonStr;
    try {
      const parsed = JSON.parse(jsonStr);
      return Array.isArray(parsed) ? parsed : [jsonStr.toString()];
    } catch {
      return [jsonStr.toString()];
    }
  };

  const parseJsonObject = (jsonStr: any): Record<string, number> => {
    if (!jsonStr) return {};
    if (typeof jsonStr === "object") return jsonStr;
    try {
      return JSON.parse(jsonStr);
    } catch {
      return {};
    }
  };

  const getRiskColor = (category: string) => {
    switch (category?.toUpperCase()) {
      case "CRITICAL":
        return "text-rose-600 bg-rose-50 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-900/30";
      case "HIGH":
        return "text-orange-600 bg-orange-50 border-orange-200 dark:bg-orange-950/30 dark:text-orange-400 dark:border-orange-900/30";
      case "MEDIUM":
        return "text-amber-600 bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/30";
      case "LOW":
        return "text-emerald-600 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/30";
      default:
        return "text-slate-500 bg-slate-50 border-slate-200";
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-6 flex flex-col xl:flex-row gap-6 transition-colors duration-300">
      
      {/* Left panel - Search, Queue, Batch predictions */}
      <div className="w-full xl:w-96 flex flex-col gap-6 flex-shrink-0">
        
        {/* Customer Search Panel */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Customer Lookup
          </h2>
          <form onSubmit={handleSearch} className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Search Name, ID, Email, Phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </form>
        </div>

        {/* Audit Queue Tabs */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm overflow-hidden flex-1 flex flex-col min-h-[400px]">
          <div className="flex border-b border-slate-100 dark:border-slate-800 text-xs font-bold bg-slate-50/50 dark:bg-slate-850/40">
            <button
              onClick={() => setActiveQueueTab("warnings")}
              className={`flex-1 py-3 text-center transition-all cursor-pointer ${
                activeQueueTab === "warnings"
                  ? "border-b-2 border-indigo-500 text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-900"
                  : "text-slate-500 hover:text-slate-950 dark:hover:text-slate-100"
              }`}
            >
              Early Warnings ({earlyWarnings.length})
            </button>
            <button
              onClick={() => setActiveQueueTab("highrisk")}
              className={`flex-1 py-3 text-center transition-all cursor-pointer ${
                activeQueueTab === "highrisk"
                  ? "border-b-2 border-indigo-500 text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-900"
                  : "text-slate-500 hover:text-slate-950 dark:hover:text-slate-100"
              }`}
            >
              High Risk ({highRiskList.length})
            </button>
            {searchResults.length > 0 && (
              <button
                onClick={() => setActiveQueueTab("results")}
                className={`flex-1 py-3 text-center transition-all cursor-pointer ${
                  activeQueueTab === "results"
                    ? "border-b-2 border-indigo-500 text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-900"
                    : "text-slate-500 hover:text-slate-950 dark:hover:text-slate-100"
                }`}
              >
                Search ({searchResults.length})
              </button>
            )}
          </div>

          {/* Queue List Container */}
          <div className="flex-1 overflow-y-auto max-h-[450px] divide-y divide-slate-100 dark:divide-slate-800">
            {activeQueueTab === "warnings" && (
              earlyWarnings.length === 0 ? (
                <div className="p-6 text-center text-slate-400 text-xs">No active early warning alerts.</div>
              ) : (
                earlyWarnings.map(alert => (
                  <div 
                    key={alert.customer_id}
                    onClick={() => selectCustomer(alert.customer_id)}
                    className={`p-4 text-left hover:bg-slate-50/70 dark:hover:bg-slate-800/30 cursor-pointer transition-colors ${selectedCustomerId === alert.customer_id ? "bg-slate-100/50 dark:bg-slate-800/60" : ""}`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-semibold text-xs text-slate-900 dark:text-slate-100">{alert.customer_name}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-bold border ${getRiskColor(alert.risk_category)}`}>
                        {alert.risk_category}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 flex flex-col gap-0.5">
                      <span>ID: CUS-{alert.customer_id} • PD: {(alert.pd_score * 100).toFixed(1)}%</span>
                      <span className="text-rose-500 font-semibold truncate flex items-center gap-1 mt-1">
                        <AlertCircle className="w-3 h-3 flex-shrink-0" />
                        {alert.top_reason}
                      </span>
                    </div>
                  </div>
                ))
              )
            )}

            {activeQueueTab === "highrisk" && (
              highRiskList.length === 0 ? (
                <div className="p-6 text-center text-slate-400 text-xs">No high risk customers listed.</div>
              ) : (
                highRiskList.map(risk => (
                  <div 
                    key={risk.customer_id}
                    onClick={() => selectCustomer(risk.customer_id)}
                    className={`p-4 text-left hover:bg-slate-50/70 dark:hover:bg-slate-800/30 cursor-pointer transition-colors ${selectedCustomerId === risk.customer_id ? "bg-slate-100/50 dark:bg-slate-800/60" : ""}`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-semibold text-xs text-slate-900 dark:text-slate-100">{risk.customer_name}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded font-bold border text-orange-600 bg-orange-50 border-orange-200 dark:bg-orange-950/30 dark:text-orange-400 dark:border-orange-900/30">
                        {risk.risk_category}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      <span>ID: CUS-{risk.customer_id} • PD: {(risk.pd_score * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                ))
              )
            )}

            {activeQueueTab === "results" && (
              isSearching ? (
                <div className="p-6 text-center flex items-center justify-center gap-2 text-slate-400 text-xs">
                  <Loader2 className="w-4 h-4 animate-spin" /> Searching...
                </div>
              ) : searchResults.length === 0 ? (
                <div className="p-6 text-center text-slate-400 text-xs">No customer results.</div>
              ) : (
                searchResults.map(customer => (
                  <div 
                    key={customer.id}
                    onClick={() => selectCustomer(customer.id)}
                    className={`p-4 text-left hover:bg-slate-50/70 dark:hover:bg-slate-800/30 cursor-pointer transition-colors ${selectedCustomerId === customer.id ? "bg-slate-100/50 dark:bg-slate-800/60" : ""}`}
                  >
                    <div className="font-semibold text-xs text-slate-900 dark:text-slate-100">
                      {customer.full_name || customer.name}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      <span>ID: {customer.customer_id || `CUS-${customer.id}`} • Credit Score: {customer.credit_score}</span>
                      <span className="block">{customer.city}, {customer.state}</span>
                    </div>
                  </div>
                ))
              )
            )}
          </div>
        </div>

        {/* Batch Predication Launcher */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4 text-left">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-indigo-500" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Batch Risk Engine
            </h2>
          </div>
          <form onSubmit={handleBatchEvaluate} className="space-y-3">
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Run evaluation on multiple customer IDs concurrently (comma-separated values):
            </p>
            <input
              type="text"
              placeholder="1, 8, 14, 16"
              value={batchInput}
              onChange={(e) => setBatchInput(e.target.value)}
              className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
            <button
              type="submit"
              disabled={isBatchRunning || !batchInput.trim()}
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl shadow-md cursor-pointer transition-all flex items-center justify-center gap-1.5 disabled:opacity-40"
            >
              {isBatchRunning ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
              Launch Batch Risk Audit
            </button>
            {batchStatus && (
              <p className="text-[10px] font-semibold text-slate-500 mt-1.5 bg-slate-50 dark:bg-slate-950 p-2 rounded-lg border border-slate-200/40 dark:border-slate-800">
                {batchStatus}
              </p>
            )}
          </form>
        </div>

      </div>

      {/* Right panel - Selected Customer profile & detailed risk assessment sheets */}
      <div className="flex-1 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl shadow-sm flex flex-col overflow-hidden min-h-[600px]">
        {isProfileLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 text-slate-400">
            <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
            <span className="text-sm font-semibold">Decrypting credit risk profiles...</span>
          </div>
        ) : !profile ? (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-450 p-8 text-center">
            <ShieldAlert className="w-12 h-12 text-slate-300 dark:text-slate-700 mb-3" />
            <h3 className="text-lg font-bold">No Customer Inspected</h3>
            <p className="text-sm text-slate-400 max-w-sm mt-1">
              Select an account from the early warning alert queues, high risk arrays, or perform lookup.
            </p>
          </div>
        ) : (
          <div className="flex-1 flex flex-col overflow-y-auto">
            
            {/* Header info sheet */}
            <div className="p-6 bg-slate-50/70 dark:bg-slate-800/30 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
              
              <div className="flex items-start gap-4 text-left">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <User className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h2 className="text-xl font-bold tracking-tight text-slate-950 dark:text-white">
                    {profile.customer.full_name || profile.customer.name}
                  </h2>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400 font-medium">
                    <span>ID: {profile.customer.customer_id || `CUS-${profile.customer.id}`}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {profile.customer.city}, {profile.customer.state}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5" /> {profile.customer.employment_type?.replace("_", " ")}</span>
                  </div>
                </div>
              </div>

              {/* Action refresh risk prediction */}
              <button
                onClick={handleEvaluate}
                disabled={isEvaluating}
                className="self-start md:self-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-40 disabled:pointer-events-none"
              >
                {isEvaluating ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <RefreshCw className="w-3.5 h-3.5" />
                )}
                Run Risk Evaluation
              </button>
            </div>

            {/* Profile Overview Indicators Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 border-b border-slate-100 dark:border-slate-800 text-left">
              <div className="p-5 border-r border-slate-100 dark:border-slate-800 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Credit Score</span>
                <div className="text-xl font-extrabold">{profile.customer.credit_score}</div>
                <span className="text-[10px] text-slate-400">Underwriting scoring range</span>
              </div>
              <div className="p-5 border-r border-slate-100 dark:border-slate-800 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Monthly Income</span>
                <div className="text-xl font-extrabold">₹{profile.customer.monthly_income?.toLocaleString() || 0}</div>
                <span className="text-[10px] text-slate-400">Declared salary/revenue</span>
              </div>
              <div className="p-5 border-r border-slate-100 dark:border-slate-800 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Active Contracts</span>
                <div className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400">{profile.active_loans_count}</div>
                <span className="text-[10px] text-slate-400">Total institutional accounts</span>
              </div>
              <div className="p-5 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Total Outstanding</span>
                <div className="text-xl font-extrabold text-rose-500">₹{profile.total_outstanding.toLocaleString()}</div>
                <span className="text-[10px] text-slate-400">Total remaining liabilities</span>
              </div>
            </div>

            {/* Detailed Tabs Header */}
            <div className="flex border-b border-slate-100 dark:border-slate-800 text-xs font-bold">
              <button
                onClick={() => setActiveDetailTab("risk")}
                className={`px-6 py-4 transition-all border-b-2 cursor-pointer ${
                  activeDetailTab === "risk"
                    ? "border-indigo-500 text-indigo-600 dark:text-indigo-400"
                    : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
                }`}
              >
                Risk Assessment Summary
              </button>
              <button
                onClick={() => setActiveDetailTab("loans")}
                className={`px-6 py-4 transition-all border-b-2 cursor-pointer ${
                  activeDetailTab === "loans"
                    ? "border-indigo-500 text-indigo-600 dark:text-indigo-400"
                    : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
                }`}
              >
                Loans list ({loans.length})
              </button>
              <button
                onClick={() => setActiveDetailTab("history")}
                className={`px-6 py-4 transition-all border-b-2 cursor-pointer ${
                  activeDetailTab === "history"
                    ? "border-indigo-500 text-indigo-600 dark:text-indigo-400"
                    : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
                }`}
              >
                Risk Evaluation History ({history.length})
              </button>
            </div>

            {/* Tabs Details Content */}
            <div className="p-6 flex-1 text-left">
              
              {/* Tab 1: Risk Assessment Summary */}
              {activeDetailTab === "risk" && (
                !profile.latest_risk ? (
                  <div className="py-12 text-center text-slate-400 text-sm">
                    <Database className="w-8 h-8 mx-auto mb-2 text-slate-350" />
                    No previous risk assessments recorded. Please execute a Risk Evaluation.
                  </div>
                ) : (
                  <div className="space-y-8 animate-fade-in">
                    
                    {/* Risk parameters */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/10 space-y-1">
                        <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                          Probability of Default (PD)
                        </span>
                        <div className="text-2xl font-black text-slate-900 dark:text-white">
                          {(profile.latest_risk.pd_score * 100).toFixed(2)}%
                        </div>
                        <div className="text-[10px] text-slate-400 font-medium">PD engine index score</div>
                      </div>

                      <div className="p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/10 space-y-1">
                        <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                          Risk Classification
                        </span>
                        <div>
                          <span className={`inline-flex px-2.5 py-0.5 text-xs font-extrabold rounded-md border uppercase tracking-wider ${getRiskColor(profile.latest_risk.risk_category)}`}>
                            {profile.latest_risk.risk_category}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-medium mt-1">Classified credit category</div>
                      </div>

                      <div className="p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/10 space-y-1">
                        <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                          Model evaluation score
                        </span>
                        <div className="text-2xl font-black text-slate-900 dark:text-white">
                          {profile.latest_risk.risk_score}
                        </div>
                        <div className="text-[10px] text-slate-400 font-medium">Credit engine model version: {profile.latest_risk.model_version}</div>
                      </div>
                    </div>

                    {/* Breakdown reasons and recommendations */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Risk Reasons */}
                      <div className="space-y-3">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                          <AlertOctagon className="w-4 h-4 text-rose-500" />
                          Risk Factors Flagged
                        </h3>
                        <div className="bg-rose-500/5 border border-rose-500/10 rounded-2xl p-4 space-y-2 text-xs">
                          {parseJsonList(profile.latest_risk.risk_reasons).map((reason, idx) => (
                            <div key={idx} className="flex items-start gap-2.5 text-rose-800 dark:text-rose-350 font-medium">
                              <span className="mt-1 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-rose-500" />
                              <span>{reason}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Recommended Actions */}
                      <div className="space-y-3">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                          <FileText className="w-4 h-4 text-emerald-500" />
                          AI-Underwriting Directives
                        </h3>
                        <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-2xl p-4 space-y-2 text-xs">
                          {parseJsonList(profile.latest_risk.recommended_action).map((action, idx) => (
                            <div key={idx} className="flex items-start gap-2.5 text-emerald-800 dark:text-emerald-350 font-medium">
                              <span className="mt-1 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              <span>{action}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Feature Importance Indicators */}
                    <div className="space-y-3">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                        Model Feature Attribution weights
                      </h3>
                      <div className="p-5 border border-slate-200/70 dark:border-slate-800 rounded-2xl space-y-4">
                        {Object.entries(parseJsonObject(profile.latest_risk.feature_importance)).length === 0 ? (
                          <div className="text-slate-400 text-xs">No model feature attribution metadata recorded.</div>
                        ) : (
                          Object.entries(parseJsonObject(profile.latest_risk.feature_importance))
                            .sort((a, b) => b[1] - a[1])
                            .map(([key, weight]) => (
                              <div key={key} className="space-y-1.5 text-xs">
                                <div className="flex justify-between font-semibold">
                                  <span className="text-slate-600 dark:text-slate-400 capitalize">{key.replace(/_/g, " ")}</span>
                                  <span className="text-slate-900 dark:text-slate-200">{(weight * 100).toFixed(1)}% weight</span>
                                </div>
                                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                                  <div 
                                    className="bg-indigo-600 dark:bg-indigo-500 h-full rounded-full"
                                    style={{ width: `${weight * 100}%` }}
                                  />
                                </div>
                              </div>
                            ))
                        )}
                      </div>
                    </div>

                    <div className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 text-right">
                      Report audited at: {new Date(profile.latest_risk.predicted_at).toLocaleString()}
                    </div>

                  </div>
                )
              )}

              {/* Tab 2: Loans list */}
              {activeDetailTab === "loans" && (
                loans.length === 0 ? (
                  <div className="py-12 text-center text-slate-400 text-sm">
                    <Database className="w-8 h-8 mx-auto mb-2 text-slate-350" />
                    No active loan records detected for this customer.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-400 dark:text-slate-500 border-b border-slate-150 dark:border-slate-800">
                          <th className="py-3 px-4">Loan ID</th>
                          <th className="py-3 px-4">Type</th>
                          <th className="py-3 px-4 text-right">Principal</th>
                          <th className="py-3 px-4 text-right">Outstanding</th>
                          <th className="py-3 px-4 text-right">Rate</th>
                          <th className="py-3 px-4 text-right">Tenure</th>
                          <th className="py-3 px-4 text-right">DPD</th>
                          <th className="py-3 px-4 text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
                        {loans.map(loan => (
                          <tr key={loan.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20">
                            <td className="py-3 px-4 font-semibold text-slate-900 dark:text-slate-100">{loan.loan_id}</td>
                            <td className="py-3 px-4 font-medium">{loan.loan_type}</td>
                            <td className="py-3 px-4 text-right font-medium">₹{loan.principal_amount.toLocaleString()}</td>
                            <td className="py-3 px-4 text-right font-medium text-rose-500">₹{loan.outstanding_balance.toLocaleString()}</td>
                            <td className="py-3 px-4 text-right text-slate-500">{loan.interest_rate}%</td>
                            <td className="py-3 px-4 text-right text-slate-500">{loan.tenure_months} mo</td>
                            <td className={`py-3 px-4 text-right font-bold ${loan.dpd > 0 ? "text-rose-500" : "text-slate-400"}`}>{loan.dpd}</td>
                            <td className="py-3 px-4 text-center">
                              <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold ${
                                loan.status === "ACTIVE" 
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/30" 
                                  : loan.status === "CLOSED"
                                  ? "bg-slate-100 text-slate-500 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700"
                                  : "bg-rose-50 text-rose-700 border border-rose-100 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-900/30 animate-pulse"
                              }`}>
                                {loan.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )
              )}

              {/* Tab 3: Risk Evaluation History */}
              {activeDetailTab === "history" && (
                history.length === 0 ? (
                  <div className="py-12 text-center text-slate-400 text-sm">
                    <Database className="w-8 h-8 mx-auto mb-2 text-slate-350" />
                    No previous risk history data records.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {history.map(item => (
                      <div 
                        key={item.id} 
                        className="p-4 border border-slate-200/60 dark:border-slate-800 rounded-2xl hover:bg-slate-50/50 dark:hover:bg-slate-800/10 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-900 dark:text-slate-100">{item.prediction_id}</span>
                            <span className={`text-[10px] px-2 py-0.2 rounded font-bold border ${getRiskColor(item.risk_category)}`}>
                              {item.risk_category}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-400 font-medium">
                            Model v{item.model_version} • Score: {item.risk_score} • DPD: {item.will_default_12m ? "Default Flagged" : "Active"}
                          </div>
                        </div>

                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <div className="font-bold text-slate-800 dark:text-slate-200">{(item.pd_score * 100).toFixed(2)}%</div>
                            <span className="text-[10px] text-slate-400">Default Probability</span>
                          </div>
                          <div className="text-right text-slate-400 text-[10px] font-medium">
                            {new Date(item.predicted_at).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              )}

            </div>

          </div>
        )}
      </div>

    </div>
  );
}

export default CustomerRisk;
