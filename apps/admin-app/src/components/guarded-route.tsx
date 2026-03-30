import type { ReactElement } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/auth-context";

export function GuardedRoute({ children }: { children: ReactElement }) {
  const { ready, user } = useAuth();

  if (!ready) {
    return <div className="page-shell"><p>불러오는 중...</p></div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
