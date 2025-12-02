import React from 'react';
import { AppProvider, useAppContext } from './state/AppContext.jsx';
import { HandbookProvider } from './state/HandbookContext.jsx';
import Layout from './components/layout/Layout.jsx';
import Hub from './components/hub/Hub.jsx';
import CustomerView from './components/modeA/CustomerView.jsx';
import AgentView from './components/modeB/AgentView.jsx';
import BankerView from './components/modeC/BankerView.jsx';
import Onboarding from './components/onboarding/Onboarding.jsx';
import { MODES } from './lib/constants.js';

function AppContent() {
  const { user, mode, loadingDefaults } = useAppContext();

  if (loadingDefaults) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-50">
        <div className="flex flex-col items-center gap-2">
          <div className="h-10 w-10 border-4 border-emerald border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-300">Initializing 3Minutes engine…</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-50">
        <Onboarding />
      </div>
    );
  }

  let ModeView = null;
  if (mode === MODES.CUSTOMER) {
    ModeView = <CustomerView />;
  } else if (mode === MODES.AGENT) {
    ModeView = <AgentView />;
  } else if (mode === MODES.BANKER) {
    ModeView = <BankerView />;
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-8">
        <Hub />
        {ModeView}
      </div>
    </Layout>
  );
}

export default function App() {
  return (
    <HandbookProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </HandbookProvider>
  );
}
