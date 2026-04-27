import { createContext, useContext, useEffect, useMemo, useState } from "react";
import apiClient from "../services/apiClient";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bootstrap = async () => {
      const token = localStorage.getItem("steya_token");
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await apiClient.get("/auth/me");
        setUser(data);
      } catch {
        localStorage.removeItem("steya_token");
      } finally {
        setLoading(false);
      }
    };
    bootstrap();
  }, []);

  const login = (token, profile) => {
    localStorage.setItem("steya_token", token);
    setUser(profile);
  };

  const logout = () => {
    localStorage.removeItem("steya_token");
    setUser(null);
  };

  const value = useMemo(() => ({ user, loading, login, logout }), [user, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}