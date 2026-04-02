import { Edit2, Trash2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { useFinance } from '../../context/FinanceContext';
import { cn } from '../../utils/cn';

export function TransactionList({ transactions, onEdit }) {
  const { theme, role, deleteTransaction } = useFinance();

  if (transactions.length === 0) {
    return (
      <div className={cn(
        "p-12 text-center rounded-2xl border", 
        theme === 'dark' ? "bg-gray-900 border-gray-800 text-gray-400" : "bg-white border-gray-100 text-gray-500"
      )}>
        <p>No transactions found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className={cn(
      "rounded-2xl border shadow-sm overflow-hidden overflow-x-auto",
      theme === 'dark' ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"
    )}>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className={cn(
            "border-b", 
            theme === 'dark' ? "border-gray-800 bg-gray-800/50 text-gray-300" : "border-gray-200 bg-gray-50 text-gray-600"
          )}>
            <th className="px-6 py-4 font-semibold text-sm">Date</th>
            <th className="px-6 py-4 font-semibold text-sm">Description</th>
            <th className="px-6 py-4 font-semibold text-sm">Category</th>
            <th className="px-6 py-4 font-semibold text-sm text-right">Amount</th>
            {role === 'Admin' && <th className="px-6 py-4 font-semibold text-sm text-right">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <tr 
              key={tx.id} 
              className={cn(
                "border-b transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md relative hover:z-10 bg-transparent hover:!bg-gray-100 dark:hover:!bg-gray-700",
                theme === 'dark' ? "border-gray-800" : "border-gray-100"
              )}
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {format(parseISO(tx.date), 'MMM dd, yyyy')}
              </td>
              <td className="px-6 py-4">
                <span className={cn(
                  "font-medium text-sm transition-transform duration-200 inline-block cursor-pointer hover:scale-105 active:scale-110",
                  theme === 'dark' ? "text-gray-200" : "text-gray-800"
                )}>
                  {tx.description}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <span className={cn(
                  "px-3 py-1 rounded-full text-xs font-medium",
                  theme === 'dark' ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-600"
                )}>
                   {tx.category}
                </span>
              </td>
              <td className={cn(
                "px-6 py-4 whitespace-nowrap text-right font-bold text-sm",
                tx.type === 'income' ? "text-emerald-500" : "text-rose-500"
              )}>
                {tx.type === 'income' ? '+' : '-'}${Math.abs(tx.amount).toLocaleString()}
              </td>
              
              {role === 'Admin' && (
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                  <button 
                    onClick={() => onEdit(tx)}
                    className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors mr-2"
                    aria-label="Edit"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => {
                       if(confirm('Are you sure you want to delete this transaction?')) {
                         deleteTransaction(tx.id);
                       }
                    }}
                    className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-colors"
                    aria-label="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
