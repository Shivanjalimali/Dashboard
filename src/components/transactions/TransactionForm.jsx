import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { categories } from '../../utils/mockData';
import { useFinance } from '../../context/FinanceContext';
import { cn } from '../../utils/cn';

export function TransactionForm({ onClose, initialData }) {
  const { addTransaction, updateTransaction, theme } = useFinance();
  const isEditing = !!initialData;

  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    category: categories[0],
    type: 'expense'
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        amount: Math.abs(initialData.amount) // Ensure positive number for input
      });
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.description || !formData.amount || !formData.date) return;

    const payload = {
      ...formData,
      amount: parseFloat(formData.amount)
    };

    if (isEditing) {
      updateTransaction(initialData.id, payload);
    } else {
      addTransaction(payload);
    }
    onClose();
  };

  const inputClass = cn(
    "w-full px-5 py-3 mt-2 rounded-xl text-base font-medium border focus:ring-2 focus:ring-primary focus:outline-none transition-all duration-200 hover:shadow-md hover:-translate-y-0.5",
    theme === 'dark' ? "bg-gray-800 border-gray-700 text-gray-200 hover:bg-gray-700" : "bg-gray-50 border-gray-200 text-gray-800 hover:bg-white"
  );
  const labelClass = cn("block text-sm font-semibold uppercase tracking-wider mb-1", theme === 'dark' ? "text-gray-400" : "text-gray-500");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className={cn(
        "w-full max-w-lg py-12 px-10 rounded-3xl shadow-2xl transform transition-all animate-drop-in",
        theme === 'dark' ? "bg-gray-900 border border-gray-800" : "bg-white"
      )}>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">{isEditing ? 'Edit Transaction' : 'New Transaction'}</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className={labelClass}>Description</label>
            <input 
              type="text" 
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              className={inputClass}
              placeholder="e.g. Grocery Run"
              required
            />
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <label className={labelClass}>Amount ($)</label>
              <input 
                type="number" 
                step="0.01"
                min="0.01"
                value={formData.amount}
                onChange={e => setFormData({...formData, amount: e.target.value})}
                className={inputClass}
                placeholder="0.00"
                required
              />
            </div>
            <div className="flex-1">
              <label className={labelClass}>Type</label>
              <select 
                value={formData.type}
                onChange={e => setFormData({...formData, type: e.target.value})}
                className={inputClass}
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <label className={labelClass}>Date</label>
              <input 
                type="date" 
                value={formData.date}
                onChange={e => setFormData({...formData, date: e.target.value})}
                className={inputClass}
                required
              />
            </div>
            <div className="flex-1">
              <label className={labelClass}>Category</label>
              <select 
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}
                className={inputClass}
              >
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="pt-6 mt-8 border-t border-gray-200 dark:border-gray-800 flex justify-end space-x-4">
            <button 
              type="button" 
              onClick={onClose}
              className={cn(
                "px-6 py-3 rounded-xl font-medium text-base transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5",
                theme === 'dark' ? "hover:bg-gray-800 text-gray-300" : "hover:bg-gray-100 text-gray-700"
              )}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-6 py-3 rounded-xl font-bold text-base bg-primary hover:bg-primary-dark text-white transition-all duration-200 shadow-md hover:shadow-xl hover:-translate-y-0.5"
            >
              {isEditing ? 'Save Changes' : 'Add Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
