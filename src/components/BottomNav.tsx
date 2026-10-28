import React from 'react';
import { useSubscription } from '../context/SubscriptionContext';
import { LayoutDashboard, CreditCard, CalendarDays, ChartNoAxesCombined, Settings2, Plus } from 'lucide-react';
import { motion } from 'motion/react';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, setIsAddModalOpen, setEditingSubscription, deviceFrameMode } = useSubscription();

  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'subscriptions', label: 'Services', icon: CreditCard },
    { id: 'calendar', label: 'Renewals', icon: CalendarDays },
    { id: 'analytics', label: 'Insights', icon: ChartNoAxesCombined },
    { id: 'settings', label: 'Settings', icon: Settings2 },
  ] as const;

  const handleOpenAdd = () => {
    setEditingSubscription(null);
    setIsAddModalOpen(true);
  };

  return (
    <div className={`fixed bottom-0 left-0 right-0 z-40 mx-auto px-3 pb-3 pointer-events-none ${deviceFrameMode ? 'max-w-md' : 'max-w-[600px]'}`}>
      <div className="ledger-nav pointer-events-auto rounded-2xl p-2 flex items-center justify-around relative">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <React.Fragment key={item.id}>
              {index === 2 && (
                <button onClick={handleOpenAdd} className="relative -top-4 mx-1 shrink-0 w-11 h-11 rounded-xl bg-[#baf36a] text-[#24391b] border-[3px] border-[#f5f5f0] shadow-sm flex items-center justify-center hover:bg-[#cff89c] active:scale-95 transition-all" title="Add subscription">
                  <Plus size={21} strokeWidth={2.5} />
                </button>
              )}
              <button
                onClick={() => setActiveTab(item.id)}
                className={`relative z-10 flex-1 max-w-[100px] flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-colors ${isActive ? 'text-[#283b20]' : 'text-[#849087] hover:text-[#19231f]'}`}
              >
                {isActive && <motion.span layoutId="activeTabIndicator" className="absolute inset-0 rounded-xl bg-[#eff7e5]" transition={{ type: 'spring', stiffness: 350, damping: 28 }} />}
                <Icon size={18} className={`relative ${isActive ? 'text-[#597c3b]' : ''}`} />
                <span className={`relative text-[9px] mt-1 tracking-wide ${isActive ? 'font-bold' : 'font-medium'}`}>{item.label}</span>
              </button>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
