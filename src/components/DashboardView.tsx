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
  ChevronRight,
  Plus,
  CalendarDays,
  ArrowUpRight,
  CircleDollarSign,
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

  const activeSubs = subscriptions.filter((s) => s.status === 'active');
  const activeCount = activeSubs.length;

  const toMonthly = (amount: number, cycle: string) => {
    if (cycle === 'Quarterly') return amount / 3;
    if (cycle === 'Half Yearly') return amount / 6;
    if (cycle === 'Yearly') return amount / 12;
    return amount;
  };

  const totalMonthly = activeSubs.reduce((sum, sub) => sum + toMonthly(sub.amount, sub.billingCycle), 0);
  const totalYearly = totalMonthly * 12;
  const budgetExceeded = totalMonthly > budget.monthlyBudget;
  const budgetPercentage = budget.monthlyBudget > 0
    ? Math.round((totalMonthly / budget.monthlyBudget) * 100)
    : 0;
  const budgetBarWidth = Math.min(budgetPercentage, 100);

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const next7Days = new Date(startOfToday);
  next7Days.setDate(next7Days.getDate() + 7);

  const billsDueThisWeek = activeSubs.filter((sub) => {
    const renewal = new Date(`${sub.renewalDate}T00:00:00`);
    return renewal >= startOfToday && renewal <= next7Days;
  }).sort((a, b) => new Date(a.renewalDate).getTime() - new Date(b.renewalDate).getTime());

  const upcomingPayments = [...activeSubs].sort(
    (a, b) => new Date(a.renewalDate).getTime() - new Date(b.renewalDate).getTime()
  );
  const recentlyPaid = [...payments].slice(0, 5);

  const formatted = (value: number) => value.toLocaleString('en-IN', { maximumFractionDigits: 0 });

  return (
    <div className="space-y-6 pb-28">
      <section className="grid grid-cols-1 xl:grid-cols-[1.6fr_.8fr] gap-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="ledger-banner relative overflow-hidden p-6 sm:p-8"
        >
          <div className="pointer-events-none absolute -right-10 -top-16 w-72 h-72 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute -right-1 -top-7 w-52 h-52 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute right-12 top-10 w-24 h-24 rounded-full bg-lime-300/10 blur-2xl" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[.2em] text-white/60 font-semibold mb-7">
              <span className="h-2 w-2 rounded-full bg-lime-300" />
              Your money, on autopilot
            </div>
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
              <div>
                <p className="text-sm text-white/60 mb-2">Expected recurring spend / month</p>
                <h2 className="ledger-mono text-4xl sm:text-6xl font-medium tracking-tight">
                  <span className="text-lime-300">{currencySymbol}</span>{formatted(totalMonthly)}
                </h2>
                <p className="mt-4 text-sm text-white/65">
                  That's <span className="ledger-accent font-semibold">{currencySymbol}{formatted(totalYearly)}</span> across a full year.
                </p>
              </div>
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => { setEditingSubscription(null); setIsAddModalOpen(true); }}
                  className="ledger-button-primary flex items-center gap-2 px-4 py-3 text-sm font-bold transition-transform active:scale-[.98]"
                >
                  <Plus size={17} /> Add a bill
                </button>
                <button
                  onClick={onOpenAiModal}
                  className="flex items-center gap-2 px-4 py-3 rounded-xl border border-white/15 bg-white/[.06] hover:bg-white/[.1] text-white text-sm font-semibold transition-colors"
                >
                  <Sparkles size={16} className="text-lime-300" /> Ask Ledger AI
                </button>
              </div>
            </div>
            <div className="mt-8 pt-5 border-t border-white/10">
              <div className="flex items-center justify-between gap-3 mb-2 text-xs">
                <span className="flex items-center gap-2 text-white/65"><Wallet size={15} /> Monthly budget · {currencySymbol}{formatted(budget.monthlyBudget)}</span>
                <span className={budgetExceeded ? 'font-bold text-amber-300' : 'font-semibold text-lime-300'}>{budgetPercentage}% used</span>
              </div>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${budgetBarWidth}%` }}
                  transition={{ duration: .7, ease: 'easeOut' }}
                  className={`h-full rounded-full ${budgetExceeded ? 'bg-amber-300' : 'bg-lime-300'}`}
                />
              </div>
              {budgetExceeded && (
                <div className="mt-3 flex items-center gap-2 text-xs text-amber-200">
                  <AlertTriangle size={14} />
                  Over budget by {currencySymbol}{formatted(totalMonthly - budget.monthlyBudget)} this month.
                </div>
              )}
            </div>
          </div>
        </motion.div>

        <div className="ledger-card p-5 sm:p-6 flex flex-col justify-between gap-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[.18em] ledger-muted font-semibold">Next on the calendar</p>
              <h3 className="mt-2 text-lg font-bold">Renewal queue</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#f0f5e8] flex items-center justify-center text-[#516a41]">
              <CalendarDays size={19} />
            </div>
          </div>
          {upcomingPayments.length ? (
            <div className="space-y-4">
              {upcomingPayments.slice(0, 3).map((sub, index) => (
                <button key={sub.id} onClick={() => setSelectedSubscriptionForDetail(sub)} className="w-full flex items-center gap-3 text-left group">
                  <div className="w-10 h-10 rounded-xl border border-[#e2e5dd] bg-white flex items-center justify-center shrink-0">
                    <ServiceLogo name={sub.serviceName} category={sub.category} logoKey={sub.logo} size="sm" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold truncate group-hover:text-[#577d36] transition-colors">{sub.serviceName}</p>
                    <p className="text-[11px] ledger-muted mt-0.5">{index === 0 ? 'Coming up next' : new Date(`${sub.renewalDate}T00:00:00`).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="ledger-mono text-sm">{sub.currency || currencySymbol}{formatted(sub.amount)}</p>
                    <p className="text-[10px] ledger-muted">{sub.billingCycle}</p>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="py-6 text-center text-sm ledger-muted">No active renewals. Add your first subscription.</div>
          )}
          <button onClick={() => setActiveTab('subscriptions')} className="flex items-center justify-between w-full pt-4 border-t ledger-rule text-sm font-semibold hover:text-[#577d36] transition-colors">
            All subscriptions <ArrowUpRight size={16} />
          </button>
        </div>
      </section>

      <section className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        <div className="ledger-card p-4 sm:p-5">
          <div className="flex items-center justify-between text-[#748078]"><span className="text-xs font-medium">Active services</span><CreditCard size={17} /></div>
          <p className="ledger-mono text-3xl mt-4">{activeCount.toString().padStart(2, '0')}</p>
          <p className="text-[11px] ledger-muted mt-2">Recurring commitments</p>
        </div>
        <div className="ledger-card p-4 sm:p-5">
          <div className="flex items-center justify-between text-[#748078]"><span className="text-xs font-medium">Due in 7 days</span><Clock size={17} /></div>
          <p className="ledger-mono text-3xl mt-4">{billsDueThisWeek.length.toString().padStart(2, '0')}</p>
          <p className="text-[11px] ledger-muted mt-2">Renewals to keep an eye on</p>
        </div>
        <div className="ledger-card p-4 sm:p-5">
          <div className="flex items-center justify-between text-[#748078]"><span className="text-xs font-medium">Annual projection</span><TrendingUp size={17} /></div>
          <p className="ledger-mono text-2xl mt-4">{currencySymbol}{formatted(totalYearly)}</p>
          <p className="text-[11px] ledger-muted mt-2">Based on active plans</p>
        </div>
        <div className="ledger-card p-4 sm:p-5">
          <div className="flex items-center justify-between text-[#748078]"><span className="text-xs font-medium">Payments recorded</span><CheckCircle2 size={17} /></div>
          <p className="ledger-mono text-3xl mt-4">{payments.length.toString().padStart(2, '0')}</p>
          <p className="text-[11px] ledger-muted mt-2">History in this workspace</p>
        </div>
      </section>

      {aiSuggestions.length > 0 && (
        <section className="ledger-card p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#eff8df] text-[#557a35] flex items-center justify-center shrink-0"><Sparkles size={19} /></div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-[10px] uppercase tracking-[.18em] ledger-muted font-semibold">A note from your money assistant</p>
                  {aiSuggestions[0].potentialSavings > 0 && <span className="ledger-pill text-[10px] px-2 py-1 font-semibold">Potential save {currencySymbol}{formatted(aiSuggestions[0].potentialSavings)}</span>}
                </div>
                <h3 className="text-base font-bold mt-1.5">{aiSuggestions[0].title}</h3>
                <p className="text-sm ledger-muted mt-1 max-w-3xl leading-relaxed">{aiSuggestions[0].message}</p>
              </div>
            </div>
            <button onClick={onOpenAiModal} className="shrink-0 flex items-center gap-2 text-sm font-semibold hover:text-[#557a35]">
              Read insight <ArrowRight size={15} />
            </button>
          </div>
        </section>
      )}

      <section className="grid grid-cols-1 xl:grid-cols-[1.1fr_.9fr] gap-4">
        <div className="ledger-card overflow-hidden">
          <div className="p-5 flex items-center justify-between border-b ledger-rule">
            <div>
              <p className="text-[10px] uppercase tracking-[.18em] ledger-muted font-semibold">Upcoming obligations</p>
              <h3 className="text-lg font-bold mt-1">Due this week</h3>
            </div>
            <button onClick={() => setActiveTab('calendar')} className="text-xs font-semibold flex items-center gap-1.5 hover:text-[#557a35]">Open calendar <ChevronRight size={15} /></button>
          </div>
          {billsDueThisWeek.length === 0 ? (
            <div className="p-8 text-center">
              <div className="mx-auto mb-3 w-10 h-10 rounded-full bg-[#f0f5e8] flex items-center justify-center text-[#557a35]"><CheckCircle2 size={19} /></div>
              <p className="text-sm font-semibold">Nothing due this week</p>
              <p className="text-xs ledger-muted mt-1">A rare quiet week for your wallet.</p>
            </div>
          ) : (
            <div className="divide-y divide-[#edf0e9]">
              {billsDueThisWeek.map((sub) => (
                <div key={sub.id} className="p-4 flex items-center gap-3 hover:bg-[#f7f9f2] transition-colors">
                  <button onClick={() => setSelectedSubscriptionForDetail(sub)} className="flex items-center gap-3 flex-1 min-w-0 text-left">
                    <ServiceLogo name={sub.serviceName} category={sub.category} logoKey={sub.logo} size="md" />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate">{sub.serviceName}</p>
                      <p className="text-xs ledger-muted mt-1">{new Date(`${sub.renewalDate}T00:00:00`).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })} · {sub.billingCycle}</p>
                    </div>
                  </button>
                  <p className="ledger-mono text-sm shrink-0">{sub.currency || currencySymbol}{formatted(sub.amount)}</p>
                  <button onClick={() => markAsPaid(sub.id)} className="shrink-0 px-3 py-2 rounded-lg bg-[#edf7df] text-[#45672c] text-xs font-semibold hover:bg-[#dff0c6] transition-colors">Paid</button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="ledger-card overflow-hidden">
          <div className="p-5 flex items-center justify-between border-b ledger-rule">
            <div>
              <p className="text-[10px] uppercase tracking-[.18em] ledger-muted font-semibold">Recent activity</p>
              <h3 className="text-lg font-bold mt-1">Payment history</h3>
            </div>
            <div className="w-9 h-9 rounded-xl bg-[#f0f5e8] text-[#557a35] flex items-center justify-center"><CircleDollarSign size={18} /></div>
          </div>
          {recentlyPaid.length === 0 ? (
            <p className="p-6 text-sm ledger-muted">Payments you record will appear here.</p>
          ) : (
            <div className="divide-y divide-[#edf0e9]">
              {recentlyPaid.map((payment) => (
                <div key={payment.id} className="p-4 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#f1f5ed] flex items-center justify-center text-[#557a35]"><CheckCircle2 size={17} /></div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold truncate">{payment.serviceName}</p>
                    <p className="text-xs ledger-muted mt-1">{new Date(`${payment.paymentDate}T00:00:00`).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                  </div>
                  <div className="text-right">
                    <p className="ledger-mono text-sm">{payment.currency || currencySymbol}{formatted(payment.amount)}</p>
                    <span className="text-[10px] text-[#64854b]">Recorded</span>
                  </div>
                </div>
              ))}
            </div>
          )}
          <button onClick={() => setActiveTab('analytics')} className="w-full p-4 border-t ledger-rule flex items-center justify-between text-xs font-semibold hover:text-[#557a35]">
            Review spending <ArrowUpRight size={15} />
          </button>
        </div>
      </section>
    </div>
  );
};
