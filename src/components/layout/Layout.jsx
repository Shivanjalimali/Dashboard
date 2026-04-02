import { useState } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { useFinance } from '../../context/FinanceContext';
import { cn } from '../../utils/cn';

export function Layout({ children, currentView, setCurrentView }) {
  const { theme } = useFinance();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className={cn(
      "flex h-screen overflow-hidden",
      theme === 'dark' ? "bg-gray-950 text-gray-100" : "bg-gray-50 text-gray-900"
    )}>
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden transition-opacity" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className={cn(
        "fixed inset-y-0 left-0 z-30 transform transition-transform duration-300 md:relative md:translate-x-0 shadow-2xl md:shadow-none h-screen",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <Sidebar currentView={currentView} setCurrentView={(v) => { setCurrentView(v); setSidebarOpen(false); }} />
      </div>
      
      <div className="flex-1 flex flex-col relative overflow-hidden w-full">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-auto p-4 md:p-8 layout-content">
          <div className="max-w-7xl mx-auto drop-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
