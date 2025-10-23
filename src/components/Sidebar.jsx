import { NavLink } from "react-router-dom";
import ToggleTheme from "../hooks/toggleTheme";
import { House, User, Play, X } from "lucide-react";

const SidebarComponent = ({ visible = true, onClose }) => {
  return (
    <div
      className={`
        fixed top-0 left-0 h-screen w-64 z-50 bg-sky-200 dark:bg-stone-400 dark:text-green-800
        transition-transform duration-300 ease-in-out
        ${visible ? "translate-x-0" : "-translate-x-full"}
        md:relative md:translate-x-0
      `}
    >
      {/* Header */}
      <h1 className="text-blue-900 font-bold text-center py-3 dark:text-green-800 text-2xl relative">
        Sidebar

        {/* Close Button - mobile only */}
        <button
          onClick={onClose}
          className="absolute right-5 top-4 md:hidden text-xl"
        >
          <X size={25}/>
        </button>
      </h1>

      <div className="bg-green-500 h-0.5" />

      {/* Navigation */}
      <nav className="py-2 space-y-1 font-semibold text-xl text-green-800">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex gap-3 px-5 py-2 transition ${
              isActive ? "bg-amber-100 font-semibold" : "hover:bg-amber-100"
            }`
          }
        >
          <House />
          Home
        </NavLink>

        <NavLink
          to="/instructor"
          className={({ isActive }) =>
            `flex gap-3 px-5 py-2  transition ${
              isActive ? "bg-amber-100 font-semibold" : "hover:bg-amber-100"
            }`
          }
        >
          <User />
          Instructor
        </NavLink>

        <NavLink
          to="/course"
          className={({ isActive }) =>
            `flex gap-3 px-5 py-2 transition ${
              isActive ? "bg-amber-100 font-semibold" : "hover:bg-amber-100"
            }`
          }
        >
          <Play />
          Course
        </NavLink>
      </nav>

      <div className="absolute bottom-2 mx-2">
        <ToggleTheme />
      </div>
    </div>
  );
};

export default SidebarComponent;

