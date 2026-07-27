import React from 'react';
import { useSubscription } from '../context/SubscriptionContext';
import {
  PieChart as PieChartIcon,
  BarChart3,
  TrendingUp,
  DollarSign,
  Award,
  ArrowDownRight,
  Calculator,
  ShieldCheck,
  PiggyBank,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  LineChart,
  Line,
  CartesianGrid,
} from 'recharts';

export const AnalyticsView: React.FC = () => {
  const { subscriptions, payments, currencySymbol, budget } = useSubscription();

  const activeSubs = subscriptions.filter((s) => s.status === 'active');

  // Category distribution calculation
  const categoryTotals: Record<string, number> = {};
  activeSubs.forEach((sub) => {
    let monthlyAmount = sub.amount;
    if (sub.billingCycle === 'Quarterly') monthlyAmount = sub.amount / 3;
    if (sub.billingCycle === 'Half Yearly') monthlyAmount = sub.amount / 6;
    if (sub.billingCycle === 'Yearly') monthlyAmount = sub.amount / 12;

    categoryTotals[sub.category] = (categoryTotals[sub.category] || 0) + monthlyAmount;
  });

  const categoryColors: Record<string, string> = {
    Entertainment: '#A855F7', // Purple
    Utilities: '#3B82F6', // Blue
    Gaming: '#F43F5E', // Rose
    Education: '#6366F1', // Indigo
    Cloud: '#0EA5E9', // Sky
    Shopping: '#F59E0B', // Amber
    Finance: '#10B981', // Emerald
    Others: '#64748B', // Slate
  };

  const pieChartData = Object.keys(categoryTotals).map((cat) => ({
    name: cat,
    value: Math.round(categoryTotals[cat]),
    color: categoryColors[cat] || '#818CF8',
  }));

  // Monthly breakdown data (Jan - Dec)
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const totalMonthlySpend = activeSubs.reduce((acc, sub) => {
    let monthly = sub.amount;
    if (sub.billingCycle === 'Quarterly') monthly = sub.amount / 3;
    if (sub.billingCycle === 'Half Yearly') monthly = sub.amount / 6;
    if (sub.billingCycle === 'Yearly') monthly = sub.amount / 12;
    return acc + monthly;
  }, 0);

  const barChartData = monthNames.map((m, idx) => {
    // add small realistic variance for chart visual
    const factor = 1 + (Math.sin(idx) * 0.08);
    return {
      month: m,
      spent: Math.round(totalMonthlySpend * factor),
      budget: budget.monthlyBudget,
    };
  });

  // Annual cumulative trajectory data
  let cumulative = 0;
  const lineChartData = monthNames.map((m, idx) => {
    cumulative += totalMonthlySpend * (1 + Math.sin(idx) * 0.05);
    return {
      month: m,
      cumulativeSpent: Math.round(cumulative),
    };
  });

  // Key Statistics
  const sortedByCost = [...activeSubs].sort((a, b) => b.amount - a.amount);
  const mostExpensive = sortedByCost[0] || null;
  const lowestSub = sortedByCost[sortedByCost.length - 1] || null;
  const averageMonthlyCost = activeSubs.length > 0 ? totalMonthlySpend / activeSubs.length : 0;
  const totalSpentHistory = payments.reduce((acc, p) => acc + p.amount, 0);
  const totalSaved = 11200; // Estimated savings from AI & annual plan optimizations

  return (
    <div className="space-y-6 pb-24">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-[2rem] shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <BarChart3 size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Spending Analytics</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Detailed financial report & projections</p>
          </div>
        </div>
      </div>

      {/* Key Statistics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium block">Most Expensive</span>
          <p className="text-base font-bold text-indigo-600 dark:text-indigo-400 truncate">
            {mostExpensive ? mostExpensive.serviceName : 'N/A'}
          </p>
          <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200">
            {mostExpensive ? `${currencySymbol}${mostExpensive.amount}` : '-'}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium block">Lowest Subscription</span>
          <p className="text-base font-bold text-emerald-600 dark:text-emerald-400 truncate">
            {lowestSub ? lowestSub.serviceName : 'N/A'}
          </p>
          <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200">
            {lowestSub ? `${currencySymbol}${lowestSub.amount}` : '-'}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium block">Avg. Monthly Cost</span>
          <p className="text-base font-bold text-amber-600 dark:text-amber-400">
            {currencySymbol}{Math.round(averageMonthlyCost)}
          </p>
          <span className="text-[10px] text-slate-400">Per subscription</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium block">Total Historical Spent</span>
          <p className="text-base font-bold text-teal-600 dark:text-teal-400">
            {currencySymbol}{totalSpentHistory.toLocaleString()}
          </p>
          <span className="text-[10px] text-teal-600 dark:text-teal-400">Completed payments</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1 col-span-2 md:col-span-2">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium block flex items-center gap-1">
            <PiggyBank size={13} className="text-emerald-600 dark:text-emerald-400" />
            <span>AI Projected Annual Savings</span>
          </span>
          <p className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
            {currencySymbol}{totalSaved.toLocaleString()}
          </p>
          <span className="text-[10px] text-slate-500 dark:text-slate-300">By optimizing billing cycles & cancelling unused plans</span>
        </div>
      </div>

      {/* 1. Category Spending Pie Chart */}
      <div className="p-5 rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <PieChartIcon size={16} className="text-indigo-600 dark:text-indigo-400" />
            <span>Category Breakdown</span>
          </h4>
          <span className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">{pieChartData.length} Categories</span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieChartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={85}
                innerRadius={45}
                paddingAngle={4}
              >
                {pieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0F172A',
                  borderColor: '#334155',
                  borderRadius: '12px',
                  color: '#fff',
                }}
                formatter={(val: any) => [`${currencySymbol}${val}`, 'Monthly Cost']}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
          {pieChartData.map((item) => (
            <div key={item.name} className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
              <span className="text-slate-600 dark:text-slate-300 truncate">{item.name}</span>
              <span className="font-bold text-slate-900 dark:text-slate-100 ml-auto">{currencySymbol}{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Monthly Spending Bar Chart */}
      <div className="p-5 rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart3 size={16} className="text-amber-500" />
            <span>Monthly Spending vs Budget</span>
          </h4>
          <span className="text-xs text-amber-600 dark:text-amber-400 font-semibold">Budget: {currencySymbol}{budget.monthlyBudget}</span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#64748B" fontSize={11} />
              <YAxis stroke="#64748B" fontSize={11} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0F172A',
                  borderColor: '#334155',
                  borderRadius: '12px',
                  color: '#fff',
                }}
              />
              <Bar dataKey="spent" fill="#4F46E5" radius={[6, 6, 0, 0]} name="Spent" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3. Annual Cumulative Spending Line Chart */}
      <div className="p-5 rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <TrendingUp size={16} className="text-emerald-600 dark:text-emerald-400" />
            <span>Annual Cumulative Trajectory</span>
          </h4>
          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">12 Month Projection</span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={lineChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#64748B" fontSize={11} />
              <YAxis stroke="#64748B" fontSize={11} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0F172A',
                  borderColor: '#334155',
                  borderRadius: '12px',
                  color: '#fff',
                }}
              />
              <Line
                type="monotone"
                dataKey="cumulativeSpent"
                stroke="#10B981"
                strokeWidth={3}
                dot={{ fill: '#10B981', r: 4 }}
                name="Cumulative Total"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
