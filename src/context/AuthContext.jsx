import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => window.localStorage.getItem("token"));
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(Boolean(token));

  useEffect(() => {
    if (!token) {
      setAdmin(null);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    api
      .me()
      .then((data) => {
        if (!cancelled) {
          setAdmin(data);
        }
      })
      .catch(() => {
        window.localStorage.removeItem("token");
        if (!cancelled) {
          setToken(null);
          setAdmin(null);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [token]);

  const value = useMemo(
    () => ({
      token,
      admin,
      loading,
      isAuthenticated: Boolean(token && admin),
      async login(credentials) {
        const response = await api.login(credentials);
        window.localStorage.setItem("token", response.token);
        setToken(response.token);
        setAdmin(response.admin);
        return response.admin;
      },
      logout() {
        window.localStorage.removeItem("token");
        setToken(null);
        setAdmin(null);
      },
    }),
    [admin, loading, token],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}