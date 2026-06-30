// // import {DashboardCard} from "@/components/ui/Dashboardcards";
// // // import { Landmark, LucideCircleDollarSign, ShieldAlert, TrendingDown } from "lucide-react";

// // // const Dashboard = () => {
// // //   return (
// // //     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 w-full p-1">
// // //       <Dashboardcards 
// // //         title="Total loan portfolio" 
// // //         data="₹ 802 Cr." 
// // //         icon={<LucideCircleDollarSign className="w-5 h-5" />} 
// // //         trend={{ value: "+14.2%", isPositive: true }}
// // //       />
      
// // //       <Dashboardcards 
// // //         title="Active Accounts" 
// // //         data="1,234" 
// // //         icon={<Landmark className="w-5 h-5" />} 
// // //         trend={{ value: "+8.1%", isPositive: true }}
// // //       />
      
// // //       <Dashboardcards 
// // //         title="High Risk Accounts" 
// // //         data="56" 
// // //         icon={<ShieldAlert className="w-5 h-5" />} 
// // //         trend={{ value: "-2.4%", isPositive: false }} // Generates a clean subtle red badge
// // //       />
// // //     </div>
// // //   );
// // // };

// // // export default Dashboard;

// // import { LucideCircleDollarSign, Landmark, ShieldAlert } from "lucide-react"; 

// // export default function AnalyticsGrid() {
// //   return (
// //     // Upgraded gap-6 for spacious alignment & added p-4 padding so the cards breathe
// //     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full p-4">
// //       <DashboardCard 
// //         title="Total loan portfolio" 
// //         data="₹ 802 Cr." 
// //         icon={<LucideCircleDollarSign className="w-5 h-5" />} 
// //         trend={{ value: "+14.2%", isPositive: true }}
// //       />
      
// //       <DashboardCard 
// //         title="Active Accounts" 
// //         data="1,234" 
// //         icon={<Landmark className="w-5 h-5" />} 
// //         trend={{ value: "+8.1%", isPositive: true }}
// //       />
      
// //       <DashboardCard 
// //         title="High Risk Accounts" 
// //         data="56" 
// //         icon={<ShieldAlert className="w-5 h-5" />} 
// //         trend={{ value: "-2.4%", isPositive: false }} 
// //       />
// //     </div>
// //   );
// // }


// // import React, { useState } from "react";
// // import { DashboardCard } from "@/components/ui/Dashboardcards";
// // import { LucideCircleDollarSign, Landmark, ShieldAlert, Calendar } from "lucide-react";
// // import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

// // // Mock predictive data based on the selection
// // const PREDICTIVE_DATA = {
// //   "3m": [
// //     { month: "Month 1", Low: 400, Medium: 240, High: 56, Defaults: 80 },
// //     { month: "Month 2", Low: 380, Medium: 250, High: 62, Defaults: 95 },
// //     { month: "Month 3", Low: 350, Medium: 270, High: 70, Defaults: 110 },
// //   ],
// //   "6m": [
// //     { month: "Month 1", Low: 400, Medium: 240, High: 56, Defaults: 80 },
// //     { month: "Month 2", Low: 380, Medium: 250, High: 62, Defaults: 95 },
// //     { month: "Month 3", Low: 350, Medium: 270, High: 70, Defaults: 110 },
// //     { month: "Month 4", Low: 310, Medium: 290, High: 85, Defaults: 130 },
// //     { month: "Month 5", Low: 290, Medium: 310, High: 92, Defaults: 145 },
// //     { month: "Month 6", Low: 260, Medium: 330, High: 105, Defaults: 160 },
// //   ],
// //   "12m": [
// //     { month: "M1", Low: 400, Medium: 240, High: 56, Defaults: 80 },
// //     { month: "M2", Low: 380, Medium: 250, High: 62, Defaults: 95 },
// //     { month: "M3", Low: 350, Medium: 270, High: 70, Defaults: 110 },
// //     { month: "M4", Low: 310, Medium: 290, High: 85, Defaults: 130 },
// //     { month: "M5", Low: 290, Medium: 310, High: 92, Defaults: 145 },
// //     { month: "M6", Low: 260, Medium: 330, High: 105, Defaults: 160 },
// //     { month: "M7", Low: 240, Medium: 340, High: 110, Defaults: 175 },
// //     { month: "M8", Low: 220, Medium: 350, High: 115, Defaults: 190 },
// //     { month: "M9", Low: 200, Medium: 360, High: 120, Defaults: 200 },
// //     { month: "M10", Low: 190, Medium: 365, High: 130, Defaults: 215 },
// //     { month: "M11", Low: 180, Medium: 370, High: 142, Defaults: 230 },
// //     { month: "M12", Low: 175, Medium: 380, High: 156, Defaults: 250 },
// //   ]
// // };

// // export default function AnalyticsGrid() {
// //   const [timeframe, setTimeframe] = useState<"3m" | "6m" | "12m">("12m");
// //   const currentData = PREDICTIVE_DATA[timeframe];

// //   return (
// //     <div className="w-full p-4 space-y-6 bg-slate-50 min-h-screen">
      
