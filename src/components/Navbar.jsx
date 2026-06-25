import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
        <div className="criclyst">
            <h1 className="logo">Criclyst</h1>
        </div>

      <div className="nav-links">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? "nav-link active-link" : "nav-link"
          }
        >
          Home
        </NavLink>

        <NavLink
          to="/about"
          className={({ isActive }) =>
            isActive ? "nav-link active-link" : "nav-link"
          }
        >
          About
        </NavLink>
      </div>
    </nav>
  );
}

export default Navbar;