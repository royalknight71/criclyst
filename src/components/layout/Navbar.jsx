import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/Criclyst_LOGO.png";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navLinkClass = ({ isActive }) =>
  `text-[21px] font-medium transition-all duration-300 ${
    isActive
      ? "text-cyan-400 border-b-2 border-cyan-400 pb-1"
      : "text-white hover:text-cyan-400"
  }`;

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

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

          {user?.role === "admin" && (
            <NavLink to="/admin" className={navLinkClass}>
              Admin
            </NavLink>
          )}

          {user && (
            <NavLink to="/favorites" className={navLinkClass}>
              Favorites
            </NavLink>
          )}

      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <>
            <span className="text-sm text-slate-300">
              {user.name}
            </span>
            <button
              onClick={handleLogout}
              className="rounded-lg border border-slate-600 px-5 py-2 font-medium text-slate-300 transition-all duration-300 hover:border-red-400 hover:text-red-400"
            >
              Logout
            </button>
          </>
        ) : (
         <NavLink
              to="/login"
              className="rounded-lg border border-cyan-400 px-5 py-2 font-medium text-cyan-400 transition-all duration-300 hover:bg-cyan-400 hover:text-slate-900"
            >
              Login
            </NavLink>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