// //       {/* 1. Upper Metric Cards */}
// //       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
// //         <DashboardCard 
// //           title="Total loan portfolio" 
// //           data="₹ 802 Cr." 
// //           icon={<LucideCircleDollarSign className="w-5 h-5" />} 
// //           trend={{ value: "+14.2%", isPositive: true }}
// //         />
// //         <DashboardCard 
// //           title="Active Accounts" 
// //           data="1,234" 
// //           icon={<Landmark className="w-5 h-5" />} 
// //           trend={{ value: "+8.1%", isPositive: true }}
// //         />
// //         <DashboardCard 
// //           title="Predicted High Risk (12m)" 
// //           data="156" 
// //           icon={<ShieldAlert className="w-5 h-5" />} 
// //           trend={{ value: "Based on 12M Horizon", isPositive: false }} 
// //         />
// //       </div>

// //       {/* 2. Predictive Analytics Section Header */}
// //       <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
// //         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
// //           <div>
// //             <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
// //               <Calendar className="w-5 h-5 text-indigo-600" />
// //               12-Month Risk & Default Forecasting
// //             </h2>
// //             <p className="text-sm text-slate-500">Predictive modeling for forward-looking account risk distributions.</p>
// //           </div>
          
// //           {/* Timeline Filter Segment */}
// //           <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
// //             {(["3m", "6m", "12m"] as const).map((t) => (
// //               <button
// //                 key={t}
// //                 onClick={() => setTimeframe(t)}
// //                 className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all ${
// //                   timeframe === t 
// //                     ? "bg-white text-slate-900 shadow-xs border border-slate-200/50" 
// //                     : "text-slate-600 hover:text-slate-900"
// //                 }`}
// //               >
// //                 Next {t.toUpperCase()}
// //               </button>
// //             ))}
// //           </div>
// //         </div>

// //         {/* 3. Charts Grid */}
// //         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
// //           {/* Line Chart: Risk Categories Count */}
// //           <div className="space-y-2">
// //             <h3 className="text-sm font-medium text-slate-700">Risk Segmentation Count (Forecast)</h3>
// //             <div className="h-[320px] w-full">
// //               <ResponsiveContainer width="100%" height="100%">
// //                 <LineChart data={currentData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
// //                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
// //                   <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} />
// //                   <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
// //                   <Tooltip contentStyle={{ background: "#fff", borderRadius: "8px", border: "1px solid #e2e8f0" }} />
// //                   <Legend verticalAlign="top" height={36} iconType="circle" />
// //                   <Line type="monotone" dataKey="Low" stroke="#10b981" strokeWidth={2.5} dot={false} activeDot={{ r: 6 }} />
// //                   <Line type="monotone" dataKey="Medium" stroke="#f59e0b" strokeWidth={2.5} dot={false} activeDot={{ r: 6 }} />
// //                   <Line type="monotone" dataKey="High" stroke="#ef4444" strokeWidth={2.5} dot={false} activeDot={{ r: 6 }} />
// //                 </LineChart>
// //               </ResponsiveContainer>
// //             </div>
// //           </div>

// //           {/* Bar Chart: Total Default Counts */}
// //           <div className="space-y-2">
// //             <h3 className="text-sm font-medium text-slate-700">Total Account Defaults (Predicted Volume)</h3>
// //             <div className="h-[320px] w-full">
// //               <ResponsiveContainer width="100%" height="100%">
// //                 <BarChart data={currentData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
// //                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
// //                   <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} />
// //                   <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
// //                   <Tooltip contentStyle={{ background: "#fff", borderRadius: "8px", border: "1px solid #e2e8f0" }} />
// //                   <Legend verticalAlign="top" height={36} iconType="circle" />
// //                   <Bar dataKey="Defaults" name="Predicted Defaults" fill="#6366f1" radius={[4, 4, 0, 0]} maxBarSize={50} />
// //                 </BarChart>
// //               </ResponsiveContainer>
// //             </div>
// //           </div>

// //         </div>
// //       </div>

// //     </div>
// //   );
// // }


// import React, { useState } from "react";
// import { DashboardCard } from "@/components/ui/Dashboardcards";
// import { LucideCircleDollarSign, Landmark, ShieldAlert, Calendar } from "lucide-react";
// import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

