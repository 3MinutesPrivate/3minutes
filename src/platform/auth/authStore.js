import React, { createContext, useContext, useEffect, useState } from "react";
import { normalizeRole, ROLES } from "../../features/loan_calculator/logic/roles.js";

const STORAGE_KEY = "3m_auth_user";
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [inviteCode, setInviteCode] = useState(() => {
    if (typeof window === "undefined") return null;
    try {
      return window.sessionStorage.getItem("inviteCode");
    } catch {
      return null;
    }
  });

  // 从 localStorage 载入用户
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed && parsed.role) {
        setCurrentUser(parsed);
      }
    } catch {
      // ignore
    }
  }, []);

  // 持久化用户
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      if (currentUser) {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(currentUser));
      } else {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // ignore
    }
  }, [currentUser]);

  const register = ({ name, email, phone, role }) => {
    const normalisedRole = normalizeRole(role);
    const user = {
      id: Date.now().toString(),
      name: name || "Anonymous",
      email: email || "",
      phone: phone || "",
      role: normalisedRole,
    };
    setCurrentUser(user);
    return user;
  };

  // 简化：login 与 register 行为一致（前端 demo 环境）
  const login = ({ name, email, phone, role }) => {
    return register({ name, email, phone, role });
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    inviteCode,
    setInviteCode,
    login,
    register,
    logout,
    ROLES,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthStore() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuthStore must be used within AuthProvider");
  }
  return ctx;
}
