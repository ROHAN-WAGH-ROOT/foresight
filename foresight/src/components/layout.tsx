import Sidebar from "./sidebar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-blue-50/80 dark:bg-black">
      <Sidebar />
      <div className="flex-1 h-full overflow-y-auto text-start select-none">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
