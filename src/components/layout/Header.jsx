import { useFinance } from '../../context/FinanceContext';
import { Moon, Sun, UserCircle, Menu } from 'lucide-react';
import { cn } from '../../utils/cn';
import { Dropdown } from '../ui/Dropdown';

export function Header({ onMenuClick }) {
  const { theme, toggleTheme, role, setRole } = useFinance();

  return (
    <header className={cn(
      "relative z-50 h-20 border-b flex items-center justify-between px-4 md:px-8 transition-colors duration-200",
      theme === 'dark' ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"
    )}>
      {/* Mobile Menu Button */}
      <button 
        onClick={onMenuClick}
        className={cn(
          "md:hidden p-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-primary transition-colors",
          theme === 'dark' ? "border-gray-700 text-gray-300 hover:bg-gray-800" : "border-gray-200 text-gray-600 hover:bg-gray-50"
        )}
      >
        <Menu className="h-6 w-6" />
      </button>

      <div className="flex items-center space-x-3 md:space-x-6 ml-auto">
        
        {/* Role Switcher */}
        <div className="flex items-center">
          <Dropdown 
            value={role}
            onChange={(val) => setRole(val)}
            icon={UserCircle}
            options={[
              { value: 'Viewer', label: 'Viewer Role' },
              { value: 'Admin', label: 'Admin Role' }
            ]}
          />
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className={cn(
            "p-3 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary hover:scale-110 hover:-translate-y-0.5 hover:shadow-sm",
            theme === 'dark' 
              ? "bg-gray-800 text-yellow-400 hover:bg-gray-700" 
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          )}
          aria-label="Toggle Dark Mode"
        >
          {theme === 'dark' ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
        </button>

      </div>
    </header>
  );
}
