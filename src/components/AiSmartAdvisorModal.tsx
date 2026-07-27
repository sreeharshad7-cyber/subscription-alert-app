import React from 'react';
import { useSubscription } from '../context/SubscriptionContext';
import { Sparkles, X, RefreshCw, TrendingDown, AlertTriangle, ShieldCheck, ArrowRight, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AiSmartAdvisorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AiSmartAdvisorModal: React.FC<AiSmartAdvisorModalProps> = ({ isOpen, onClose }) => {
  const { aiSuggestions, isAiLoading, refreshAiSuggestions, currencySymbol, subscriptions, budget } = useSubscription();

  if (!isOpen) return null;

  // Compute total potential savings from suggestions
  const totalPotentialSavings = aiSuggestions.reduce((acc, curr) => acc + (curr.potentialSavings || 0), 0);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-emerald-500/40 rounded-[2rem] max-w-lg w-full p-6 shadow-2xl space-y-5 my-auto max-h-[90vh] overflow-y-auto relative"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-indigo-500 text-white flex items-center justify-center font-bold shadow-md shadow-emerald-500/30">
                <Sparkles size={22} className="animate-pulse" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>AI Smart Advisor</span>
                  <span className="text-[10px] bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                    Gemini 3.6
                  </span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Personalized subscription audit & savings engine</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Savings Highlight Banner */}
          <div className="p-4 rounded-2xl bg-slate-900 text-white border border-slate-800 flex items-center justify-between shadow-md">
            <div>
              <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">
                Total Annual Potential Savings
              </span>
              <p className="text-2xl font-black text-white mt-0.5">
                {currencySymbol}{totalPotentialSavings.toLocaleString()}
              </p>
              <p className="text-[10px] text-slate-300">Based on active plan analysis & usage flags</p>
            </div>

            <button
              onClick={refreshAiSuggestions}
              disabled={isAiLoading}
              className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
            >
              <RefreshCw size={14} className={isAiLoading ? 'animate-spin' : ''} />
              <span>{isAiLoading ? 'Analyzing...' : 'Re-analyze'}</span>
            </button>
          </div>

          {/* AI Suggestions Cards */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Zap size={14} className="text-amber-500" />
              <span>Intelligent Recommendations</span>
            </h4>

            {aiSuggestions.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ y: -2 }}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/40 transition-all space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {item.type === 'warning' ? (
                      <AlertTriangle size={16} className="text-rose-500" />
                    ) : item.type === 'savings' ? (
                      <TrendingDown size={16} className="text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <ShieldCheck size={16} className="text-indigo-600 dark:text-indigo-400" />
                    )}
                    <h5 className="text-sm font-bold text-slate-900 dark:text-slate-100">{item.title}</h5>
                  </div>

                  {item.potentialSavings > 0 && (
                    <span className="text-xs font-extrabold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 px-2 py-0.5 rounded-full">
                      Save {currencySymbol}{item.potentialSavings}
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{item.message}</p>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">
                    {item.type} recommendation
                  </span>
                  <button
                    onClick={onClose}
                    className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 flex items-center gap-1 cursor-pointer"
                  >
                    <span>{item.actionText}</span>
                    <ArrowRight size={12} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
