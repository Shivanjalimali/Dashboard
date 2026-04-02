import { createContext, useContext, useState, useEffect } from 'react';
import { initialTransactions } from '../utils/mockData';

const FinanceContext = createContext();

export const useFinance = () => useContext(FinanceContext);

export const FinanceProvider = ({ children }) => {
  // Theme state
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  // Role state
  const [role, setRole] = useState('Viewer');

  // Transactions state
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('transactions');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return initialTransactions;
      }
    }
    return initialTransactions;
  });

  // Effect to sync theme to localStorage and body class
  useEffect(() => {
    localStorage.setItem('theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.classList.add('bg-gray-900', 'text-gray-100');
      document.body.classList.remove('bg-gray-50', 'text-gray-900');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('bg-gray-900', 'text-gray-100');
      document.body.classList.add('bg-gray-50', 'text-gray-900');
    }
  }, [theme]);

  // Effect to sync transactions to localStorage
  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const addTransaction = (transaction) => {
    setTransactions(prev => [{ ...transaction, id: crypto.randomUUID() }, ...prev]);
  };

  const deleteTransaction = (id) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };
  
  const updateTransaction = (id, updatedData) => {
    setTransactions(prev => prev.map(t => t.id === id ? { ...t, ...updatedData } : t));
  }

  const value = {
    theme,
    toggleTheme,
    role,
    setRole,
    transactions,
    addTransaction,
    deleteTransaction,
    updateTransaction
  };

  return (
    <FinanceContext.Provider value={value}>
      {children}
    </FinanceContext.Provider>
  );
};