// // Updated predictive data (Low risk removed)
// const PREDICTIVE_DATA = {
//   "3m": [
//     { month: "Month 1", Medium: 240, High: 56, Defaults: 800 },
//     { month: "Month 2", Medium: 250, High: 62, Defaults: 950 },
//     { month: "Month 3", Medium: 270, High: 70, Defaults: 1100 },
//   ],
//   "6m": [
//     { month: "Month 1", Medium: 240, High: 56, Defaults: 800 },
//     { month: "Month 2", Medium: 250, High: 62, Defaults: 950 },
//     { month: "Month 3", Medium: 270, High: 70, Defaults: 1100 },
//     { month: "Month 4", Medium: 290, High: 85, Defaults: 1300 },
//     { month: "Month 5", Medium: 310, High: 92, Defaults: 1450 },
//     { month: "Month 6", Medium: 330, High: 105, Defaults: 1600 },
//   ],
//   "12m": [
//     { month: "M1", Medium: 240, High: 56, Defaults: 800 },
//     { month: "M2", Medium: 250, High: 62, Defaults: 950 },
//     { month: "M3", Medium: 270, High: 70, Defaults: 1100 },
//     { month: "M4", Medium: 290, High: 85, Defaults: 1300 },
//     { month: "M5", Medium: 310, High: 92, Defaults: 1450 },
//     { month: "M6", Medium: 330, High: 105, Defaults: 1600 },
//     { month: "M7", Medium: 340, High: 110, Defaults: 1750 },
//     { month: "M8", Medium: 350, High: 115, Defaults: 1900 },
//     { month: "M9", Medium: 360, High: 120, Defaults: 2000 },
//     { month: "M10", Medium: 365, High: 130, Defaults: 2150 },
//     { month: "M11", Medium: 370, High: 142, Defaults: 2300 },
//     { month: "M12", Medium: 380, High: 156, Defaults: 2500 },
//   ]
// };

// export default function AnalyticsGrid() {
//   const [timeframe, setTimeframe] = useState<"3m" | "6m" | "12m">("12m");
//   const currentData = PREDICTIVE_DATA[timeframe];

//   return (
//     <div className="w-full p-4 space-y-6 bg-slate-50 min-h-screen">
      
//       {/* 1. Metric Summary Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
//         <DashboardCard 
//           title="Total loan portfolio" 
//           data="₹ 802 Cr." 
//           icon={<LucideCircleDollarSign className="w-5 h-5" />} 
//           trend={{ value: "+14.2%", isPositive: true }}
//         />
//         <DashboardCard 
//           title="Active Accounts" 
//           data="1,234" 
//           icon={<Landmark className="w-5 h-5" />} 
//           trend={{ value: "+8.1%", isPositive: true }}
//         />
//         <DashboardCard 
//           title="Predicted High Risk (12m)" 
//           data="156" 
//           icon={<ShieldAlert className="w-5 h-5" />} 
//           trend={{ value: "Based on 12M Horizon", isPositive: false }} 
//         />
//       </div>

//       {/* 2. Predictive Composed Chart Section */}
//       <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
//           <div>
//             <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
//               <Calendar className="w-5 h-5 text-indigo-600" />
//               12-Month Unified Risk & Default Forecast
//             </h2>
//             <p className="text-sm text-slate-500">Cross-analyzing default volumes alongside high & medium risk projections.</p>
//           </div>
          
//           {/* Timeline Selector */}
//           <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
//             {(["3m", "6m", "12m"] as const).map((t) => (
//               <button
//                 key={t}
//                 onClick={() => setTimeframe(t)}
//                 className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all ${
//                   timeframe === t 
//                     ? "bg-white text-slate-900 shadow-xs border border-slate-200/50" 
//                     : "text-slate-600 hover:text-slate-900"
//                 }`}
//               >
//                 Next {t.toUpperCase()}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* 3. Composed Chart Area */}
//         <div className="space-y-2">
//           <div className="h-[400px] w-full">
//             <ResponsiveContainer width="100%" height="100%">
//               <ComposedChart data={currentData} margin={{ top: 20, right: -10, left: -10, bottom: 0 }}>
//                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
//                 <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} />
                
//                 {/* Left Y-Axis for the Bar Volume (Defaults) */}
//                 <YAxis yAxisId="left" stroke="#6366f1" fontSize={12} tickLine={false} label={{ value: 'Default Volume', angle: -90, position: 'insideLeft', style: {textAnchor: 'middle', fill: '#6366f1', fontSize: 11} }} />
                
//                 {/* Right Y-Axis for Line Segmentation (Risk Counts) */}
//                 <YAxis yAxisId="right" orientation="right" stroke="#f59e0b" fontSize={12} tickLine={false} label={{ value: 'Risk Tier Count', angle: 90, position: 'insideRight', style: {textAnchor: 'middle', fill: '#f59e0b', fontSize: 11} }} />
                
//                 <Tooltip contentStyle={{ background: "#fff", borderRadius: "8px", border: "1px solid #e2e8f0" }} />
//                 <Legend verticalAlign="top" height={40} iconType="circle" />
                
//                 {/* Bar element uses left axis */}
//                 <Bar yAxisId="left" dataKey="Defaults" name="Predicted Defaults" fill="#e0e7ff" stroke="#6366f1" strokeWidth={1} radius={[4, 4, 0, 0]} maxBarSize={60} />
                
//                 {/* Line elements use right axis */}
//                 <Line yAxisId="right" type="monotone" dataKey="Medium" name="Medium Risk" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 6 }} />
//                 <Line yAxisId="right" type="monotone" dataKey="High" name="High Risk" stroke="#ef4444" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 6 }} />
//               </ComposedChart>
//             </ResponsiveContainer>
//           </div>
//         </div>
//       </div>

//     </div>
//   );
// }

