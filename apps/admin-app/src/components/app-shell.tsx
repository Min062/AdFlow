import { Link, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/auth-context";

const navItems = [
  { to: "/", label: "대시보드" },
  { to: "/sites", label: "사이트" },
  { to: "/sites/new", label: "사이트 등록" },
  { to: "/ads", label: "광고" },
  { to: "/ads/new", label: "광고 등록" },
  { to: "/reports", label: "리포트" },
  { to: "/sdk", label: "SDK 사용법" },
  { to: "/demo", label: "Demo" }
];

export function AppShell() {
  const { user, logout } = useAuth();

  return (
    <div className="layout">
      <aside className="sidebar">
        <div>
          <div className="brand">AdStream</div>
          <p className="muted">Pause 광고 플레이어 SaaS MVP</p>
        </div>
        <nav className="nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="muted small">{user?.email}</div>
          <button className="button button-ghost full-width" onClick={logout}>
            로그아웃
          </button>
          <Link to="/demo" className="button button-primary full-width">
            Demo 열기
          </Link>
        </div>
      </aside>
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}
