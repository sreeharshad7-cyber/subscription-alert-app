import React, { useState } from 'react';
import { useSubscription } from '../context/SubscriptionContext';
import { ServiceLogo } from './ServiceLogo';
import { CategoryType } from '../types';
import {
  Search,
  Mic,
  MicOff,
  Trash2,
  Check,
  Edit2,
  MoreVertical,
  Plus,
  ArrowUpDown,
  Grid,
  List,
  Sparkles,
  ChevronRight,
  RefreshCw,
  SlidersHorizontal,
  ArrowUpRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SubscriptionsViewProps {
  initialSearchQuery?: string;
}

export const SubscriptionsView: React.FC<SubscriptionsViewProps> = ({ initialSearchQuery = '' }) => {
  const {
    subscriptions,
    deleteSubscription,
    markAsPaid,
    toggleAutoRenew,
    setSelectedSubscriptionForDetail,
    setIsAddModalOpen,
    setEditingSubscription,
    currencySymbol,
  } = useSubscription();

  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | 'All'>('All');
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'name'>('date');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [isListening, setIsListening] = useState(false);
  const [swipedCardId, setSwipedCardId] = useState<string | null>(null);

  const categories: (CategoryType | 'All')[] = ['All','Entertainment','Utilities','Gaming','Education','Cloud','Shopping','Finance','Others'];

  const handleVoiceSearch = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsListening(false);
      window.alert('Voice search is not supported in this browser. Try Chrome or type your search.');
      return;
    }
    if (isListening) return;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    setIsListening(true);
    recognition.onresult = (event: any) => {
      setSearchQuery(event.results?.[0]?.[0]?.transcript || '');
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  const filteredSubscriptions = subscriptions.filter((sub) => {
    const query = searchQuery.toLowerCase();
    const matchesQuery = sub.serviceName.toLowerCase().includes(query) ||
      sub.category.toLowerCase().includes(query) ||
      (sub.notes && sub.notes.toLowerCase().includes(query));
    return matchesQuery && (selectedCategory === 'All' || sub.category === selectedCategory);
  });

  const sortedSubscriptions = [...filteredSubscriptions].sort((a, b) => {
    if (sortBy === 'date') return new Date(a.renewalDate).getTime() - new Date(b.renewalDate).getTime();
    if (sortBy === 'amount') return b.amount - a.amount;
    return a.serviceName.localeCompare(b.serviceName);
  });

  const monthlyEquivalent = (amount: number, cycle: string) => {
    if (cycle === 'Quarterly') return amount / 3;
    if (cycle === 'Half Yearly') return amount / 6;
    if (cycle === 'Yearly') return amount / 12;
    return amount;
  };
  const active = subscriptions.filter((sub) => sub.status === 'active');
  const estimatedMonthly = active.reduce((sum, sub) => sum + monthlyEquivalent(sub.amount, sub.billingCycle), 0);
  const formatAmount = (amount: number) => amount.toLocaleString('en-IN', { maximumFractionDigits: 0 });

  return (
    <div className="space-y-5 pb-28">
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[.2em] ledger-muted font-semibold mb-2">Your recurring commitments</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Subscriptions<span className="text-[#87b85b]">.</span></h2>
          <p className="text-sm ledger-muted mt-2">Every renewal in one place. No surprises at checkout.</p>
        </div>
        <button onClick={() => { setEditingSubscription(null); setIsAddModalOpen(true); }} className="ledger-button-primary inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold">
          <Plus size={16} /> Add subscription
        </button>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="ledger-card p-4"><p className="text-xs ledger-muted">Active plans</p><p className="ledger-mono text-2xl mt-2">{active.length.toString().padStart(2, '0')}</p></div>
        <div className="ledger-card p-4"><p className="text-xs ledger-muted">Monthly equivalent</p><p className="ledger-mono text-2xl mt-2">{currencySymbol}{formatAmount(estimatedMonthly)}</p></div>
        <div className="ledger-card p-4"><p className="text-xs ledger-muted">Showing results</p><p className="ledger-mono text-2xl mt-2">{sortedSubscriptions.length.toString().padStart(2, '0')}<span className="text-sm ledger-muted"> / {subscriptions.length}</span></p></div>
      </section>

      <section className="ledger-card p-3 sm:p-4 space-y-4">
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8a958c]" />
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Find a service, category, or note…" className="w-full pl-10 pr-10 py-3 rounded-xl bg-[#f7f8f3] dark:bg-slate-800 border border-[#e2e5dd] dark:border-slate-700 text-sm text-[#19231f] dark:text-white placeholder:text-[#8a958c] focus:outline-none focus:ring-2 focus:ring-lime-500/40" />
            {searchQuery && <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-xs ledger-muted">Clear</button>}
          </div>
          <div className="flex gap-2">
            <button onClick={handleVoiceSearch} className={`px-3 rounded-xl border flex items-center gap-2 text-xs font-semibold ${isListening ? 'bg-rose-50 border-rose-200 text-rose-600' : 'bg-[#fffefa] border-[#e2e5dd] text-[#657167] hover:bg-[#f5f8ef]'}`} title="Voice search">
              {isListening ? <MicOff size={16} /> : <Mic size={16} />}<span className="hidden sm:inline">{isListening ? 'Listening' : 'Voice'}</span>
            </button>
            <button onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')} className="px-3 rounded-xl border border-[#e2e5dd] bg-[#fffefa] text-[#657167] hover:bg-[#f5f8ef]" title="Toggle layout">{viewMode === 'list' ? <Grid size={17} /> : <List size={17} />}</button>
            <label className="flex items-center gap-2 border border-[#e2e5dd] rounded-xl px-3 bg-[#fffefa] text-xs text-[#657167]">
              <ArrowUpDown size={14} />
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value as 'date' | 'amount' | 'name')} className="bg-transparent py-2.5 outline-none">
                <option value="date">Renewal date</option><option value="amount">Highest amount</option><option value="name">Service name</option>
              </select>
            </label>
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <SlidersHorizontal size={15} className="text-[#849087] shrink-0" />
          {categories.map((cat) => (
            <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-3.5 py-2 rounded-full text-[11px] font-semibold whitespace-nowrap transition-colors shrink-0 ${selectedCategory === cat ? 'bg-[#202b26] text-lime-300' : 'bg-[#f2f4ee] text-[#657167] hover:bg-[#e9eee1]'}`}>{cat}</button>
          ))}
        </div>
        {isListening && <div className="text-xs text-[#557a35] flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-lime-500 animate-pulse" />Listening for a service name…</div>}
      </section>

      {sortedSubscriptions.length === 0 ? (
        <div className="ledger-card p-12 text-center">
          <div className="w-12 h-12 rounded-2xl bg-[#eff7e5] flex items-center justify-center mx-auto text-[#557a35]"><CreditCardFallback /></div>
          <h3 className="font-bold text-lg mt-4">No matching subscriptions</h3>
          <p className="text-sm ledger-muted mt-1">Try another search or add a recurring payment to get started.</p>
          <button onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }} className="mt-4 text-sm font-semibold text-[#557a35]">Clear filters</button>
        </div>
      ) : (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3' : 'ledger-card overflow-hidden divide-y divide-[#edf0e9]'}>
          {sortedSubscriptions.map((sub) => {
            const isOpen = swipedCardId === sub.id;
            const renewal = new Date(`${sub.renewalDate}T00:00:00`);
            const days = Math.ceil((renewal.getTime() - new Date(new Date().toDateString()).getTime()) / 86400000);
            const isOverdue = days < 0 && sub.status === 'active';
            return (
              <motion.article layout key={sub.id} className={`${viewMode === 'grid' ? 'ledger-card p-4' : 'p-4 sm:px-5 sm:py-4'} ${isOpen ? 'bg-[#f4f8ed]' : 'hover:bg-[#fafbf7]'} transition-colors`}>
                <div className="flex items-center gap-3">
                  <button onClick={() => setSelectedSubscriptionForDetail(sub)} className="w-12 h-12 rounded-xl bg-white border border-[#e2e5dd] flex items-center justify-center shrink-0">
                    <ServiceLogo name={sub.serviceName} category={sub.category} logoKey={sub.logo} size="md" />
                  </button>
                  <button onClick={() => setSelectedSubscriptionForDetail(sub)} className="flex-1 min-w-0 text-left">
                    <p className="font-bold text-sm truncate">{sub.serviceName}</p>
                    <p className="text-xs ledger-muted mt-1 truncate">{sub.category} <span className="mx-1">·</span>{sub.billingCycle}{sub.autoRenew ? ' · Auto-renew on' : ' · Auto-renew off'}</p>
                  </button>
                  <div className="text-right shrink-0">
                    <p className="ledger-mono text-sm sm:text-base">{sub.currency || currencySymbol}{formatAmount(sub.amount)}</p>
                    <p className="text-[10px] ledger-muted mt-1">per {sub.billingCycle.toLowerCase().replace('half yearly', '6 months')}</p>
                  </div>
                  <button onClick={() => setSwipedCardId(isOpen ? null : sub.id)} className="p-2 text-[#849087] hover:text-[#19231f]" title="More actions"><MoreVertical size={17} /></button>
                </div>
                <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`ledger-pill inline-flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-1.5 ${isOverdue ? '!bg-[#fff0ec] !text-[#a44b32] !border-[#f0d0c7]' : ''}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${isOverdue ? 'bg-[#d26d51]' : sub.status === 'active' ? 'bg-[#78a94b]' : 'bg-[#9aa39b]'}`} />
                      {isOverdue ? 'Overdue' : sub.status === 'active' ? 'Active' : sub.status}
                    </span>
                    <span className="text-xs ledger-muted flex items-center gap-1.5"><RefreshCw size={12} /> Renews {renewal.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    {days >= 0 && days <= 7 && sub.status === 'active' && <span className="text-[10px] font-semibold text-[#9a6a1e] bg-[#fff4dc] rounded-full px-2.5 py-1">In {days} day{days === 1 ? '' : 's'}</span>}
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <button onClick={() => markAsPaid(sub.id)} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#dce8cf] bg-[#f1f8e8] text-[#4c6e30] text-xs font-semibold hover:bg-[#e5f3d7]"><Check size={14} /> Paid</button>
                    <button onClick={() => { setEditingSubscription(sub); setIsAddModalOpen(true); }} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#e2e5dd] bg-[#fffefa] text-[#657167] text-xs font-semibold hover:bg-[#f2f5ee]"><Edit2 size={14} /> Edit</button>
                    <button onClick={() => toggleAutoRenew(sub.id)} className={`px-3 py-2 rounded-lg border text-xs font-semibold ${sub.autoRenew ? 'border-[#dce8cf] bg-[#f1f8e8] text-[#4c6e30]' : 'border-[#e2e5dd] bg-[#fffefa] text-[#657167]'}`}>{sub.autoRenew ? 'Auto-renew on' : 'Auto-renew off'}</button>
                    <button onClick={() => deleteSubscription(sub.id)} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#f0d7d0] bg-[#fff4f1] text-[#a44b32] text-xs font-semibold hover:bg-[#ffe9e3]"><Trash2 size={14} /> Delete</button>
                  </div>
                </div>
                <AnimatePresence>
                  {isOpen && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden"><div className="mt-4 pt-3 border-t border-[#e2e5dd] flex items-center justify-between text-xs"><span className="ledger-muted">Monthly equivalent: <strong className="ledger-mono text-[#19231f]">{currencySymbol}{formatAmount(monthlyEquivalent(sub.amount, sub.billingCycle))}</strong></span><button onClick={() => setSelectedSubscriptionForDetail(sub)} className="font-semibold text-[#557a35] flex items-center gap-1">Details <ArrowUpRight size={13} /></button></div></motion.div>}
                </AnimatePresence>
              </motion.article>
            );
          })}
        </div>
      )}
    </div>
  );
};

const CreditCardFallback: React.FC = () => <span className="text-xl font-bold">↗</span>;