// import React, { useState } from "react";
// import { DashboardCard } from "@/components/ui/Dashboardcards";
// import { LucideCircleDollarSign, Landmark, ShieldAlert, Calendar } from "lucide-react";
// import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

// const PREDICTIVE_DATA = {
//   "3m": [
//     { month: "Month 1", Medium: 240, High: 56, Defaults: 800 },
//     { month: "Month 2", Medium: 250, High: 62, Defaults: 950 },
//     { month: "Month 3", Medium: 270, High: 70, Defaults: 1100 },
//   ],
//   "6m": [
//     { month: "Month 1", Medium: 240, High: 56, Defaults: 800 },
//     { month: "Month 2", Medium: 250, High: 62, Defaults: 950 },
//     { month: "Month 3", Medium: 270, High: 70, Defaults: 1100 },
//     { month: "Month 4", Medium: 290, High: 85, Defaults: 1300 },
//     { month: "Month 5", Medium: 310, High: 92, Defaults: 1450 },
//     { month: "Month 6", Medium: 330, High: 105, Defaults: 1600 },
//   ],
//   "12m": [
//     { month: "M1", Medium: 240, High: 56, Defaults: 800 },
//     { month: "M2", Medium: 250, High: 62, Defaults: 950 },
//     { month: "M3", Medium: 270, High: 70, Defaults: 1100 },
//     { month: "M4", Medium: 290, High: 85, Defaults: 1300 },
//     { month: "M5", Medium: 310, High: 92, Defaults: 1450 },
//     { month: "M6", Medium: 330, High: 105, Defaults: 1600 },
//     { month: "M7", Medium: 340, High: 110, Defaults: 1750 },
//     { month: "M8", Medium: 350, High: 115, Defaults: 1900 },
//     { month: "M9", Medium: 360, High: 120, Defaults: 2000 },
//     { month: "M10", Medium: 365, High: 130, Defaults: 2150 },
//     { month: "M11", Medium: 370, High: 142, Defaults: 2300 },
//     { month: "M12", Medium: 380, High: 156, Defaults: 2500 },
//   ]
// };

// export default function AnalyticsGrid() {
//   const [timeframe, setTimeframe] = useState<"3m" | "6m" | "12m">("12m");
//   const currentData = PREDICTIVE_DATA[timeframe];

//   return (
//     <div className="w-full p-4 space-y-6 bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors duration-200">
      
//       {/* 1. Metric Summary Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
//         <DashboardCard 
//           title="Total loan portfolio" 
//           data="₹ 802 Cr." 
//           icon={<LucideCircleDollarSign className="w-5 h-5 text-slate-500 dark:text-slate-400" />} 
//           trend={{ value: "+14.2%", isPositive: true }}
//         />
//         <DashboardCard 
//           title="Active Accounts" 
//           data="1,234" 
//           icon={<Landmark className="w-5 h-5 text-slate-500 dark:text-slate-400" />} 
//           trend={{ value: "+8.1%", isPositive: true }}
//         />
//         <DashboardCard 
//           title="Predicted High Risk (12m)" 
//           data="156" 
//           icon={<ShieldAlert className="w-5 h-5 text-red-500" />} 
//           trend={{ value: "Based on 12M Horizon", isPositive: false }} 
//         />
//       </div>

//       {/* 2. Predictive Composed Chart Section Container */}
//       <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 transition-colors duration-200">
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
//           <div>
//             <div className="text-lg font-semibold text-slate-900 dark:text-slate-400 flex items-center gap-2">
//               <Calendar className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
//               Unified Risk & Default Forecast
//             </div>
//             <p className="text-sm text-slate-500 dark:text-slate-400">Cross-analyzing default volumes alongside high & medium risk projections.</p>
//           </div>
          
//           {/* Timeframe Selector with Dark Mode Tokens */}
//           <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
//             {(["3m", "6m", "12m"] as const).map((t) => (
//               <button
//                 key={t}
//                 onClick={() => setTimeframe(t)}
//                 className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all ${
//                   timeframe === t 
//                     ? "bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50 shadow-xs border border-slate-200/50 dark:border-slate-800" 
//                     : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
//                 }`}
//               >
//                 Next {t.toUpperCase()}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* 3. Composed Chart Area */}
//         <div className="space-y-2">
//           <div className="h-[400px] w-full">
//             <ResponsiveContainer width="100%" height="100%">
//               <ComposedChart data={currentData} margin={{ top: 20, right: -10, left: -10, bottom: 0 }}>
//                 {/* CSS variables are used for line colors to sync with tailwind dark theme configurations seamlessly */}
//                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-slate-200 dark:text-slate-800" />
//                 <XAxis dataKey="month" stroke="currentColor" className="text-slate-400 dark:text-slate-500" fontSize={12} tickLine={false} />
                
//                 {/* Left Y-Axis for the Bar Volume (Defaults) */}
//                 <YAxis yAxisId="left" stroke="#6366f1" fontSize={12} tickLine={false} label={{ value: 'Default Volume', angle: -90, position: 'insideLeft', style: {textAnchor: 'middle', fill: '#6366f1', fontSize: 11} }} />
                
