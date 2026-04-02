import { useFinance } from '../../context/FinanceContext';
import { TrendingUp, TrendingDown, Target, Lightbulb, AlertTriangle } from 'lucide-react';
import { format, parseISO, startOfMonth, subMonths, isSameMonth } from 'date-fns';
import { cn } from '../../utils/cn';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export function Insights() {
  const { transactions, theme } = useFinance();

  // Basic stats
  const expenses = transactions.filter(t => t.type === 'expense');
  const income = transactions.filter(t => t.type === 'income');
  
  // Highest Spending Category
  const expensesByCategory = expenses.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
    return acc;
  }, {});

  const highestCategory = Object.entries(expensesByCategory).sort((a, b) => b[1] - a[1])[0] || ['None', 0];

  // Monthly Comparison
  const currentMonth = new Date();
  const lastMonth = subMonths(currentMonth, 1);

  const currentMonthExpenses = expenses
    .filter(t => isSameMonth(parseISO(t.date), currentMonth))
    .reduce((acc, t) => acc + t.amount, 0);

  const lastMonthExpenses = expenses
    .filter(t => isSameMonth(parseISO(t.date), lastMonth))
    .reduce((acc, t) => acc + t.amount, 0);

  const currentMonthIncome = income
    .filter(t => isSameMonth(parseISO(t.date), currentMonth))
    .reduce((acc, t) => acc + t.amount, 0);

  const expenseChange = lastMonthExpenses === 0 ? 0 : ((currentMonthExpenses - lastMonthExpenses) / lastMonthExpenses) * 100;
  const savingsRate = currentMonthIncome === 0 ? 0 : ((currentMonthIncome - currentMonthExpenses) / currentMonthIncome) * 100;

  // Chart data
  const monthlyData = [
    { name: format(lastMonth, 'MMM yyyy'), Income: transactions.filter(t => t.type === 'income' && isSameMonth(parseISO(t.date), lastMonth)).reduce((a, b) => a + b.amount, 0), Expenses: lastMonthExpenses },
    { name: format(currentMonth, 'MMM yyyy'), Income: currentMonthIncome, Expenses: currentMonthExpenses }
  ];

  // Observation Generation
  const generateObservation = () => {
    if (savingsRate > 20) return { text: "Great job! You're saving a significant portion of your income this month.", icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-500/10" };
    if (currentMonthExpenses > currentMonthIncome) return { text: "Warning: You're spending more than you earn this month.", icon: AlertTriangle, color: "text-rose-500", bg: "bg-rose-500/10" };
    if (expenseChange > 10) return { text: "Your expenses are significantly higher than last month. Consider reviewing your budget.", icon: TrendingDown, color: "text-rose-500", bg: "bg-rose-500/10" };
    return { text: "Your spending is on track and balanced for this month.", icon: Target, color: "text-blue-500", bg: "bg-blue-500/10" };
  };

  const observation = generateObservation();

  const cardClasses = cn(
    "p-8 rounded-2xl border shadow-sm transition-all duration-300 hover:shadow-lg hover:scale-[1.02]",
    theme === 'dark' ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"
  );
  const textClasses = theme === 'dark' ? "text-gray-100" : "text-gray-900";
  const subTextClasses = theme === 'dark' ? "text-gray-400" : "text-gray-500";

  return (
    <div className="fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Financial Insights</h1>
        <p className={cn("mt-2", subTextClasses)}>
          AI-driven analysis of your spending habits and patterns.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        
        {/* Highest Category */}
        <div className={cardClasses}>
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 bg-rose-50 dark:bg-rose-500/10 rounded-full">
              <Target className="h-6 w-6 text-rose-500" />
            </div>
            <div>
              <h3 className={cn("text-sm font-medium", subTextClasses)}>Top Spending Category</h3>
              <p className={cn("text-2xl font-bold", textClasses)}>{highestCategory[0]}</p>
            </div>
          </div>
          <p className={subTextClasses}>
            You've spent <span className="font-bold text-rose-500">${highestCategory[1].toLocaleString()}</span> on this category overall, making it your largest expense area.
          </p>
        </div>

        {/* Smart Observation */}
        <div className={cardClasses}>
          <div className="flex items-center space-x-4 mb-4">
            <div className={cn("p-3 rounded-full", observation.bg)}>
              <observation.icon className={cn("h-6 w-6", observation.color)} />
            </div>
            <div>
              <h3 className={cn("text-sm font-medium", subTextClasses)}>Smart Observation</h3>
              <p className={cn("text-2xl font-bold", textClasses)}>Activity Status</p>
            </div>
          </div>
          <p className={subTextClasses}>{observation.text}</p>
        </div>

      </div>

      <div className={cardClasses}>
        <h3 className={cn("text-lg font-bold mb-6", textClasses)}>Month over Month Comparison</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? '#374151' : '#e5e7eb'} />
              <XAxis dataKey="name" stroke={theme === 'dark' ? '#9ca3af' : '#6b7280'} tickLine={false} />
              <YAxis tickFormatter={(v) => `$${v}`} stroke={theme === 'dark' ? '#9ca3af' : '#6b7280'} tickLine={false} axisLine={false} />
              <Tooltip 
                cursor={{ fill: theme === 'dark' ? '#374151' : '#f3f4f6' }}
                contentStyle={{ backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff', borderColor: theme === 'dark' ? '#374151' : '#e5e7eb', borderRadius: '8px' }}
                itemStyle={{ color: textClasses }}
              />
              <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '12px', color: theme === 'dark' ? '#f3f4f6' : '#111827' }} />
              <Bar dataKey="Income" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Expenses" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
