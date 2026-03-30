import React from "react";
import { apiRequest } from "../api/client";
import { clearStoredToken, getStoredToken, setStoredToken } from "../lib/storage";
import type { AuthUser } from "../types/api";

type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  ready: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, confirmPassword: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = React.createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<AuthUser | null>(null);
  const [token, setToken] = React.useState<string | null>(getStoredToken());
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    const existing = getStoredToken();
    if (!existing) {
      setReady(true);
      return;
    }

    apiRequest<{ user: AuthUser }>("/api/auth/me")
      .then((data) => {
        setUser(data.user);
        setToken(existing);
      })
      .catch(() => {
        clearStoredToken();
        setUser(null);
        setToken(null);
      })
      .finally(() => setReady(true));
  }, []);

  const login = React.useCallback(async (email: string, password: string) => {
    const data = await apiRequest<{ token: string; user: AuthUser }>("/api/auth/login", {
      method: "POST",
      auth: false,
      body: { email, password }
    });
    setStoredToken(data.token);
    setToken(data.token);
    setUser(data.user);
  }, []);

  const signup = React.useCallback(async (email: string, password: string, confirmPassword: string) => {
    const data = await apiRequest<{ token: string; user: AuthUser }>("/api/auth/signup", {
      method: "POST",
      auth: false,
      body: { email, password, confirmPassword }
    });
    setStoredToken(data.token);
    setToken(data.token);
    setUser(data.user);
  }, []);

  const logout = React.useCallback(() => {
    clearStoredToken();
    setUser(null);
    setToken(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, ready, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
