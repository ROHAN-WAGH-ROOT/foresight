// import { NavLink, useLocation } from "react-router-dom";
// import { Button } from "./ui/button";
// import { useTheme } from "next-themes";
// import {
//   ArrowLeft,
//   LayoutDashboard,
//   LayoutListIcon,
//   Moon,
//   Sun,
//   User,
// } from "lucide-react";
// import profileImage from "../assets/profile.png";
// import logoDark from "../assets/ForeSight_Dark.png";
// import logoLight from "../assets/ForeSight_Light.png";

// const Sidebar = () => {
//   const { theme, setTheme } = useTheme();
//   const location = useLocation();
//   return (
//     <div className="w-72 h-screen border-r-1 border-gray-300 px-2 select-none">
//       <div className="flex">
//         {/* <div className="text-start text-[16px] pl-2 pr-0 pt-4">Logo</div> */}
//         <div className="text-start h-36 w-96 text-[16px]">{theme == "dark" ? <img src={logoDark} alt="Dark Logo" /> : <img src={logoLight} alt="Light Logo" />}</div>
//         {/* <div className="cursor-pointer text-end flex align-middle ml-auto hover:scale-105 py-4 justify-end"><ArrowLeft /></div> */}
//       </div>
//       <div className="bg-blue-50/80 rounded-lg p-3 py-4 dark:text-black">
//         <div className="flex justify-between mx-2">
//           <div className="w-14 h-14 border-1 border-black">
//             <img
//               className="pointer-events-none"
//               src={profileImage}
//               alt="Profile"
//             />
//           </div>
//           <div className="flex my-auto justify-center cursor-pointer">
//             <Button
//               variant="outline"
//               size="icon"
//               className="cursor-pointer border-1 dark:border-black"
//               onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
//             >
//               {theme === "dark" ? (
//                 <Sun className="h-5 w-5 text-black" />
//               ) : (
//                 <Moon className="h-5 w-5" />
//               )}
//             </Button>
//           </div>
//         </div>
//         <div className="flex flex-col text-start mx-2 my-3 align-middle justify-items-start">
//           <div className="font-bold text-gray-500">Monday, March 24</div>
//           <div className="text-3xl font-extrabold">Welcome back, Rohan!</div>
//         </div>
//       </div>
//       <div className="bg-blue-50/80 rounded-lg p-3 py-4 mt-4 dark:text-black">
//         <nav className="flex flex-col text-[14px] gap-3">
//           <NavLink
//             to="/dashboard"
//             className={
//               location.pathname === "/dashboard"
//                 ? "bg-blue-500 dark:bg-black text-white py-2"
//                 : "hover:bg-gray-200 py-2"
//             }
//           >
//             <div className="flex px-2">
//               <div className="px-2">
//                 <LayoutDashboard />
//               </div>
//               <div className="px-2">Dashboard</div>
//             </div>
//           </NavLink>
//           <NavLink
//             to="/profile"
//             className={
//               location.pathname === "/profile"
//                 ? "bg-blue-500 dark:bg-black text-white py-2"
//                 : "hover:bg-gray-200 py-2"
//             }
//           >
//             <div className="flex px-2">
//               <div className="px-2">
//                 <User />
//               </div>
//               <div className="px-2">Profile</div>
//             </div>
//           </NavLink>
//           {/* <NavLink to="/company">Company</NavLink> */}
//           {/* <NavLink to="/individual">Individual</NavLink> */}
//         </nav>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;


// import { NavLink, useLocation } from "react-router-dom";
// import { Button } from "./ui/button";
// import { useTheme } from "next-themes";
// import {
//   LayoutDashboard,
//   Moon,
//   Sun,
//   User,
// } from "lucide-react";
// import profileImage from "../assets/profile.png";
// import logoDark from "../assets/ForeSight_Dark.png";
// import logoLight from "../assets/ForeSight_Light.png";

// const Sidebar = () => {
//   const { theme, setTheme } = useTheme();
//   const location = useLocation();

//   // Dynamic greeting based on current hour
//   const getGreeting = () => {
//     const hr = new Date().getHours();
//     if (hr < 12) return "Good morning";
//     if (hr < 17) return "Good afternoon";
//     return "Welcome back";
//   };

//   // Nav link style generator to keep code clean and highly readable
//   const getNavLinkClass = (path: string) => {
//     const isActive = location.pathname === path;
//     return `flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-300 relative group overflow-hidden ${
//       isActive
//         ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20 dark:from-zinc-100 dark:to-zinc-200 dark:text-zinc-900 dark:shadow-none"
//         : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/70 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-800/50"
//     }`;
//   };