//                 {/* Right Y-Axis for Line Segmentation (Risk Counts) */}
//                 <YAxis yAxisId="right" orientation="right" stroke="#f59e0b" fontSize={12} tickLine={false} label={{ value: 'Risk Tier Count', angle: 90, position: 'insideRight', style: {textAnchor: 'middle', fill: '#f59e0b', fontSize: 11} }} />
                
//                 {/* Tooltip Wrapper utilizing Tailwind Classes to ensure perfect background syncing */}
//                 <Tooltip 
//                   contentStyle={{ borderRadius: "8px" }}
//                   // className="!bg-white dark:!bg-slate-950 !border-slate-200 dark:!border-slate-800 !text-slate-900 dark:!text-slate-50 shadow-md"
//                 />
                
//                 <Legend verticalAlign="top" height={40} iconType="circle" wrapperStyle={{ color: "currentColor" }} className="text-slate-700 dark:text-slate-300" />
                
//                 {/* Bar Element uses a muted transparent background shift for dark mode */}
//                 <Bar yAxisId="left" dataKey="Defaults" name="Predicted Defaults" className="fill-indigo-100/70 dark:fill-indigo-950/40 stroke-indigo-500 dark:stroke-indigo-400" strokeWidth={1} radius={[4, 4, 0, 0]} maxBarSize={60} />
                
//                 {/* Line elements maintain high visibility semantic colors */}
//                 <Line yAxisId="right" type="monotone" dataKey="Medium" name="Medium Risk" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 6 }} />
//                 <Line yAxisId="right" type="monotone" dataKey="High" name="High Risk" stroke="#ef4444" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 6 }} />
//               </ComposedChart>
//             </ResponsiveContainer>
//           </div>
//         </div>
//       </div>

//     </div>
//   );
// }

// import React, { useState } from "react";
// import { DashboardCard } from "@/components/ui/Dashboardcards";
// import { LucideCircleDollarSign, Landmark, ShieldAlert, Calendar, TrendingUp } from "lucide-react";
// import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

// const PREDICTIVE_DATA = {
//   "3m": [
//     { month: "Month 1", Medium: 240, High: 56, Defaults: 800 },
//     { month: "Month 2", Medium: 250, High: 62, Defaults: 950 },
//     { month: "Month 3", Medium: 270, High: 70, Defaults: 1100 },
//   ],
//   "6m": [
//     { month: "Month 1", Medium: 240, High: 56, Defaults: 800 },
//     { month: "Month 2", Medium: 250, High: 62, Defaults: 950 },
//     { month: "Month 3", Medium: 270, High: 70, Defaults: 1100 },
//     { month: "Month 4", Medium: 290, High: 85, Defaults: 1300 },
//     { month: "Month 5", Medium: 310, High: 92, Defaults: 1450 },
//     { month: "Month 6", Medium: 330, High: 105, Defaults: 1600 },
//   ],
//   "12m": [
//     { month: "M1", Medium: 240, High: 56, Defaults: 800 },
//     { month: "M2", Medium: 250, High: 62, Defaults: 950 },
//     { month: "M3", Medium: 270, High: 70, Defaults: 1100 },
//     { month: "M4", Medium: 290, High: 85, Defaults: 1300 },
//     { month: "M5", Medium: 310, High: 92, Defaults: 1450 },
//     { month: "M6", Medium: 330, High: 105, Defaults: 1600 },
//     { month: "M7", Medium: 340, High: 110, Defaults: 1750 },
//     { month: "M8", Medium: 350, High: 115, Defaults: 1900 },
//     { month: "M9", Medium: 360, High: 120, Defaults: 2000 },
//     { month: "M10", Medium: 365, High: 130, Defaults: 2150 },
//     { month: "M11", Medium: 370, High: 142, Defaults: 2300 },
//     { month: "M12", Medium: 380, High: 156, Defaults: 2500 },
//   ]
// };

// // Premium Custom Glassmorphic Tooltip Component
// const CustomTooltip = ({ active, payload, label }: any) => {
//   if (active && payload && payload.length) {
//     return (
//       <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/50 p-4 rounded-xl shadow-xl space-y-2.5 min-w-[200px]">
//         <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-1.5">
//           <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">{label} Forecast</span>
//           <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
//         </div>
//         <div className="space-y-1.5">
//           {payload.map((item: any, idx: number) => (
//             <div key={idx} className="flex items-center justify-between gap-4 text-xs">
//               <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
//                 <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.stroke || item.fill }} />
//                 <span>{item.name}:</span>
//               </div>
//               <span className="font-semibold text-slate-900 dark:text-slate-50">
//                 {typeof item.value === 'number' && item.name.includes("Volume") || item.name.includes("Defaults")
//                   ? `₹${item.value}` 
//                   : item.value.toLocaleString()}
//               </span>
//             </div>
//           ))}
//         </div>
//       </div>
//     );
//   }
//   return null;
// };

// export default function AnalyticsGrid() {
//   const [timeframe, setTimeframe] = useState<"3m" | "6m" | "12m">("12m");
//   const currentData = PREDICTIVE_DATA[timeframe];

