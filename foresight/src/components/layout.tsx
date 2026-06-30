import Sidebar from "./sidebar";
import type { ReactNode } from "react";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-blue-50/80 dark:bg-black">
      <Sidebar />
      <div className="flex-1 h-full overflow-y-auto text-start select-none">
        {children}
      </div>
    </div>
  );
};

export default Layout;