//   return (
//     <div className="relative w-72 h-screen border-r border-gray-200/80 bg-gradient-to-b from-gray-50/50 to-white px-4 py-6 select-none flex flex-col justify-between dark:border-zinc-800/80 dark:from-zinc-950 dark:to-zinc-900">
      
//       {/* Decorative Blur Background Accents */}
//       <div className="absolute top-0 left-0 w-32 h-32 bg-blue-400/10 rounded-full blur-3xl pointer-events-none dark:bg-blue-500/5" />
//       <div className="absolute bottom-12 right-0 w-24 h-24 bg-purple-400/10 rounded-full blur-2xl pointer-events-none dark:bg-purple-500/5" />

//       <div className="relative flex flex-col gap-6">
//         {/* Brand Logo Wrapper */}
//         <div className="flex items-center h-16 px-2 overflow-hidden">
//           <img 
//             src={theme === "dark" ? logoDark : logoLight} 
//             alt="ForeSight Logo" 
//             className="h-10 w-auto object-contain transition-transform duration-300 hover:scale-102"
//           />
//         </div>

//         {/* User Glassmorphic Profile Card */}
//         <div className="relative overflow-hidden rounded-2xl border border-gray-200/60 bg-white/60 backdrop-blur-md p-4 shadow-[0_2px_12px_-3px_rgba(0,0,0,0.04)] dark:border-zinc-800/60 dark:bg-zinc-900/40">
//           <div className="flex items-center justify-between">
//             <div className="w-12 h-12 rounded-xl border border-gray-100 bg-gray-50 overflow-hidden shadow-inner dark:border-zinc-800 dark:bg-zinc-800">
//               <img
//                 className="w-full h-full object-cover pointer-events-none"
//                 src={profileImage}
//                 alt="Profile"
//               />
//             </div>
            
//             {/* Elegant Mode Switcher Toggle */}
//             <Button
//               variant="ghost"
//               size="icon"
//               className="rounded-xl hover:bg-gray-100 text-gray-500 dark:text-zinc-400 dark:hover:bg-zinc-800"
//               onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
//             >
//               {theme === "dark" ? (
//                 <Sun className="h-4 w-4 transition-transform duration-500 hover:rotate-45" />
//               ) : (
//                 <Moon className="h-4 w-4 transition-transform duration-500 hover:-rotate-12" />
//               )}
//             </Button>
//           </div>

//           <div className="flex flex-col mt-4 space-y-0.5">
//             <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-zinc-500">
//               {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
//             </span>
//             <h3 className="text-lg font-bold tracking-tight text-gray-900 dark:text-zinc-100">
//               {getGreeting()}, <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400">Rohan</span>!
//             </h3>
//           </div>
//         </div>

//         {/* Navigation Elements */}
//         <div className="flex flex-col gap-1 mt-2">
//           <span className="px-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-zinc-500 mb-2">
//             Workspace
//           </span>
//           <nav className="flex flex-col gap-1.5">
//             <NavLink to="/dashboard" className={getNavLinkClass("/dashboard")}>
//               <LayoutDashboard className="w-4 h-4" />
//               <span>Dashboard</span>
//               {location.pathname !== "/dashboard" && (
//                 <div className="absolute right-3 w-1 h-1 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity dark:bg-blue-400" />
//               )}
//             </NavLink>

//             <NavLink to="/profile" className={getNavLinkClass("/profile")}>
//               <User className="w-4 h-4" />
//               <span>Profile</span>
//               {location.pathname !== "/profile" && (
//                 <div className="absolute right-3 w-1 h-1 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity dark:bg-blue-400" />
//               )}
//             </NavLink>
//           </nav>
//         </div>
//       </div>

//       {/* Subtle Footer */}
//       <div className="px-4 text-[11px] text-gray-400 dark:text-zinc-600 font-medium">
//         v1.0.0 • ForeSight
//       </div>
//     </div>
//   );
// };