//   return (
//     <div className="w-full p-6 space-y-8 bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors duration-300">
      
//       {/* 1. Metric Summary Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
//         <DashboardCard 
//           title="Total loan portfolio" 
//           data="₹ 802 Cr." 
//           icon={<LucideCircleDollarSign className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />} 
//           trend={{ value: "+14.2%", isPositive: true }}
//         />
//         <DashboardCard 
//           title="Active Accounts" 
//           data="1,234" 
//           icon={<Landmark className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />} 
//           trend={{ value: "+8.1%", isPositive: true }}
//         />
//         <DashboardCard 
//           title="Predicted High Risk (12m)" 
//           data="156" 
//           icon={<ShieldAlert className="w-5 h-5 text-rose-500" />} 
//           trend={{ value: "Based on 12M Horizon", isPositive: false }} 
//         />
//       </div>

//       {/* 2. Predictive Composed Chart Section Container */}
//       <div className="bg-white dark:bg-slate-900/60 backdrop-blur-xs p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-6 transition-all duration-300">
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 dark:border-slate-800/60 pb-5">
//           <div className="space-y-1">
//             <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-50 flex items-center gap-2.5">
//               <div className="p-2 bg-indigo-50 dark:bg-indigo-950/50 rounded-lg text-indigo-600 dark:text-indigo-400">
//                 <Calendar className="w-5 h-5" />
//               </div>
//               Predictive Risk & Default Engine
//             </h2>
//             <p className="text-xs text-slate-500 dark:text-slate-400">Advanced 12-month forward predictive tracking of risk distribution vectors.</p>
//           </div>
          
//           {/* Timeline Filter Pills */}
//           <div className="flex items-center bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200/60 dark:border-slate-700/60 self-end sm:self-center">
//             {(["3m", "6m", "12m"] as const).map((t) => (
//               <button
//                 key={t}
//                 onClick={() => setTimeframe(t)}
//                 className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 ${
//                   timeframe === t 
//                     ? "bg-white dark:bg-slate-950 text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-200/30 dark:border-slate-800" 
//                     : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
//                 }`}
//               >
//                 Next {t.toUpperCase()}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* 3. Composed Chart Area */}
//         <div className="w-full pt-2">
//           <div className="h-[420px] w-full">
//             <ResponsiveContainer width="100%" height="100%">
//               <ComposedChart data={currentData} margin={{ top: 15, right: -5, left: -5, bottom: 5 }}>
                
//                 {/* Vector Layout Definitions for Gradients */}
//                 <defs>
//                   <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
//                     <stop offset="0%" stopColor="#818cf8" stopOpacity={0.25} />
//                     <stop offset="100%" stopColor="#c7d2fe" stopOpacity={0.02} />
//                   </linearGradient>
//                   <linearGradient id="barGradientDark" x1="0" y1="0" x2="0" y2="1">
//                     <stop offset="0%" stopColor="#4f46e5" stopOpacity={0.35} />
//                     <stop offset="100%" stopColor="#312e81" stopOpacity={0.00} />
//                   </linearGradient>
//                 </defs>

//                 <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="currentColor" className="text-slate-200/70 dark:text-slate-800/50" />
//                 <XAxis dataKey="month" stroke="currentColor" className="text-slate-400 dark:text-slate-500" fontSize={11} fontWeight={500} tickLine={false} dy={10} />
                
//                 {/* Left Y-Axis for the Bar Volume (Defaults) */}
//                 <YAxis yAxisId="left" stroke="#6366f1" fontSize={11} fontWeight={500} tickLine={false} dx={-10} label={{ value: 'PREDICTED DEFAULTS VOLUME', angle: -90, position: 'insideLeft', style: {textAnchor: 'middle', fill: '#6366f1', fontSize: 10, fontWeight: 600, letterSpacing: '0.05em'} }} />
                
//                 {/* Right Y-Axis for Line Segmentation (Risk Counts) */}
//                 <YAxis yAxisId="right" orientation="right" stroke="#f59e0b" fontSize={11} fontWeight={500} tickLine={false} dx={10} label={{ value: 'RISK SEGMENT ACCOUNT COUNT', angle: 90, position: 'insideRight', style: {textAnchor: 'middle', fill: '#f59e0b', fontSize: 10, fontWeight: 600, letterSpacing: '0.05em'} }} />
                
//                 {/* Custom Interactive Tooltip Element Injection */}
//                 <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'currentColor', strokeWidth: 1, strokeDasharray: '4 4', className: 'text-slate-200 dark:text-slate-800' }} />
                
//                 <Legend verticalAlign="top" height={45} iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px', fontWeight: 500, paddingBottom: '15px' }} className="text-slate-600 dark:text-slate-300" />
                
//                 {/* Upgraded Bar Element with custom gradient layers */}
//                 <Bar yAxisId="left" dataKey="Defaults" name="Predicted Account Defaults" className="fill-[url(#barGradient)] dark:fill-[url(#barGradientDark)] stroke-indigo-400/60 dark:stroke-indigo-500/40" strokeWidth={1.5} radius={[6, 6, 0, 0]} maxBarSize={55} />
                
