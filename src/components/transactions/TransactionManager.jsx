import { useState, useMemo } from 'react';
import { Plus, Download } from 'lucide-react';
import { TransactionFilter } from './TransactionFilter';
import { TransactionList } from './TransactionList';
import { TransactionForm } from './TransactionForm';
import { useFinance } from '../../context/FinanceContext';
import { cn } from '../../utils/cn';

export function TransactionManager() {
  const { transactions, role, theme } = useFinance();
  
  const [filter, setFilter] = useState({ category: 'all', type: 'all' });
  const [sort, setSort] = useState({ field: 'date', order: 'desc' });
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingData, setEditingData] = useState(null);

  // Apply filters, search, and sorting
  const filteredAndSorted = useMemo(() => {
    return transactions
      .filter(t => {
        const matchCategory = filter.category === 'all' || t.category === filter.category;
        const matchType = filter.type === 'all' || t.type === filter.type;
        const matchSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            t.category.toLowerCase().includes(searchTerm.toLowerCase());
        return matchCategory && matchType && matchSearch;
      })
      .sort((a, b) => {
        if (sort.field === 'date') {
          const timeA = new Date(a.date).getTime();
          const timeB = new Date(b.date).getTime();
          return sort.order === 'desc' ? timeB - timeA : timeA - timeB;
        } else if (sort.field === 'amount') {
          return sort.order === 'desc' ? b.amount - a.amount : a.amount - b.amount;
        }
        return 0;
      });
  }, [transactions, filter, sort, searchTerm]);

  const handleEdit = (tx) => {
    setEditingData(tx);
    setIsFormOpen(true);
  };

  const handleOpenNew = () => {
    setEditingData(null);
    setIsFormOpen(true);
  };

  const exportCSV = () => {
    const headers = ['Date', 'Description', 'Category', 'Type', 'Amount'];
    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n"
      + filteredAndSorted.map(t => `${t.date},"${t.description}",${t.category},${t.type},${t.amount}`).join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "transactions.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fade-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
          <p className={cn("mt-2", theme === 'dark' ? "text-gray-400" : "text-gray-500")}>
            Manage and monitor your incoming and outgoing funds.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center w-full md:w-auto gap-4">
          <button 
            onClick={exportCSV}
            className={cn(
              "flex items-center justify-center space-x-2 px-5 py-3 w-full sm:w-auto rounded-xl font-medium text-base transition-all duration-200 border hover:shadow-md hover:-translate-y-0.5 hover:scale-105",
              theme === 'dark' ? "border-gray-700 hover:bg-gray-800" : "border-gray-200 hover:bg-gray-50 bg-white"
            )}
          >
            <Download className="h-5 w-5" />
            <span>Export CSV</span>
          </button>

          {role === 'Admin' && (
            <button 
              onClick={handleOpenNew}
              className="flex items-center justify-center space-x-2 px-5 py-3 w-full sm:w-auto rounded-xl font-medium text-base bg-primary hover:bg-primary-dark text-white shadow-sm transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 hover:scale-105"
            >
              <Plus className="h-5 w-5" />
              <span>Add New</span>
            </button>
          )}
        </div>
      </div>

      <TransactionFilter 
        filter={filter} setFilter={setFilter}
        sort={sort} setSort={setSort}
        searchTerm={searchTerm} setSearchTerm={setSearchTerm}
      />

      <TransactionList 
        transactions={filteredAndSorted} 
        onEdit={handleEdit}
      />

      {isFormOpen && (
        <TransactionForm 
          onClose={() => setIsFormOpen(false)} 
          initialData={editingData} 
        />
      )}
    </div>
  );
}
