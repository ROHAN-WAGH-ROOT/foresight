import {
  Building2,
  CalendarDays,
  Clock,
  Mail,
  MapPin,
  Phone,
  Shield,
  User,
} from "lucide-react";
import { useAuthStore } from "../components/zustand/store";

const Profile = () => {
  const user = useAuthStore((state) => state.user);
  const dummyProfile = {
    fullName: "Rohan Mehta",
    email: "rohan.mehta@foresight.io",
    phone: "+91 98765 43210",
    department: "Risk & Compliance",
    employeeId: "FS-20481",
    location: "Pune, Maharashtra, IN",
    joinDate: "12 Mar 2023",
    lastLogin: "Today, 09:42 AM",
  };

  return (
    <div className="w-full p-6 space-y-8 bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-900 dark:text-slate-100 transition-colors duration-300 text-left">
      {/* Page Header */}
      <div>
        <p className="text-2xl    font-bold tracking-tight text-slate-900 dark:text-white">
          System Profile & Session
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Auditing active session parameters and account credentials.
        </p>
      </div>
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm rounded-2xl p-6 space-y-6">
        {/* Card header */}
        <div className="flex justify-between items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex">
            <div className="mx-5 w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold"> {dummyProfile.fullName}</h2>
              <p className="text-xs text-slate-500">
                Authorized operator credentials
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-indigo-500" />
            <span className="text-xs font-bold uppercase px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/45 text-indigo-700 dark:text-indigo-455 border border-indigo-100 dark:border-indigo-900/30">
              {user?.role || "Admin"}
            </span>
          </div>
        </div>
        {/* Field grid — extra dummy fields added here */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Employee ID
            </span>
            <div className="text-sm font-semibold">
              {dummyProfile.employeeId}
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Department
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-sm font-semibold">
                {dummyProfile.department}
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Email
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-sm font-semibold truncate">
                {dummyProfile.email}
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Phone
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-sm font-semibold">
                {dummyProfile.phone}
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Location
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-sm font-semibold">
                {dummyProfile.location}
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Joined On
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <CalendarDays className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-sm font-semibold">
                {dummyProfile.joinDate}
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Last Login
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-sm font-semibold">
                {dummyProfile.lastLogin}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
