import { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import NotificationBell from "../notification/NotificationBell";
import logo from "../../assets/Criclyst_LOGO.png";

const navigationLinks = [
  { to: "/", label: "Home" },
  { to: "/players", label: "Players" },
  { to: "/teams", label: "Teams" },
  { to: "/matches", label: "Matches" },
  { to: "/live-scores", label: "Live" },
  { to: "/compare", label: "Compare" },
  { to: "/analytics", label: "Analytics" },
];

const desktopNavLinkClass = ({ isActive }) =>
  `text-[21px] font-medium transition-all duration-300 ${
    isActive
      ? "text-cyan-400 border-b-2 border-cyan-400 pb-1"
      : "text-white hover:text-cyan-400"
  }`;

const mobileNavLinkClass = ({ isActive }) =>
  `flex min-h-11 items-center rounded-lg border-l-2 px-4 py-2 text-base font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300 focus-visible:outline-offset-2 ${
    isActive
      ? "border-cyan-400 bg-cyan-400/10 text-cyan-300"
      : "border-transparent text-white hover:bg-slate-800 hover:text-cyan-300"
  }`;

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navbarRef = useRef(null);
  const menuButtonRef = useRef(null);

  const handleLogout = async () => {
    setMobileMenuOpen(false);
    await logout();
    navigate("/login");
  };

  useEffect(() => {
    if (!mobileMenuOpen) return undefined;

    const handlePointerDown = (event) => {
      if (!navbarRef.current?.contains(event.target)) {
        setMobileMenuOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setMobileMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileMenuOpen]);

  const links = [
    ...navigationLinks,
    ...(user?.role === "admin" ? [{ to: "/admin", label: "Admin" }] : []),
    ...(user ? [{ to: "/favorites", label: "Favorites" }] : []),
  ];
  const desktopLinkSpacing = user
    ? "gap-4 min-[1440px]:gap-7 min-[1600px]:gap-11"
    : "gap-11";

  return (
    <nav
      ref={navbarRef}
      aria-label="Primary navigation"
      className="sticky top-0 z-50 bg-slate-900 px-4 py-3 shadow-lg min-[1366px]:flex min-[1366px]:items-center min-[1366px]:justify-between min-[1366px]:px-12 min-[1366px]:py-6"
    >
      <div className="flex min-w-0 items-center justify-between gap-3 min-[1366px]:contents">
        <NavLink to="/" className="flex min-w-0 items-center gap-3 min-[1366px]:shrink-0">
          <img src={logo} alt="Criclyst Logo" className="h-14 w-auto shrink-0" />
          <span className="truncate text-3xl font-bold text-white min-[1366px]:shrink-0">Criclyst</span>
        </NavLink>

        <div className={`hidden items-center ${desktopLinkSpacing} min-[1366px]:flex`}>
          {links.map(({ to, label }) => (
            <NavLink key={to} to={to} className={desktopNavLinkClass}>
              {label}
            </NavLink>
          ))}
        </div>

        <div className="flex shrink-0 items-center gap-4">
          <button
            ref={menuButtonRef}
            type="button"
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-primary-navigation"
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="flex h-11 w-11 items-center justify-center rounded-lg text-slate-200 transition-colors hover:bg-slate-800 hover:text-cyan-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300 focus-visible:outline-offset-2 min-[1366px]:hidden"
          >
            <span className="flex w-6 flex-col gap-1.5" aria-hidden="true">
              <span className="h-0.5 w-full rounded bg-current" />
              <span className="h-0.5 w-full rounded bg-current" />
              <span className="h-0.5 w-full rounded bg-current" />
            </span>
          </button>
          {user && <NotificationBell />}

          <div className="hidden items-center gap-4 min-[1366px]:flex">
            {user ? (
              <>
                <span className="max-w-40 truncate text-sm text-slate-300">{user.name}</span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-lg border border-slate-600 px-5 py-2 font-medium text-slate-300 transition-all duration-300 hover:border-red-400 hover:text-red-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300 focus-visible:outline-offset-2"
                >
                  Logout
                </button>
              </>
            ) : (
              <NavLink
                to="/login"
                className="rounded-lg border border-cyan-400 px-5 py-2 font-medium text-cyan-400 transition-all duration-300 hover:bg-cyan-400 hover:text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300 focus-visible:outline-offset-2"
              >
                Login
              </NavLink>
            )}
          </div>
        </div>
      </div>

      <div
        id="mobile-primary-navigation"
        className={`absolute left-0 right-0 top-full max-h-[calc(100dvh-5rem)] overflow-y-auto border-t border-slate-700 bg-slate-900 px-4 pb-4 pt-3 shadow-xl min-[1366px]:hidden ${
          mobileMenuOpen ? "block" : "hidden"
        }`}
      >
        <div className="mx-auto w-full max-w-xl">
          <div className="grid gap-1">
            {links.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={mobileNavLinkClass}
                onClick={() => setMobileMenuOpen(false)}
              >
                {label}
              </NavLink>
            ))}
          </div>

          <div className="mt-3 border-t border-slate-700 pt-3">
            {user ? (
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="min-w-0 flex-1 truncate px-1 text-sm text-slate-300">
                  {user.name}
                </span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="min-h-11 rounded-lg border border-slate-600 px-4 py-2 font-medium text-slate-200 transition-colors hover:border-red-400 hover:text-red-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300 focus-visible:outline-offset-2"
                >
                  Logout
                </button>
              </div>
            ) : (
              <NavLink
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex min-h-11 items-center justify-center rounded-lg border border-cyan-400 px-4 py-2 font-medium text-cyan-300 transition-colors hover:bg-cyan-400 hover:text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300 focus-visible:outline-offset-2"
              >
                Login
              </NavLink>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
