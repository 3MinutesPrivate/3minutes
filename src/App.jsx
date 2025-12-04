import React, { useEffect } from "react";
import { useAuthStore } from "./platform/auth/authStore.js";
import { useAppContext } from "./context/AppContext.jsx";

import AppShell from "./platform/layout/AppShell.jsx";
import LoginScreen from "./platform/auth/LoginScreen.jsx";
import UnifiedCalculator from "./features/loan_calculator/presentation/UnifiedCalculator.jsx";

/**
 * 新版 App：
 * - 解析 URL ?code= 邀请码
 * - 从 AuthStore 读取 currentUser
 * - 同步 basic user 信息到旧的 AppContext（保证 Header/Watermark 继续工作）
 * - 未登录时渲染 LoginScreen；已登录则渲染 Mother Base + UnifiedCalculator
 */
function App() {
  const { currentUser, setInviteCode } = useAuthStore();
  const { setUser } = useAppContext();

  // 解析 URL 邀请码
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");
      if (code) {
        window.sessionStorage.setItem("inviteCode", code);
        setInviteCode && setInviteCode(code);
      }
    } catch {
      // ignore
    }
  }, [setInviteCode]);

  // 将 AuthStore 的用户同步到旧 AppContext（供 Header / Watermark 使用）
  useEffect(() => {
    if (!setUser) return;
    if (!currentUser) {
      setUser(null);
      return;
    }
    setUser({
      name: currentUser.name || "",
      email: currentUser.email || "",
      phone: currentUser.phone || "",
    });
  }, [currentUser, setUser]);

  if (!currentUser) {
    return <LoginScreen />;
  }

  return (
    <AppShell>
      <UnifiedCalculator currentUser={currentUser} />
    </AppShell>
  );
}

export default App;
