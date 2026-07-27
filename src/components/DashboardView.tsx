import React from 'react';
import { useSubscription } from '../context/SubscriptionContext';
import { ServiceLogo } from './ServiceLogo';
import {
  Wallet,
  TrendingUp,
  CreditCard,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  ChevronRight,
  Plus,
  Zap,
} from 'lucide-react';
import { motion } from 'motion/react';

interface DashboardViewProps {
  onOpenAiModal: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onOpenAiModal }) => {
  const {
    subscriptions,
    payments,
    budget,
    currencySymbol,
    setActiveTab,
    setSelectedSubscriptionForDetail,
    setIsAddModalOpen,
    setEditingSubscription,
    markAsPaid,
    aiSuggestions,
  } = useSubscription();

  // Calculations
  const activeSubs = subscriptions.filter((s) => s.status === 'active');
  const activeCount = activeSubs.length;

  // Monthly spending calculation
  const totalMonthly = activeSubs.reduce((acc, sub) => {
    let monthlyAmount = sub.amount;
    if (sub.billingCycle === 'Quarterly') monthlyAmount = sub.amount / 3;
    if (sub.billingCycle === 'Half Yearly') monthlyAmount = sub.amount / 6;
    if (sub.billingCycle === 'Yearly') monthlyAmount = sub.amount / 12;
    return acc + monthlyAmount;
  }, 0);

  const totalYearly = totalMonthly * 12;

  // Budget calculations
  const budgetExceeded = totalMonthly > budget.monthlyBudget;
  const budgetPercentage = Math.min(Math.round((totalMonthly / budget.monthlyBudget) * 100), 100);

  // Filter bills due this week (next 7 days)
  const now = new Date();
  const next7Days = new Date();
  next7Days.setDate(now.getDate() + 7);

  const billsDueThisWeek = activeSubs.filter((sub) => {
    const renDate = new Date(sub.renewalDate);
    return renDate >= new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2) && renDate <= next7Days;
  }).sort((a, b) => new Date(a.renewalDate).getTime() - new Date(b.renewalDate).getTime());

  // Upcoming payments sorted by date
  const upcomingPayments = [...activeSubs].sort(
    (a, b) => new Date(a.renewalDate).getTime() - new Date(b.renewalDate).getTime()
  );

  // Recently paid bills (last 5)
  const recentlyPaid = [...payments].slice(0, 5);

  return (
    <div className="space-y-6 pb-24">
      {/* Top Banner & Gradient Welcome */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[2rem] bg-indigo-600 text-white p-6 shadow-xl shadow-indigo-200 dark:shadow-none"
      >
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-emerald-400/20 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white/20 text-indigo-50 border border-white/30">
                Monthly Overview
              </span>
              <span className="text-xs text-indigo-100">{activeCount} active subscriptions</span>
            </div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight flex items-baseline gap-2">
              <span>{currencySymbol}{totalMonthly.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
              <span className="text-sm font-normal text-indigo-100">/ month</span>
            </h2>
            <p className="text-xs text-indigo-100 mt-1">
              Estimated Yearly Spending: <span className="font-semibold text-emerald-300">{currencySymbol}{totalYearly.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setEditingSubscription(null);
                setIsAddModalOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white text-indigo-700 hover:bg-slate-100 font-bold text-xs shadow-md transition-all cursor-pointer active:scale-95"
            >
              <Plus size={16} className="stroke-[3]" />
              <span>Add Subscription</span>
            </button>
            <button
              onClick={onOpenAiModal}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-indigo-700/80 text-white border border-indigo-500 hover:bg-indigo-700 text-xs font-semibold transition-all cursor-pointer"
            >
              <Sparkles size={16} className="text-amber-300 animate-pulse" />
              <span>AI Insights</span>
            </button>
          </div>
        </div>

        {/* Budget Progress Bar */}
        <div className="mt-5 pt-4 border-t border-indigo-500/50">
          <div className="flex items-center justify-between text-xs text-indigo-100 mb-1.5 font-medium">
            <span className="flex items-center gap-1.5">
              <Wallet size={14} className="text-indigo-200" />
              <span>Monthly Budget: {currencySymbol}{budget.monthlyBudget.toLocaleString()}</span>
            </span>
            <span className={budgetExceeded ? 'text-rose-200 font-bold' : 'text-emerald-300 font-bold'}>
              {budgetPercentage}% used
            </span>
          </div>
          <div className="w-full bg-indigo-950/40 rounded-full h-2.5 overflow-hidden p-0.5 border border-indigo-400/30">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${budgetPercentage}%` }}
              className={`h-full rounded-full transition-all duration-500 ${
                budgetExceeded
                  ? 'bg-amber-300'
                  : 'bg-emerald-300'
              }`}
            />
          </div>
          {budgetExceeded && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 text-xs bg-rose-500/20 border border-rose-300/40 text-white p-2 rounded-xl flex items-center gap-2"
            >
              <AlertTriangle size={15} className="shrink-0 text-amber-200" />
              <span>Warning: Subscription budget exceeded by {currencySymbol}{(totalMonthly - budget.monthlyBudget).toFixed(0)}!</span>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-4 rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Active Subs</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <CreditCard size={18} />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{activeCount}</p>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">Subscribed</span>
        </div>

        <div className="p-4 rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Due This Week</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Clock size={18} />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{billsDueThisWeek.length}</p>
          <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">Action needed</span>
        </div>

        <div className="p-4 rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Yearly Total</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <TrendingUp size={18} />
            </div>
          </div>
          <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{currencySymbol}{totalYearly.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
          <span className="text-[10px] text-slate-400 font-medium">Annualized</span>
        </div>

        <div className="p-4 rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Recently Paid</span>
            <div className="w-8 h-8 rounded-xl bg-teal-50 dark:bg-teal-500/20 text-teal-600 dark:text-teal-400 flex items-center justify-center">
              <CheckCircle2 size={18} />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{payments.length}</p>
          <span className="text-[10px] text-teal-600 dark:text-teal-400 font-medium">Completed</span>
        </div>
      </div>

      {/* AI Smart Advisor Teaser Banner */}
      {aiSuggestions.length > 0 && (
        <div className="p-4 rounded-[2rem] bg-slate-900 dark:bg-slate-900 text-white border border-slate-800 flex items-center justify-between gap-3 shadow-md relative overflow-hidden">
          <div className="absolute right-0 bottom-0 w-32 h-32 bg-indigo-600 rounded-full blur-[50px] opacity-25 pointer-events-none" />
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0">
              <Sparkles size={20} className="animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-bold text-emerald-300 uppercase tracking-wider">AI Smart Insight</h4>
                <span className="text-[10px] text-emerald-300 bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                  Save {currencySymbol}{aiSuggestions[0].potentialSavings}
                </span>
              </div>
              <p className="text-xs text-slate-200 mt-0.5 line-clamp-1">{aiSuggestions[0].message}</p>
            </div>
          </div>
          <button
            onClick={onOpenAiModal}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shrink-0 flex items-center gap-1 transition-all cursor-pointer relative z-10"
          >
            <span>View All</span>
            <ChevronRight size={14} />
          </button>
        </div>
      )}

      {/* Bills Due This Week Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Clock size={18} className="text-amber-500" />
            <span>Bills Due This Week</span>
          </h3>
          <button
            onClick={() => setActiveTab('subscriptions')}
            className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-semibold flex items-center gap-1"
          >
            See All <ArrowRight size={14} />
          </button>
        </div>

        {billsDueThisWeek.length === 0 ? (
          <div className="p-6 text-center rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-xs">
            🎉 Great news! No bills due in the next 7 days.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {billsDueThisWeek.map((sub) => {
              const isOverdue = new Date(sub.renewalDate) < new Date(now.getFullYear(), now.getMonth(), now.getDate());

              return (
                <div
                  key={sub.id}
                  className={`p-4 rounded-[2rem] border transition-all flex items-center justify-between gap-3 ${
                    isOverdue
                      ? 'bg-rose-50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-500/40'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md'
                  }`}
                >
                  <div
                    onClick={() => setSelectedSubscriptionForDetail(sub)}
                    className="flex items-center gap-3 cursor-pointer min-w-0 flex-1"
                  >
                    <ServiceLogo name={sub.serviceName} category={sub.category} logoKey={sub.logo} size="md" />
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">{sub.serviceName}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-0.5">
                        <span className="font-semibold text-indigo-600 dark:text-indigo-300">{sub.currency}{sub.amount}</span>
                        <span>•</span>
                        <span className={isOverdue ? 'text-rose-600 dark:text-rose-400 font-bold' : 'text-amber-600 dark:text-amber-400 font-medium'}>
                          {isOverdue ? 'Overdue!' : `Due ${sub.renewalDate}`}
                        </span>
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => markAsPaid(sub.id)}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/20 border border-emerald-200 dark:border-emerald-500/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500 hover:text-white text-xs font-bold transition-all shrink-0 cursor-pointer"
                  >
                    Mark Paid
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Upcoming Payments Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Zap size={18} className="text-indigo-600 dark:text-indigo-400" />
            <span>Upcoming Renewal Pipeline</span>
          </h3>
          <button
            onClick={() => setActiveTab('subscriptions')}
            className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-semibold flex items-center gap-1"
          >
            Manage All
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {upcomingPayments.slice(0, 6).map((sub) => (
            <div
              key={sub.id}
              onClick={() => setSelectedSubscriptionForDetail(sub)}
              className="p-3.5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center gap-3 group"
            >
              <ServiceLogo name={sub.serviceName} category={sub.category} logoKey={sub.logo} size="sm" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors">
                    {sub.serviceName}
                  </h5>
                  <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
                    {sub.currency}{sub.amount}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  <span className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-[10px]">{sub.category}</span>
                  <span>Due {sub.renewalDate}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recently Paid Bills Section */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <CheckCircle2 size={18} className="text-teal-600 dark:text-teal-400" />
          <span>Recently Paid Bills</span>
        </h3>

        {recentlyPaid.length === 0 ? (
          <p className="text-xs text-slate-400 italic p-3">No payment records yet.</p>
        ) : (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-800 shadow-sm">
            {recentlyPaid.map((pay) => (
              <div key={pay.id} className="p-3.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-teal-50 dark:bg-teal-500/20 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
                    <CheckCircle2 size={14} />
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-200 block">{pay.serviceName}</span>
                    <span className="text-[10px] text-slate-400">Paid on {pay.paymentDate}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-extrabold text-teal-600 dark:text-teal-400 block">{pay.currency}{pay.amount}</span>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Completed</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
