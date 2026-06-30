import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginApi, getMeApi } from "../components/api";
import { useAuthStore } from "../components/zustand/store";
import { Compass, Lock, User, AlertCircle, Loader2 } from "lucide-react";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loginStore = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // 1. Authenticate with form data
      const tokenRes = await loginApi(username, password);
      
      // 2. Set token temporarily in store so the interceptor can fetch meApi
      loginStore({ username: "", role: "" }, tokenRes.access_token);

      // 3. Fetch user info
      const userRes = await getMeApi();

      // 4. Update store with complete user profile and token
      loginStore(userRes, tokenRes.access_token);
      
      // 5. Navigate to dashboard
      navigate("/dashboard");
    } catch (err: any) {
      console.error(err);
      setError(
        err.response?.data?.detail || 
        err.message || 
        "Authentication failed. Please verify credentials."
      );
      // Clean store state in case of failure
      useAuthStore.getState().logout();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-screen flex items-center justify-center bg-slate-900 overflow-hidden font-sans">
      {/* Decorative background glow elements */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

      {/* Login Card */}
      <div className="relative w-full max-w-md p-8 bg-slate-800/40 border border-slate-700/50 backdrop-blur-xl rounded-3xl shadow-2xl flex flex-col items-center">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8 cursor-default select-none">
          <div className="flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/20">
            <Compass className="w-6 h-6 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-black tracking-tight text-white">
              Fore<span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">Sight</span>
            </span>
            <span className="text-[10px] font-bold tracking-widest uppercase text-slate-400 -mt-1">
              Analytics Platform
            </span>
          </div>
        </div>

        <div className="w-full text-center mb-6">
          <h2 className="text-xl font-bold text-white">Welcome back</h2>
          <p className="text-sm text-slate-400 mt-1">Enter your credentials to access the credit risk engine</p>
        </div>

        {error && (
          <div className="w-full p-4 mb-4 bg-rose-500/15 border border-rose-500/20 rounded-2xl flex items-start gap-3 text-rose-300 text-xs animate-shake">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="w-full space-y-5">
          {/* Username */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Username</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                <User className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder="admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
                className="w-full pl-11 pr-4 py-3 bg-slate-900/60 border border-slate-700/60 rounded-2xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all disabled:opacity-50"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="w-full pl-11 pr-4 py-3 bg-slate-900/60 border border-slate-700/60 rounded-2xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all disabled:opacity-50"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm rounded-2xl shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer mt-4"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="mt-8 text-xs text-slate-500 text-center">
          ForeSight Risk Management System v2.4.0
        </div>
      </div>
    </div>
  );
}

export default Login;