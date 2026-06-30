// import Sidebar from "./sidebar";
// import type { ReactNode } from "react";

// const Layout = ({ children }: { children: ReactNode }) => {
//   return (
//     <div className="flex">
//       <Sidebar />
//       <div className="w-screen text-start min-h-screen bg-blue-50/80 dark:bg-black select-none">
//         {children}
//       </div>
//     </div>
//   );
// };

// export default Layout;

import Sidebar from "./sidebar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    // 1. Force the root container to lock directly to exactly 100vh window height and prevent any main page bleeding
    <div className="flex h-screen w-screen overflow-hidden bg-blue-50/80 dark:bg-black">
      
      {/* Sidebar sits perfectly here, handling its own structural height natively */}
      <Sidebar />
      
      {/* 2. Changed w-screen to flex-1, replaced min-h-screen with h-full, and enabled independent vertical scrolling */}
      <div className="flex-1 h-full overflow-y-auto text-start select-none">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;