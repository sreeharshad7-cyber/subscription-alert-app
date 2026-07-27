import React from 'react';
import { useSubscription } from '../context/SubscriptionContext';
import {
  LayoutDashboard,
  CreditCard,
  Calendar,
  PieChart,
  Settings,
  Plus,
} from 'lucide-react';
import { motion } from 'motion/react';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, setIsAddModalOpen, setEditingSubscription } = useSubscription();

  const navItems = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'subscriptions', label: 'Subscriptions', icon: CreditCard },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'analytics', label: 'Analytics', icon: PieChart },
    { id: 'settings', label: 'Settings', icon: Settings },
  ] as const;

  const handleOpenAdd = () => {
    setEditingSubscription(null);
    setIsAddModalOpen(true);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 max-w-7xl mx-auto px-2 pb-2 pointer-events-none">
      <div className="pointer-events-auto bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200 dark:border-slate-800/90 shadow-xl shadow-indigo-950/10 dark:shadow-none rounded-3xl p-2 flex items-center justify-around relative transition-colors">
        {/* Nav Items */}
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          // Insert floating plus button between Calendar and Analytics or near center
          if (index === 2) {
            return (
              <React.Fragment key="center_plus_nav">
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl relative transition-all duration-200 ${
                    isActive
                      ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTabIndicator"
                      className="absolute inset-0 bg-indigo-50 dark:bg-indigo-500/15 border border-indigo-200 dark:border-indigo-500/30 rounded-2xl"
                      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                    />
                  )}
                  <Icon size={20} className={isActive ? 'scale-110 text-indigo-600 dark:text-indigo-400' : ''} />
                  <span className="text-[10px] mt-1 tracking-tight">{item.label}</span>
                </button>

                {/* Floating Add Button */}
                <div className="relative -top-5 mx-1" key="floating_fab">
                  <motion.button
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
                    onClick={handleOpenAdd}
                    className="w-13 h-13 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl shadow-indigo-300 dark:shadow-indigo-600/30 border-2 border-white dark:border-indigo-400/40 flex items-center justify-center cursor-pointer transition-shadow"
                    title="Add Subscription"
                  >
                    <Plus size={28} className="stroke-[2.5]" />
                  </motion.button>
                </div>
              </React.Fragment>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl relative transition-all duration-200 ${
                isActive
                  ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute inset-0 bg-indigo-50 dark:bg-indigo-500/15 border border-indigo-200 dark:border-indigo-500/30 rounded-2xl"
                  transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                />
              )}
              <Icon size={20} className={isActive ? 'scale-110 text-indigo-600 dark:text-indigo-400' : ''} />
              <span className="text-[10px] mt-1 tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