import { NavLink, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { useTheme } from "next-themes";
import { useAuthStore } from "./zustand/store";
import {
  LayoutDashboard,
  Moon,
  Sun,
  User,
  Compass,
  ShieldAlert,
  CreditCard,
  LogOut
} from "lucide-react";
import profileImage from "../assets/profile.png";

const Sidebar = () => {
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const getGreeting = () => {
    const hr = new Date().getHours();
    if (hr < 12) return "Good morning";
    if (hr < 17) return "Good afternoon";
    return "Welcome back";
  };

  const getNavLinkClass = (path: string) => {
    const isActive = location.pathname === path;
    return `flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-300 relative group overflow-hidden ${
      isActive
        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20 dark:from-zinc-100 dark:to-zinc-200 dark:text-zinc-900 dark:shadow-none"
        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/70 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-800/50"
    }`;
  };

  return (
    <div className="relative w-72 h-screen border-r border-gray-200/80 bg-gradient-to-b from-gray-50/50 to-white px-4 py-6 select-none flex flex-col justify-between dark:border-zinc-800/80 dark:from-zinc-950 dark:to-zinc-900">
      
      {/* Decorative Blur Background Accents */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-blue-400/10 rounded-full blur-3xl pointer-events-none dark:bg-blue-500/5" />
      <div className="absolute bottom-12 right-0 w-24 h-24 bg-purple-400/10 rounded-full blur-2xl pointer-events-none dark:bg-purple-500/5" />

      <div className="relative flex flex-col gap-6">
        
        {/* Pure Code Typography Logo */}
        <div className="flex items-center gap-2.5 h-16 px-2 group cursor-pointer">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-sm shadow-blue-500/30 transition-transform duration-500 group-hover:rotate-12 dark:from-blue-600 dark:to-purple-600">
            <Compass className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tight font-sans text-gray-900 dark:text-zinc-50">
              Fore<span className="bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400">Sight</span>
            </span>
            <span className="text-[10px] font-bold tracking-widest uppercase text-gray-400 dark:text-zinc-500 -mt-1">
              Analytics Platform
            </span>
          </div>
        </div>

        {/* User Glassmorphic Profile Card */}
        <div className="relative overflow-hidden rounded-2xl border border-gray-200/60 bg-white/60 backdrop-blur-md p-4 shadow-[0_2px_12px_-3px_rgba(0,0,0,0.04)] dark:border-zinc-800/60 dark:bg-zinc-900/40">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-xl border border-gray-100 bg-gray-50 overflow-hidden shadow-inner dark:border-zinc-800 dark:bg-zinc-800">
              <img
                className="w-full h-full object-cover pointer-events-none"
                src={profileImage}
                alt="Profile"
              />
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              className="rounded-xl hover:bg-gray-100 text-gray-500 dark:text-zinc-400 dark:hover:bg-zinc-800"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4 transition-transform duration-500 hover:rotate-45" />
              ) : (
                <Moon className="h-4 w-4 transition-transform duration-500 hover:-rotate-12" />
              )}
            </Button>
          </div>

          <div className="flex flex-col mt-4 space-y-0.5 text-left">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-zinc-500">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            </span>
            <h3 className="text-lg font-bold tracking-tight text-gray-900 dark:text-zinc-100 truncate">
              {getGreeting()}, <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400 capitalize">{user?.username || "Rohan"}</span>!
            </h3>
          </div>
        </div>

        {/* Navigation Elements */}
        <div className="flex flex-col gap-1 mt-2 text-left">
          <span className="px-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-zinc-500 mb-2">
            Workspace
          </span>
          <nav className="flex flex-col gap-1.5">
            <NavLink to="/dashboard" className={getNavLinkClass("/dashboard")}>
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
              {location.pathname !== "/dashboard" && (
                <div className="absolute right-3 w-1 h-1 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity dark:bg-blue-400" />
              )}
            </NavLink>

            <NavLink to="/risk" className={getNavLinkClass("/risk")}>
              <ShieldAlert className="w-4 h-4" />
              <span>Risk Audit</span>
              {location.pathname !== "/risk" && (
                <div className="absolute right-3 w-1 h-1 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity dark:bg-blue-400" />
              )}
            </NavLink>

            <NavLink to="/loans" className={getNavLinkClass("/loans")}>
              <CreditCard className="w-4 h-4" />
              <span>Loans Registry</span>
              {location.pathname !== "/loans" && (
                <div className="absolute right-3 w-1 h-1 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity dark:bg-blue-400" />
              )}
            </NavLink>

            <NavLink to="/profile" className={getNavLinkClass("/profile")}>
              <User className="w-4 h-4" />
              <span>Profile</span>
              {location.pathname !== "/profile" && (
                <div className="absolute right-3 w-1 h-1 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity dark:bg-blue-400" />
              )}
            </NavLink>
          </nav>
        </div>
      </div>

      <div className="flex flex-col gap-4 text-left">
        {/* Logout Button */}
        <button
          onClick={() => logout()}
          className="flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:text-rose-400 dark:hover:bg-rose-950/20 dark:hover:text-rose-450 transition-all duration-300 w-full text-left cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>

        {/* Subtle Footer */}
        <div className="px-4 text-[11px] text-gray-400 dark:text-zinc-600 font-medium">
          v2.4.0 • ForeSight Corp
        </div>
      </div>
    </div>
  );
};

export default Sidebar;