import React from "react";
import Header from "../../components/layout/Header.jsx";
import Footer from "../../components/layout/Footer.jsx";

/**
 * AppShell
 *
 * - 使用 flex-col + main.flex-1，让 Footer 始终固定在最底部
 * - Header / Footer 复用现有组件
 */
function AppShell({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-50">
      <Header />
      <main className="flex-1 mx-auto mt-4 w-full max-w-6xl px-4 pb-6 space-y-4">
        {children}
      </main>
      <Footer />
    </div>
  );
}

export default AppShell;