//                 {/* Line vectors with smoothed transitions, cleaner active anchors and elevated stroke weights */}
//                 <Line yAxisId="right" type="monotone" dataKey="Medium" name="Medium Risk Accounts" stroke="#f59e0b" strokeWidth={3} dot={false} activeDot={{ r: 5, stroke: '#fff', strokeWidth: 2 }} />
//                 <Line yAxisId="right" type="monotone" dataKey="High" name="High Risk Accounts" stroke="#rose-500" className="stroke-rose-500 dark:stroke-rose-400" strokeWidth={3} dot={false} activeDot={{ r: 5, stroke: '#fff', strokeWidth: 2 }} />
//               </ComposedChart>
//             </ResponsiveContainer>
//           </div>
//         </div>
//       </div>

//     </div>
//   );
// }


import React, { useState } from "react";
import { DashboardCard } from "@/components/ui/Dashboardcards";
import { LucideCircleDollarSign, Landmark, ShieldAlert, Calendar, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const PREDICTIVE_DATA = {
  "3m": [
    { month: "Month 1", Medium: 240, High: 56, Defaults: 800, NetChange: "+4.2%" },
    { month: "Month 2", Medium: 250, High: 62, Defaults: 950, NetChange: "+6.1%" },
    { month: "Month 3", Medium: 270, High: 70, Defaults: 1100, NetChange: "+8.3%" },
  ],
  "6m": [
    { month: "Month 1", Medium: 240, High: 56, Defaults: 800, NetChange: "+4.2%" },
    { month: "Month 2", Medium: 250, High: 62, Defaults: 950, NetChange: "+6.1%" },
    { month: "Month 3", Medium: 270, High: 70, Defaults: 1100, NetChange: "+8.3%" },
    { month: "Month 4", Medium: 290, High: 85, Defaults: 1300, NetChange: "+5.0%" },
    { month: "Month 5", Medium: 310, High: 92, Defaults: 1450, NetChange: "+3.8%" },
    { month: "Month 6", Medium: 330, High: 105, Defaults: 1600, NetChange: "+7.2%" },
  ],
  "12m": [
    { month: "M1", Medium: 240, High: 56, Defaults: 800, NetChange: "+4.2%" },
    { month: "M2", Medium: 250, High: 62, Defaults: 950, NetChange: "+6.1%" },
    { month: "M3", Medium: 270, High: 70, Defaults: 1100, NetChange: "+8.3%" },
    { month: "M4", Medium: 290, High: 85, Defaults: 1300, NetChange: "+5.0%" },
    { month: "M5", Medium: 310, High: 92, Defaults: 1450, NetChange: "+3.8%" },
    { month: "M6", Medium: 260, High: 105, Defaults: 1600, NetChange: "+7.2%" },
    { month: "M7", Medium: 340, High: 110, Defaults: 1750, NetChange: "+2.1%" },
    { month: "M8", Medium: 350, High: 115, Defaults: 1900, NetChange: "+1.9%" },
    { month: "M9", Medium: 360, High: 120, Defaults: 2000, NetChange: "+0.8%" },
    { month: "M10", Medium: 365, High: 130, Defaults: 2150, NetChange: "+4.1%" },
    { month: "M11", Medium: 370, High: 142, Defaults: 2300, NetChange: "+5.5%" },
    { month: "M12", Medium: 380, High: 156, Defaults: 2500, NetChange: "+6.8%" },
  ]
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/50 p-4 rounded-xl shadow-xl space-y-2.5 min-w-[200px]">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-1.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">{label} Forecast</span>
          <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
        </div>
        <div className="space-y-1.5">
          {payload.map((item: any, idx: number) => (
            <div key={idx} className="flex items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.stroke || item.fill }} />
                <span>{item.name}:</span>
              </div>
              <span className="font-semibold text-slate-900 dark:text-slate-50">
                {item.value.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export default function AnalyticsGrid() {
  const [timeframe, setTimeframe] = useState<"3m" | "6m" | "12m">("12m");
  const currentData = PREDICTIVE_DATA[timeframe];

  return (
    <div className="w-full p-6 space-y-8 bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors duration-300">
      
      {/* 1. Metric Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        <DashboardCard 
          title="Total loan portfolio" 
          data="₹ 802 Cr." 
          icon={<LucideCircleDollarSign className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />} 
          trend={{ value: "+14.2%", isPositive: true }}
        />
        <DashboardCard 
          title="Active Accounts" 
          data="1,234" 
          icon={<Landmark className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />} 
          trend={{ value: "+8.1%", isPositive: true }}
        />
        <DashboardCard 
          title="Predicted High Risk (12m)" 
          data="156" 
          icon={<ShieldAlert className="w-5 h-5 text-rose-500" />} 
          trend={{ value: "Based on 12M Horizon", isPositive: false }} 
        />
      </div>

      {/* 2. Predictive Composed Chart Section Container */}
      <div className="bg-white dark:bg-slate-900/60 backdrop-blur-xs p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-6 transition-all duration-300">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 dark:border-slate-800/60 pb-5">
          <div className="space-y-1">
            <div className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-50 flex items-center gap-2.5">
              <div className="p-2 bg-indigo-50 dark:bg-indigo-950/50 rounded-lg text-indigo-600 dark:text-indigo-400">
                <Calendar className="w-5 h-5" />
              </div>
              Predictive Risk & Default Engine
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Advanced 12-month forward predictive tracking of risk distribution vectors.</p>
          </div>
          
          {/* Timeline Filter Pills */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200/60 dark:border-slate-700/60 self-end sm:self-center">
            {(["3m", "6m", "12m"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTimeframe(t)}
                className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 ${
                  timeframe === t 
                    ? "bg-white dark:bg-slate-950 text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-200/30 dark:border-slate-800" 
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
                }`}
              >
                Next {t.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Chart Component Area */}
        <div className="w-full pt-2">
          <div className="h-[380px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={currentData} margin={{ top: 15, right: -5, left: -5, bottom: 5 }}>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#818cf8" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#c7d2fe" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="barGradientDark" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4f46e5" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#312e81" stopOpacity={0.00} />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="currentColor" className="text-slate-200/70 dark:text-slate-800/50" />
                <XAxis dataKey="month" stroke="currentColor" className="text-slate-400 dark:text-slate-500" fontSize={11} fontWeight={500} tickLine={false} dy={10} />
                <YAxis yAxisId="left" stroke="#6366f1" fontSize={11} fontWeight={500} tickLine={false} dx={-10} label={{ value: 'PREDICTED DEFAULTS VOLUME', angle: -90, position: 'insideLeft', style: {textAnchor: 'middle', fill: '#6366f1', fontSize: 10, fontWeight: 600, letterSpacing: '0.05em'} }} />
                <YAxis yAxisId="right" orientation="right" stroke="#f59e0b" fontSize={11} fontWeight={500} tickLine={false} dx={10} label={{ value: 'RISK SEGMENT ACCOUNT COUNT', angle: 90, position: 'insideRight', style: {textAnchor: 'middle', fill: '#f59e0b', fontSize: 10, fontWeight: 600, letterSpacing: '0.05em'} }} />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'currentColor', strokeWidth: 1, strokeDasharray: '4 4', className: 'text-slate-200 dark:text-slate-800' }} />
                <Legend verticalAlign="top" height={45} iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px', fontWeight: 500, paddingBottom: '15px' }} className="text-slate-600 dark:text-slate-300" />
                
                <Bar yAxisId="left" dataKey="Defaults" name="Predicted Account Defaults" className="fill-[url(#barGradient)] dark:fill-[url(#barGradientDark)] stroke-indigo-400/60 dark:stroke-indigo-500/40" strokeWidth={1.5} radius={[6, 6, 0, 0]} maxBarSize={55} />
                <Line yAxisId="right" type="monotone" dataKey="Medium" name="Medium Risk Accounts" stroke="#f59e0b" strokeWidth={3} dot={false} activeDot={{ r: 5, stroke: '#fff', strokeWidth: 2 }} />
                <Line yAxisId="right" type="monotone" dataKey="High" name="High Risk Accounts" stroke="#ef4444" strokeWidth={3} dot={false} activeDot={{ r: 5, stroke: '#fff', strokeWidth: 2 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 3. New Upgraded Financial Data Grid Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs rounded-2xl overflow-hidden transition-all duration-300">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-50">Forecast Breakdown Matrix</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Granular month-on-month predictive segment data sheets.</p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 uppercase tracking-wider">
            {timeframe} Window active
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 dark:bg-slate-800/40 text-xs font-semibold tracking-wider text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800">
                <th className="py-3.5 px-6">Timeline Target</th>
                <th className="py-3.5 px-6 text-right">Predicted Defaults (Vol)</th>
                <th className="py-3.5 px-6 text-right">Medium Risk Tier</th>
                <th className="py-3.5 px-6 text-right">High Risk Tier</th>
                <th className="py-3.5 px-6 text-right">MoM Growth Target</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-sm text-slate-700 dark:text-slate-300">
              {currentData.map((row, index) => (
                <tr 
                  key={index} 
                  className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors duration-150 group"
                >
                  <td className="py-3.5 px-6 font-medium text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {row.month}
                  </td>
                  <td className="py-3.5 px-6 text-right font-semibold tabular-nums text-slate-900 dark:text-slate-100">
                    {row.Defaults.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-6 text-right tabular-nums">
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 font-medium text-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      {row.Medium}
                    </span>
                  </td>
                  <td className="py-3.5 px-6 text-right tabular-nums">
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 font-medium text-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                      {row.High}
                    </span>
                  </td>
                  <td className="py-3.5 px-6 text-right tabular-nums">
                    <span className="inline-flex items-center justify-end gap-1 font-medium text-xs text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/20 px-2 py-0.5 rounded-md">
                      <ArrowUpRight className="w-3 h-3" />
                      {row.NetChange}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}