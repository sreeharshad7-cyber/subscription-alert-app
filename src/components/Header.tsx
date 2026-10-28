import React, { useState } from 'react';
import { useSubscription } from '../context/SubscriptionContext';
import {
  Bell,
  Sparkles,
  Search,
  ScanLine,
  Smartphone,
  Maximize2,
  Moon,
  Sun,
  Code2,
  RefreshCw,
  Wallet,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HeaderProps {
  onOpenAuth: () => void;
  onOpenAiModal: () => void;
  onOpenSearch: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenAuth, onOpenAiModal, onOpenSearch }) => {
  const {
    user,
    notifications,
    currencySymbol,
    setCurrencySymbol,
    darkMode,
    toggleDarkMode,
    deviceFrameMode,
    toggleDeviceFrameMode,
    isSyncing,
    syncCloud,
    setIsOcrModalOpen,
    setIsFlutterCodeDrawerOpen,
    markNotificationRead,
  } = useSubscription();

  const [showNotificationsDropdown, setShowNotificationsDropdown] = useState(false);
  const unreadCount = notifications.filter((n) => n.status === 'unread').length;

  return (
    <header className="sticky top-0 z-30 bg-[#fffefa]/90 dark:bg-slate-900/90 text-[#19231f] dark:text-white backdrop-blur-xl border-b border-[#e2e5dd] dark:border-slate-800 transition-colors">
      <div className={`mx-auto px-4 sm:px-6 ${deviceFrameMode ? 'max-w-7xl' : 'max-w-[1440px]'} py-3.5 flex items-center justify-between gap-3`}>
        <div className="flex items-center gap-3 min-w-0">
          <button onClick={onOpenAuth} className="relative shrink-0 focus:outline-none focus:ring-2 focus:ring-lime-500 rounded-xl" title="User account">
            {user.photo ? (
              <img src={user.photo} alt={user.name} className="w-10 h-10 rounded-xl object-cover" />
            ) : (
              <span className="w-10 h-10 rounded-xl bg-[#202b26] text-lime-300 flex items-center justify-center font-bold text-sm">{(user.name || 'G').slice(0,1).toUpperCase()}</span>
            )}
            {user.isGuest && <span className="absolute -bottom-1 -right-1 bg-lime-300 text-[8px] font-bold px-1 py-0.5 rounded text-[#19231f]">GUEST</span>}
          </button>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-lg sm:text-xl tracking-[-.06em] text-[#19231f] dark:text-white">ledger<span className="text-[#79a64e]">.</span></h1>
              <span className="hidden sm:inline text-[9px] uppercase tracking-[.17em] border border-[#dfe5d7] rounded-full px-2 py-1 text-[#748078]">Subscription control</span>
            </div>
            <p className="text-[11px] text-[#748078] dark:text-slate-400 truncate">Good to see you, {user.name.split(' ')[0]}.</p>
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <button onClick={onOpenAiModal} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#eaf6da] hover:bg-[#dff0c6] text-[#405c2b] text-xs font-bold transition-colors" title="AI spending insights">
            <Sparkles size={15} /><span className="hidden lg:inline">Money insights</span>
          </button>
          <button onClick={() => setIsOcrModalOpen(true)} className="p-2.5 rounded-xl hover:bg-[#f0f3ec] dark:hover:bg-slate-800 text-[#637068] dark:text-slate-300 transition-colors" title="Scan receipt"><ScanLine size={18} /></button>
          <button onClick={onOpenSearch} className="p-2.5 rounded-xl hover:bg-[#f0f3ec] dark:hover:bg-slate-800 text-[#637068] dark:text-slate-300 transition-colors" title="Search subscriptions"><Search size={18} /></button>

          <select value={currencySymbol} onChange={(e) => setCurrencySymbol(e.target.value)} className="bg-transparent border border-[#e2e5dd] dark:border-slate-700 text-[#4d5a50] dark:text-slate-200 text-xs rounded-xl px-2 py-2 font-semibold focus:outline-none focus:ring-1 focus:ring-lime-500 cursor-pointer" title="Currency">
            <option value="₹">₹ INR</option><option value="$">$ USD</option><option value="€">€ EUR</option><option value="£">£ GBP</option>
          </select>

          <div className="relative">
            <button onClick={() => setShowNotificationsDropdown(!showNotificationsDropdown)} className="p-2.5 rounded-xl hover:bg-[#f0f3ec] dark:hover:bg-slate-800 text-[#637068] dark:text-slate-300 relative transition-colors" title="Notifications">
              <Bell size={18} />
              {unreadCount > 0 && <span className="absolute top-1 right-1 min-w-4 h-4 px-1 bg-[#d26d51] text-white text-[9px] font-bold rounded-full flex items-center justify-center">{unreadCount}</span>}
            </button>
            <AnimatePresence>
              {showNotificationsDropdown && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} className="absolute right-0 mt-2 w-[min(20rem,calc(100vw-2rem))] bg-[#fffefa] dark:bg-slate-900 border border-[#e2e5dd] dark:border-slate-800 rounded-2xl shadow-xl z-50 overflow-hidden">
                  <div className="p-4 border-b border-[#e2e5dd] dark:border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2"><Bell size={15} /><h3 className="text-sm font-bold">Inbox</h3></div>
                    <span className="text-[10px] uppercase tracking-wider text-[#748078]">{unreadCount} unread</span>
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-[#edf0e9] dark:divide-slate-800">
                    {notifications.length === 0 ? <p className="p-5 text-xs text-[#748078] text-center">All quiet. Nothing to see yet.</p> : notifications.map((notif) => (
                      <button key={notif.id} onClick={() => markNotificationRead(notif.id)} className={`w-full text-left p-4 text-xs transition-colors hover:bg-[#f5f7f0] dark:hover:bg-slate-800 ${notif.status === 'unread' ? 'bg-[#f4f8ed] dark:bg-slate-800/70' : 'opacity-70'}`}>
                        <span className="flex items-center justify-between gap-2 font-bold mb-1"><span>{notif.serviceName}</span><span className="text-[10px] text-[#748078] font-normal">{notif.notificationDate}</span></span>
                        <span className="block text-[#68736b] dark:text-slate-300 leading-relaxed">{notif.message}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <button onClick={() => syncCloud()} disabled={isSyncing} className="p-2.5 rounded-xl hover:bg-[#f0f3ec] dark:hover:bg-slate-800 text-[#637068] dark:text-slate-300 transition-colors" title="Sync"><RefreshCw size={17} className={isSyncing ? 'animate-spin text-lime-600' : ''} /></button>
          <button onClick={() => setIsFlutterCodeDrawerOpen(true)} className="hidden sm:flex p-2.5 rounded-xl hover:bg-[#f0f3ec] dark:hover:bg-slate-800 text-[#637068] dark:text-slate-300" title="Code structure"><Code2 size={17} /></button>
          <button onClick={toggleDeviceFrameMode} className="hidden sm:flex p-2.5 rounded-xl hover:bg-[#f0f3ec] dark:hover:bg-slate-800 text-[#637068] dark:text-slate-300" title={deviceFrameMode ? 'Switch to desktop layout' : 'Switch to mobile frame'}>{deviceFrameMode ? <Maximize2 size={17} /> : <Smartphone size={17} />}</button>
          <button onClick={toggleDarkMode} className="p-2.5 rounded-xl hover:bg-[#f0f3ec] dark:hover:bg-slate-800 text-[#637068] dark:text-slate-300" title="Toggle theme">{darkMode ? <Sun size={17} /> : <Moon size={17} />}</button>
        </div>
      </div>
    </header>
  );
};
