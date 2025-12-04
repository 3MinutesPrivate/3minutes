import React from "react";
import Header from "../../components/layout/Header.jsx";
import Footer from "../../components/layout/Footer.jsx";

/**
 * AppShell
 *
 * 顶层布局容器：复用现有 Header/Footer，中间插入业务内容。
 * 后续如需更换 Navbar/Sidebar，只需调整此文件。
 */
function AppShell({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-50">
      <Header />
      <main className="mx-auto mt-4 w-full max-w-6xl px-4 pb-6 space-y-4">
        {children}
      </main>
      <Footer />
    </div>
  );
}

export default AppShell;
