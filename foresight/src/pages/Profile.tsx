import { useAuthStore } from "../components/zustand/store";
import { User, Shield, Key, Server, Cpu } from "lucide-react";

const Profile = () => {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);

  return (
    <div className="w-full p-6 space-y-8 bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-900 dark:text-slate-100 transition-colors duration-300 text-left">
      
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">System Profile & Session</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Auditing active session parameters, credentials, and network endpoints.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* User profile card */}
        <div className="md:col-span-2 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm rounded-2xl p-6 space-y-6">
          <div className="flex items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold">User Information</h2>
              <p className="text-xs text-slate-500">Authorized operator credentials</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Username</span>
              <div className="text-sm font-semibold">{user?.username || "N/A"}</div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">System Role</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Shield className="w-3.5 h-3.5 text-indigo-500" />
                <span className="text-xs font-bold uppercase px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/45 text-indigo-700 dark:text-indigo-455 border border-indigo-100 dark:border-indigo-900/30">
                  {user?.role || "N/A"}
                </span>
              </div>
            </div>

            <div className="space-y-1 sm:col-span-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Session JWT Token</span>
              <div className="relative group mt-1">
                <div className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-xs font-mono break-all text-slate-600 dark:text-slate-400 select-all">
                  {token || "No token stored"}
                </div>
                <div className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Key className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Server status parameters */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm rounded-2xl p-6 space-y-6">
          <div className="flex items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/45 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Server className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold">API Gateway</h2>
              <p className="text-xs text-slate-500">Backend connectivity config</p>
            </div>
          </div>

          <div className="space-y-4 text-xs font-medium text-slate-600 dark:text-slate-450">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Base URL</span>
              <div className="font-semibold text-slate-900 dark:text-slate-200">
                {import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"}
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Auth Header Schema</span>
              <div className="font-mono text-slate-900 dark:text-slate-200">
                Authorization: Bearer &lt;JWT_TOKEN&gt;
              </div>
            </div>

            <div className="space-y-1 border-t border-slate-100 dark:border-slate-800 pt-3">
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                <Cpu className="w-4 h-4" />
                <span className="font-semibold">AI Risk Engine online</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Rule-based scoring and deep risk attribution models enabled.</p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default Profile;
