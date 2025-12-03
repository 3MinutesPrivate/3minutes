import React from "react";
import { useAppContext } from "./context/AppContext.jsx";

import Header from "./components/layout/Header.jsx";
import Footer from "./components/layout/Footer.jsx";
import Hub from "./components/layout/Hub.jsx";

import CustomerView from "./components/modeA/CustomerView.jsx";
import AgentView from "./components/modeB/AgentView.jsx";
import BankerView from "./components/modeC/BankerView.jsx";

// Finzo 风格紫色背景（放在组件外，避免每次 render 都新建对象）
const appBackgroundStyle = {
  backgroundColor: "#050014",
  backgroundImage:
    "radial-gradient(circle at 0 0, rgba(124,58,237,0.45), transparent 55%), " +
    "radial-gradient(circle at 100% 0, rgba(244,114,182,0.40), transparent 55%), " +
    "linear-gradient(to bottom, #020617 0%, #020617 40%, #000000 100%)",
  backgroundAttachment: "fixed",
};

function App() {
  const { user, setUser, mode } = useAppContext();

  // DEV 模式：自动注入测试用户，跳过 Onboarding
  React.useEffect(() => {
    if (!user) {
      setUser({
        name: "Dev Tester",
        email: "dev@example.com",
        phone: "+60149428924",
      });
    }
  }, [user, setUser]);

  // Hub 是否折叠：Customer 默认展开，其它模式默认收起
  const [hubCollapsed, setHubCollapsed] = React.useState(
    mode !== "customer"
  );

  // 切换视角时重置默认值
  React.useEffect(() => {
    setHubCollapsed(mode !== "customer");
  }, [mode]);

  if (!user) {
    // 首帧注入用户时不渲染，避免闪现
    return null;
  }

  let view = null;
  if (mode === "agent") view = <AgentView />;
  else if (mode === "banker") view = <BankerView />;
  else view = <CustomerView />;

  return (
    <div
      className="min-h-screen flex flex-col text-slate-50"
      style={appBackgroundStyle}
    >
      <Header />
      <main className="mx-auto mt-4 w-full max-w-6xl px-4 pb-6 space-y-4">
        {/* Hub 折叠控制条 */}
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span>
            {hubCollapsed
              ? "Overview is hidden. Tap to show the 3M tool hub."
              : "Overview is visible. Tap to hide if you need more space."}
          </span>
          <button
            type="button"
            onClick={() => setHubCollapsed((v) => !v)}
            className="inline-flex items-center rounded-full border border-slate-700/80 bg-slate-900/80 px-3 py-1 text-[11px] font-medium text-slate-100 hover:border-emerald-400/80"
          >
            {hubCollapsed ? "Show Overview" : "Hide Overview"}
          </button>
        </div>

        {/* Hub 总览区（可折叠） */}
        {!hubCollapsed && <Hub />}

        {/* 各模式主视图 */}
        {view}
      </main>
      <Footer />
    </div>
  );
}

export default App;
