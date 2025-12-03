import React from "react";
import { useAppContext } from "./context/AppContext.jsx";

import Header from "./components/layout/Header.jsx";
import Footer from "./components/layout/Footer.jsx";
import Hub from "./components/layout/Hub.jsx";

import CustomerView from "./components/modeA/CustomerView.jsx";
import AgentView from "./components/modeB/AgentView.jsx";
import BankerView from "./components/modeC/BankerView.jsx";

function App() {
  const { user, setUser, mode } = useAppContext();

  // DEV 模式：自动注入一个测试用户，跳过 Onboarding
  React.useEffect(() => {
    if (!user) {
      setUser({
        name: "Dev Tester",
        email: "dev@example.com",
        phone: "+60149428924",
      });
    }
  }, [user, setUser]);

  // 首帧 user 还没注入时，先不渲染任何内容，避免闪一下 Onboarding
  if (!user) {
    return null;
  }

  let view = null;
  if (mode === "agent") view = <AgentView />;
  else if (mode === "banker") view = <BankerView />;
  else view = <CustomerView />;

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-50">
      <Header />
      <main className="mx-auto mt-4 w-full max-w-6xl px-4 pb-6 space-y-6">
        <Hub />
        {view}
      </main>
      <Footer />
    </div>
  );
}

export default App;
