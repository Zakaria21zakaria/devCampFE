import { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";

const STORAGE_KEY = "devcamp.loginAccessKey";

function loadLoginAccessKey(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function saveLoginAccessKey(value: string | null) {
  try {
    if (value) localStorage.setItem(STORAGE_KEY, value);
    else localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore (e.g. privacy mode)
  }
}

export type AuthContextValue = {
  loginAccessKey: string | null;
  isAuthenticated: boolean;
  login: (newLoginAccessKey: string) => void;
  logout: () => void;
  bearerAuthHeader: string | null;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [loginAccessKey, setLoginAccessKey] = useState<string | null>(() => loadLoginAccessKey());
  // const [user, setUser] = useState(null)

  const login = (newLoginAccessKey: string) => {
    setLoginAccessKey(newLoginAccessKey);
    saveLoginAccessKey(newLoginAccessKey);
    // setUser(user);
  };

  const logout = () => {
    setLoginAccessKey(null);
    saveLoginAccessKey(null);
    // setUser(null)
  };

  const value = useMemo(
    (): AuthContextValue => ({
      loginAccessKey,
      isAuthenticated: Boolean(loginAccessKey),
      // user,
      login,
      logout,
      bearerAuthHeader: loginAccessKey ? `Bearer ${loginAccessKey}` : null,
    }),
    [loginAccessKey],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext); //you can use 'use' instead of 'usecontext' in react 19 or higher
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
