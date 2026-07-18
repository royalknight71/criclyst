import { NavLink } from "react-router-dom";
import logo from "../../assets/Criclyst_LOGO.png";

function Navbar() {
  const navLinkClass = ({ isActive }) =>
  `text-[21px] font-medium transition-all duration-300 ${
    isActive
      ? "text-cyan-400 border-b-2 border-cyan-400 pb-1"
      : "text-white hover:text-cyan-400"
  }`;
  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-12 py-6 bg-slate-900 shadow-lg">
        <div className="flex items-center">
          <NavLink to="/" className="flex items-center gap-3">
    <img
        src={logo}
        alt="Criclyst Logo"
        className="h-14 w-auto"
    />

    <span className="text-3xl font-bold text-white">
        Criclyst
    </span>
</NavLink>
        </div>

      <div className="flex items-center gap-11">
        <NavLink
          to="/"
         className={navLinkClass}
        >
          Home
        </NavLink>
        
         <NavLink
          to="/players"
         className={navLinkClass}
        >
          Players
        </NavLink>

         <NavLink
          to="/teams"
         className={navLinkClass}
        >
          Teams
        </NavLink>
        
         <NavLink
          to="/matches"
       className={navLinkClass}
        >
          Matches
        </NavLink>

         <NavLink
          to="/compare"
          className={navLinkClass}
        >
          Compare
        </NavLink>

          <NavLink
          to="/analytics"
          className={navLinkClass}
        >
          Analytics
        </NavLink>

      </div>

      <div className="flex items-center">
         <NavLink
              to="/login"
              className="rounded-lg border border-cyan-400 px-5 py-2 font-medium text-cyan-400 transition-all duration-300 hover:bg-cyan-400 hover:text-slate-900"
            >
              Login
            </NavLink>
      </div>
    </nav>
  );
}

export default Navbar;