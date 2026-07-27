import React from 'react';
import { useSubscription } from '../context/SubscriptionContext';
import { ServiceLogo } from './ServiceLogo';
import {
  X,
  Calendar,
  DollarSign,
  Tag,
  Clock,
  CreditCard,
  Edit2,
  Trash2,
  CheckCircle2,
  ToggleLeft,
  ToggleRight,
  FileText,
  History,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const SubscriptionDetailModal: React.FC = () => {
  const {
    selectedSubscriptionForDetail,
    setSelectedSubscriptionForDetail,
    setEditingSubscription,
    setIsAddModalOpen,
    deleteSubscription,
    markAsPaid,
    toggleAutoRenew,
    payments,
  } = useSubscription();

  if (!selectedSubscriptionForDetail) return null;

  const sub = selectedSubscriptionForDetail;
  const isOverdue = new Date(sub.renewalDate) < new Date();

  const history = payments.filter((p) => p.subscriptionId === sub.id);

  const handleEdit = () => {
    setEditingSubscription(sub);
    setSelectedSubscriptionForDetail(null);
    setIsAddModalOpen(true);
  };

  const handleDelete = () => {
    deleteSubscription(sub.id);
    setSelectedSubscriptionForDetail(null);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] max-w-md w-full p-6 shadow-2xl space-y-5 overflow-hidden relative"
        >
          {/* Close Button */}
          <button
            onClick={() => setSelectedSubscriptionForDetail(null)}
            className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
          >
            <X size={18} />
          </button>

          {/* Hero Header */}
          <div className="flex items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
            <ServiceLogo name={sub.serviceName} category={sub.category} logoKey={sub.logo} size="xl" />
            <div className="min-w-0 flex-1">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-400/30">
                {sub.category}
              </span>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white truncate mt-1">{sub.serviceName}</h3>
              <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                {sub.currency}{sub.amount} <span className="text-xs text-slate-400 font-normal">/ {sub.billingCycle.toLowerCase()}</span>
              </p>
            </div>
          </div>

          {/* Details Table */}
          <div className="bg-slate-50 dark:bg-slate-950/50 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <Calendar size={14} className="text-indigo-600 dark:text-indigo-400" />
                <span>Next Renewal Date</span>
              </span>
              <span className={isOverdue ? 'font-bold text-rose-600 dark:text-rose-400' : 'font-bold text-slate-800 dark:text-slate-200'}>
                {sub.renewalDate} {isOverdue && '(Overdue)'}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <Clock size={14} className="text-amber-500" />
                <span>Reminder Alert</span>
              </span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{sub.reminderDays} Days Before</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <CreditCard size={14} className="text-emerald-600 dark:text-emerald-400" />
                <span>Payment Method</span>
              </span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{sub.paymentMethod}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <Tag size={14} className="text-purple-600 dark:text-purple-400" />
                <span>Auto Renewal</span>
              </span>
              <button
                onClick={() => toggleAutoRenew(sub.id)}
                className={`flex items-center gap-1 font-bold px-2 py-0.5 rounded-lg text-[11px] cursor-pointer ${
                  sub.autoRenew
                    ? 'bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/40'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                }`}
              >
                {sub.autoRenew ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                <span>{sub.autoRenew ? 'ACTIVE' : 'OFF'}</span>
              </button>
            </div>

            {sub.notes && (
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
                <span className="font-bold text-slate-500 dark:text-slate-400 block mb-1">Notes:</span>
                <p className="italic bg-white dark:bg-slate-900/80 p-2 rounded-xl text-[11px] border border-slate-200 dark:border-transparent">{sub.notes}</p>
              </div>
            )}
          </div>

          {/* Payment History Timeline */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <History size={14} className="text-indigo-600 dark:text-indigo-400" />
              <span>Payment History</span>
            </h4>

            {history.length === 0 ? (
              <p className="text-xs text-slate-400 dark:text-slate-500 italic p-2 bg-slate-50 dark:bg-slate-950/30 rounded-xl">
                No past payment logs recorded yet.
              </p>
            ) : (
              <div className="max-h-32 overflow-y-auto space-y-1.5 divide-y divide-slate-100 dark:divide-slate-800/60 bg-slate-50 dark:bg-slate-950/40 p-2 rounded-2xl border border-slate-200 dark:border-slate-800">
                {history.map((h) => (
                  <div key={h.id} className="pt-1.5 flex items-center justify-between text-xs">
                    <span className="text-slate-700 dark:text-slate-300 flex items-center gap-1">
                      <CheckCircle2 size={12} className="text-emerald-600 dark:text-emerald-400" />
                      <span>{h.paymentDate}</span>
                    </span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      {h.currency}{h.amount}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-3 gap-2 pt-2">
            <button
              onClick={() => markAsPaid(sub.id)}
              className="py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs flex items-center justify-center gap-1 transition-all cursor-pointer shadow-sm"
            >
              <CheckCircle2 size={16} />
              <span>Mark Paid</span>
            </button>

            <button
              onClick={handleEdit}
              className="py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-1 transition-all cursor-pointer shadow-sm"
            >
              <Edit2 size={16} />
              <span>Edit</span>
            </button>

            <button
              onClick={handleDelete}
              className="py-2.5 rounded-2xl bg-rose-50 dark:bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-500/30 hover:bg-rose-600 hover:text-white font-bold text-xs flex items-center justify-center gap-1 transition-all cursor-pointer"
            >
              <Trash2 size={16} />
              <span>Delete</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
