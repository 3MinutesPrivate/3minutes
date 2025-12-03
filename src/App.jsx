import React from "react";
import { useAppContext } from "./context/AppContext.jsx";

import Header from "./components/layout/Header.jsx";
import Footer from "./components/layout/Footer.jsx";
import Hub from "./components/layout/Hub.jsx";

import CustomerView from "./components/modeA/CustomerView.jsx";
import AgentView from "./components/modeB/AgentView.jsx";
import BankerView from "./components/modeC/BankerView.jsx";

import OnboardingForm from "./components/onboarding/OnboardingForm.jsx";

function App() {
  const { user, setUser, mode } = useAppContext();

  const handleOnboardingComplete = React.useCallback(
    (data) => {
      setUser(data);
    },
    [setUser]
  );

  // 还没注册信息时，先显示 Onboarding
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
        <OnboardingForm initialData={user} onComplete={handleOnboardingComplete} />
      </div>
    );
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
