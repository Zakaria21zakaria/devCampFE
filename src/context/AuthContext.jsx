import React, { createContext, useContext, useMemo, useState } from "react";

const STORAGE_KEY = "devcamp.loginAccessKey";

function loadLoginAccessKey() {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function saveLoginAccessKey(value) {
  try {
    if (value) localStorage.setItem(STORAGE_KEY, value);
    else localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore (e.g. privacy mode)
  }
}

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [loginAccessKey, setLoginAccessKey] = useState(() => loadLoginAccessKey());
  const [user, setUser] = useState(null)

  const login = (newLoginAccessKey, user) => {
    setLoginAccessKey(newLoginAccessKey);
    saveLoginAccessKey(newLoginAccessKey);
    setUser(user);
    console.log('we are here');
  };

  const logout = () => {
    setLoginAccessKey(null);
    saveLoginAccessKey(null);
    setUser(null)
  };

  const value = useMemo(
    () => ({
      loginAccessKey,
      isAuthenticated: Boolean(loginAccessKey),
      user,
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
