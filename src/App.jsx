import { useState } from 'react';
import { FinanceProvider } from './context/FinanceContext';
import { Layout } from './components/layout/Layout';
import { TransactionManager } from './components/transactions/TransactionManager';
import { Dashboard } from './components/dashboard/Dashboard';
import { Insights } from './components/insights/Insights';

function AppContent() {
  const [currentView, setCurrentView] = useState('dashboard');

  return (
    <Layout currentView={currentView} setCurrentView={setCurrentView}>
      {currentView === 'dashboard' && <Dashboard />}
      {currentView === 'transactions' && <TransactionManager />}
      {currentView === 'insights' && <Insights />}
    </Layout>
  );
}

function App() {
  return (
    <FinanceProvider>
      <AppContent />
    </FinanceProvider>
  );
}

export default App;
