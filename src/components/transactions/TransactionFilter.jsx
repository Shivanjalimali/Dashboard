import { Filter, Search } from 'lucide-react';
import { categories } from '../../utils/mockData';
import { useFinance } from '../../context/FinanceContext';
import { Dropdown } from '../ui/Dropdown';
import { cn } from '../../utils/cn';

export function TransactionFilter({ filter, setFilter, sort, setSort, searchTerm, setSearchTerm }) {
  const { theme } = useFinance();
  const inputClass = cn(
    "px-5 py-2.5 bg-transparent text-base font-medium border focus:ring-2 focus:ring-primary focus:outline-none transition-all duration-200 rounded-xl hover:shadow-md hover:scale-[1.02]",
    theme === 'dark' ? "border-gray-700 text-gray-200 placeholder-gray-500 hover:bg-gray-800/50" : "border-gray-200 text-gray-700 placeholder-gray-400 hover:bg-white"
  );
  
  return (
    <div className={cn(
      "relative z-40 p-6 rounded-2xl border shadow-sm transition-all duration-300 hover:shadow-lg hover:scale-[1.01] mb-6 flex flex-col md:flex-row md:items-center gap-4 justify-between",
      theme === 'dark' ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"
    )}>
      {/* Search Input */}
      <div className="relative flex-1 max-w-sm">
        <Search className={cn("absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5", theme === 'dark' ? "text-gray-500" : "text-gray-400")} />
        <input 
          type="text" 
          placeholder="Search descriptions..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={cn(inputClass, "w-full pl-12")}
        />
      </div>

      <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
        {/* Type Filter */}
        <Dropdown 
          value={filter.type}
          onChange={(val) => setFilter(f => ({ ...f, type: val }))}
          icon={Filter}
          className="w-full sm:w-48"
          options={[
            { value: 'all', label: 'All Types' },
            { value: 'income', label: 'Income' },
            { value: 'expense', label: 'Expense' }
          ]}
        />

        {/* Category Filter */}
        <Dropdown 
          value={filter.category}
          onChange={(val) => setFilter(f => ({ ...f, category: val }))}
           className="w-full sm:w-56"
          options={[
            { value: 'all', label: 'All Categories' },
            ...categories.map(c => ({ value: c, label: c }))
          ]}
        />

        {/* Sort Dropdown */}
        <Dropdown 
          value={`${sort.field}-${sort.order}`}
          onChange={(val) => {
            const [field, order] = val.split('-');
            setSort({ field, order });
          }}
          className="w-full sm:w-64"
          options={[
            { value: 'date-desc', label: 'Newest First' },
            { value: 'date-asc', label: 'Oldest First' },
            { value: 'amount-desc', label: 'Amount (High to Low)' },
            { value: 'amount-asc', label: 'Amount (Low to High)' }
          ]}
        />
      </div>
    </div>
  );
}
