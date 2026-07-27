import React, { useState } from 'react';
import { useSubscription } from '../context/SubscriptionContext';
import { ServiceLogo } from './ServiceLogo';
import { CategoryType, Subscription } from '../types';
import {
  Search,
  Mic,
  MicOff,
  Filter,
  Trash2,
  Check,
  Edit2,
  MoreVertical,
  Plus,
  ArrowUpDown,
  Grid,
  List,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  ChevronRight,
  RefreshCw,
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

  const categories: (CategoryType | 'All')[] = [
    'All',
    'Entertainment',
    'Utilities',
    'Gaming',
    'Education',
    'Cloud',
    'Shopping',
    'Finance',
    'Others',
  ];

  // Voice search simulation
  const handleVoiceSearch = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }
    setIsListening(true);
    // Simulate speech recognition result after 2 seconds
    setTimeout(() => {
      const presets = ['Spotify', 'Netflix', 'Cloud', 'Education', 'Monthly'];
      const randomMatch = presets[Math.floor(Math.random() * presets.length)];
      setSearchQuery(randomMatch);
      setIsListening(false);
    }, 2000);
  };

  // Filtering & Sorting logic
  const filteredSubscriptions = subscriptions.filter((sub) => {
    const matchesQuery =
      sub.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (sub.notes && sub.notes.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'All' || sub.category === selectedCategory;

    return matchesQuery && matchesCategory;
  });

  const sortedSubscriptions = [...filteredSubscriptions].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(a.renewalDate).getTime() - new Date(b.renewalDate).getTime();
    }
    if (sortBy === 'amount') {
      return b.amount - a.amount;
    }
    return a.serviceName.localeCompare(b.serviceName);
  });

  return (
    <div className="space-y-4 pb-24">
      {/* Search Bar & Voice Search */}
      <div className="relative flex items-center gap-2">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search subscriptions, category, notes..."
            className="w-full pl-10 pr-10 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              Clear
            </button>
          )}
        </div>

        {/* Voice Search Button */}
        <button
          onClick={handleVoiceSearch}
          className={`p-3 rounded-2xl border transition-all cursor-pointer shadow-sm ${
            isListening
              ? 'bg-rose-500 text-white border-rose-400 animate-pulse'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400'
          }`}
          title="Voice Search"
        >
          {isListening ? <MicOff size={18} /> : <Mic size={18} />}
        </button>

        {/* Grid / List Layout Switcher */}
        <button
          onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
          className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 shadow-sm transition-all cursor-pointer"
          title="Toggle Grid / List View"
        >
          {viewMode === 'list' ? <Grid size={18} /> : <List size={18} />}
        </button>
      </div>

      {isListening && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-700/50 text-indigo-700 dark:text-indigo-300 p-2.5 rounded-xl flex items-center justify-between"
        >
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-400 animate-ping" />
            Listening... Say "Spotify", "Netflix", "Utilities"...
          </span>
          <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold">Voice AI Active</span>
        </motion.div>
      )}

      {/* Category Pills Slider */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
              selectedCategory === cat
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-none'
                : 'bg-white dark:bg-slate-900/80 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Sorting & Filter Header bar */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
        <span>Showing {sortedSubscriptions.length} subscriptions</span>
        <div className="flex items-center gap-1.5">
          <ArrowUpDown size={14} className="text-indigo-600 dark:text-indigo-400" />
          <span>Sort by:</span>
          <select
            value={sortBy}
            onChange={(e: any) => setSortBy(e.target.value)}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-xs rounded-xl px-2 py-1 focus:outline-none cursor-pointer shadow-sm"
          >
            <option value="date">Renewal Date</option>
            <option value="amount">Amount (High to Low)</option>
            <option value="name">Service Name</option>
          </select>
        </div>
      </div>

      {/* Tip Banner */}
      <div className="p-2.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/40 text-[11px] text-indigo-700 dark:text-indigo-300 flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <Sparkles size={13} className="text-indigo-600 dark:text-indigo-400" />
          <span>Tip: Tap any subscription for details or swipe buttons to manage quickly!</span>
        </span>
      </div>

      {/* Subscriptions List / Grid */}
      {sortedSubscriptions.length === 0 ? (
        <div className="p-10 text-center rounded-[2rem] bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
            <Search size={24} />
          </div>
          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">No subscriptions found</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
            Try adjusting your search filter or add a new subscription.
          </p>
          <button
            onClick={() => {
              setEditingSubscription(null);
              setIsAddModalOpen(true);
            }}
            className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-md hover:bg-indigo-700 cursor-pointer"
          >
            Add New Subscription
          </button>
        </div>
      ) : (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-3' : 'space-y-3'}>
          {sortedSubscriptions.map((sub) => {
            const isOverdue = new Date(sub.renewalDate) < new Date();

            return (
              <motion.div
                key={sub.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="group relative overflow-hidden rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 shadow-sm hover:shadow-md transition-all"
              >
                <div className="p-4 flex items-center justify-between gap-3">
                  {/* Left: Logo & Info */}
                  <div
                    onClick={() => setSelectedSubscriptionForDetail(sub)}
                    className="flex items-center gap-3.5 cursor-pointer min-w-0 flex-1"
                  >
                    <ServiceLogo name={sub.serviceName} category={sub.category} logoKey={sub.logo} size="lg" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors">
                          {sub.serviceName}
                        </h4>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {sub.category}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
                        <span className="font-bold text-indigo-600 dark:text-indigo-400 text-sm">
                          {sub.currency}{sub.amount}
                        </span>
                        <span>•</span>
                        <span className="capitalize">{sub.billingCycle}</span>
                        <span>•</span>
                        <span className={isOverdue ? 'text-rose-600 dark:text-rose-400 font-bold' : 'text-amber-600 dark:text-amber-400 font-medium'}>
                          {isOverdue ? 'Overdue!' : `Next: ${sub.renewalDate}`}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Quick Action Controls */}
                  <div className="flex items-center gap-2 shrink-0">
                    {/* Auto Renewal Toggle */}
                    <button
                      onClick={() => toggleAutoRenew(sub.id)}
                      className={`flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-xl border transition-all cursor-pointer ${
                        sub.autoRenew
                          ? 'bg-emerald-50 dark:bg-emerald-500/15 border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400'
                          : 'bg-slate-100 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400'
                      }`}
                      title="Toggle Auto Renewal"
                    >
                      {sub.autoRenew ? <ToggleRight size={16} className="text-emerald-600 dark:text-emerald-400" /> : <ToggleLeft size={16} />}
                      <span className="hidden sm:inline">{sub.autoRenew ? 'Auto' : 'Manual'}</span>
                    </button>

                    {/* Mark as Paid */}
                    <button
                      onClick={() => markAsPaid(sub.id)}
                      className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30 hover:bg-emerald-500 hover:text-white transition-all cursor-pointer"
                      title="Mark as Paid"
                    >
                      <Check size={16} className="stroke-[2.5]" />
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => deleteSubscription(sub.id)}
                      className="p-2 rounded-xl bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20 hover:bg-rose-500 hover:text-white transition-all cursor-pointer"
                      title="Delete Subscription"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};
