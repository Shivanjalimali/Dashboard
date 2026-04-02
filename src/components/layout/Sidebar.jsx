import { useFinance } from '../../context/FinanceContext';
import { LayoutDashboard, Receipt, TrendingUp, Wallet } from 'lucide-react';
import { cn } from '../../utils/cn';

export function Sidebar({ currentView, setCurrentView }) {
  const { theme } = useFinance();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'transactions', label: 'Transactions', icon: Receipt },
    { id: 'insights', label: 'Insights', icon: TrendingUp },
  ];

  return (
    <div className={cn(
      "h-screen w-64 border-r flex flex-col transition-colors duration-200",
      theme === 'dark' ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"
    )}>
      <div className="p-6 flex items-center space-x-3">
        <div className="bg-primary p-2 rounded-lg">
          <Wallet className="h-6 w-6 text-white" />
        </div>
        <span className="text-xl font-bold tracking-tight">ExpenseIQ</span>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={cn(
                "w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 hover:scale-105 hover:translate-x-1",
                isActive 
                  ? "bg-primary text-white shadow-md font-bold" 
                  : theme === 'dark'
                    ? "text-gray-400 hover:bg-primary/20 hover:text-primary hover:font-bold"
                    : "text-gray-500 hover:bg-primary/10 hover:text-primary hover:font-bold"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className={cn(
        "p-6 border-t",
        theme === 'dark' ? "border-gray-800 text-gray-500" : "border-gray-200 text-gray-400"
      )}>
        <p className="text-sm">© 2026 ExpenseIQ</p>
      </div>
    </div>
  );
}
