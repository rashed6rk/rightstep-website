"use client";

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import { useLocale } from "next-intl";
import { type AuthUser, getStoredUser, getMe, logout as clearAuth, isLoggedIn } from "./auth";

type AuthState = {
  user: AuthUser | null;
  loading: boolean;
  logout: () => void;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthState>({
  user: null,
  loading: true,
  logout: () => {},
  refresh: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

function nav(locale: string, path: string) {
  window.location.href = `/${locale}${path}`;
}

export function AuthProvider({
  children,
  require,
}: {
  children: ReactNode;
  require?: "client" | "admin";
}) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const locale = useLocale();

  const refresh = useCallback(async () => {
    try {
      const { user: fresh } = await getMe();
      setUser(fresh);
    } catch {
      clearAuth();
      setUser(null);
    }
  }, []);

  useEffect(() => {
    if (!isLoggedIn()) {
      setLoading(false);
      nav(locale, "/login");
      return;
    }

    const cached = getStoredUser();
    if (cached) {
      if (require && cached.role !== require) {
        setLoading(false);
        nav(locale, cached.role === "admin" ? "/admin" : "/portal");
        return;
      }
      setUser(cached);
      setLoading(false);
    }

    getMe()
      .then(({ user: fresh }) => {
        if (require && fresh.role !== require) {
          nav(locale, fresh.role === "admin" ? "/admin" : "/portal");
          return;
        }
        setUser(fresh);
        setLoading(false);
      })
      .catch(() => {
        clearAuth();
        setUser(null);
        setLoading(false);
        nav(locale, "/login");
      });
  }, [require, locale, refresh]);

  const handleLogout = useCallback(() => {
    clearAuth();
    setUser(null);
    nav(locale, "/login");
  }, [locale]);

  return (
    <AuthContext.Provider value={{ user, loading, logout: handleLogout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}
