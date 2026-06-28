import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="w-64 h-screen bg-gray-900 text-white">
      <div className="flex">
        <div className="text-start text-[16px] pl-2 pr-0 py-4">
          logo
          </div>
      <div className="text-start text-[16px] mb-8 px-3 py-4">ForeSight</div>
        </div>

      <nav className="flex flex-col text-[14px] gap-3">
        <NavLink to="/dashboard">Dashboard</NavLink>
        <NavLink to="/profile">Profile</NavLink>
        <NavLink to="/company">Company</NavLink>
        <NavLink to="/individual">Individual</NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;