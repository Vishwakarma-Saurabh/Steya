import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navStyle = ({ isActive }) =>
    `rounded-md px-3 py-2 transition ${
      isActive ? "bg-blue-100 text-primary" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary font-bold text-white">S</span>
          <span className="text-xl font-bold text-primary">Steya</span>
        </Link>
        <nav className="flex items-center gap-1 text-sm font-medium">
          <NavLink className={navStyle} to="/search">Search</NavLink>
          {user && <NavLink className={navStyle} to="/list-room">List Room</NavLink>}
          {user && <NavLink className={navStyle} to="/matches">Matches</NavLink>}
          {user && <NavLink className={navStyle} to="/dashboard">Dashboard</NavLink>}
          {!user ? (
            <>
              <NavLink className={navStyle} to="/login">Login</NavLink>
              <NavLink to="/register" className="ml-2 rounded-md bg-primary px-4 py-2 text-white shadow-sm transition hover:bg-blue-700">Join Now</NavLink>
            </>
          ) : (
            <div className="ml-2 flex items-center gap-3">
              <div className="hidden rounded-md bg-slate-100 px-3 py-2 text-xs text-slate-600 md:block">
                {user.name}
              </div>
              <button onClick={logout} className="rounded-md border border-slate-300 px-3 py-2 text-slate-600 transition hover:bg-slate-100">
                Logout
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
