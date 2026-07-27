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
  CloudCheck,
  RefreshCw,
  UserCheck,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HeaderProps {
  onOpenAuth: () => void;
  onOpenAiModal: () => void;
  onOpenSearch: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenAuth,
  onOpenAiModal,
  onOpenSearch,
}) => {
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
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-white shadow-sm backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-2">
        {/* Left: App Logo & User Greeting */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenAuth}
            className="relative group focus:outline-none focus:ring-2 focus:ring-indigo-400 rounded-full"
            title="User Account"
          >
            <img
              src={user.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'}
              alt={user.name}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/80 shadow-md transition-transform group-hover:scale-105"
            />
            {user.isGuest && (
              <span className="absolute -bottom-1 -right-1 bg-amber-500 text-[10px] font-bold px-1 rounded-full text-slate-950">
                Guest
              </span>
            )}
          </button>

          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-bold text-base tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                Subscription Alert
              </h1>
              <span className="text-[10px] bg-indigo-50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30 px-2 py-0.5 rounded-full font-bold">
                MD3
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
              Hi, {user.name.split(' ')[0]} 👋
            </p>
          </div>
        </div>

        {/* Right: Quick Action Controls */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* AI Advisor Trigger */}
          <button
            onClick={onOpenAiModal}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 hover:border-emerald-400 text-emerald-700 dark:text-emerald-300 text-xs font-semibold shadow-sm transition-all active:scale-95"
            title="AI Smart Advisor"
          >
            <Sparkles size={14} className="text-emerald-600 dark:text-emerald-400 animate-pulse" />
            <span className="hidden md:inline">AI Advisor</span>
          </button>

          {/* OCR Scanner */}
          <button
            onClick={() => setIsOcrModalOpen(true)}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
            title="Receipt Scanner (OCR)"
          >
            <ScanLine size={18} />
          </button>

          {/* Search Trigger */}
          <button
            onClick={onOpenSearch}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
            title="Search Subscriptions"
          >
            <Search size={18} />
          </button>

          {/* Currency Dropdown Selector */}
          <select
            value={currencySymbol}
            onChange={(e) => setCurrencySymbol(e.target.value)}
            className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs rounded-xl px-2 py-1 font-bold focus:outline-none focus:ring-1 focus:ring-indigo-400 cursor-pointer"
            title="Select Currency"
          >
            <option value="₹">₹ INR</option>
            <option value="$">$ USD</option>
            <option value="€">€ EUR</option>
            <option value="£">£ GBP</option>
          </select>

          {/* Notifications Trigger */}
          <div className="relative">
            <button
              onClick={() => setShowNotificationsDropdown(!showNotificationsDropdown)}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 relative transition-colors"
              title="Notifications"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown Panel */}
            <AnimatePresence>
              {showNotificationsDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden"
                >
                  <div className="p-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/50">
                    <div className="flex items-center gap-2">
                      <Bell size={16} className="text-indigo-600 dark:text-indigo-400" />
                      <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Notifications</h3>
                    </div>
                    <span className="text-xs text-indigo-600 dark:text-indigo-300 font-medium bg-indigo-50 dark:bg-indigo-900/60 px-2 py-0.5 rounded-full">
                      {unreadCount} new
                    </span>
                  </div>

                  <div className="max-h-64 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                    {notifications.length === 0 ? (
                      <p className="p-4 text-xs text-slate-400 text-center">No notifications yet.</p>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => markNotificationRead(notif.id)}
                          className={`p-3 text-xs cursor-pointer transition-colors ${
                            notif.status === 'unread' ? 'bg-indigo-50/50 dark:bg-indigo-950/40 border-l-2 border-indigo-500' : 'opacity-70'
                          } hover:bg-slate-50 dark:hover:bg-slate-800/50`}
                        >
                          <div className="flex items-center justify-between font-semibold text-slate-800 dark:text-slate-200 mb-0.5">
                            <span>{notif.serviceName}</span>
                            <span className="text-[10px] text-slate-400">{notif.notificationDate}</span>
                          </div>
                          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{notif.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Cloud Sync Button */}
          <button
            onClick={() => syncCloud()}
            disabled={isSyncing}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
            title="Firebase Cloud Sync"
          >
            <RefreshCw size={18} className={isSyncing ? 'animate-spin text-emerald-500' : ''} />
          </button>

          {/* Flutter Code Inspector */}
          <button
            onClick={() => setIsFlutterCodeDrawerOpen(true)}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-emerald-600 dark:text-emerald-400 transition-colors hidden sm:flex"
            title="View Flutter Code Structure"
          >
            <Code2 size={18} />
          </button>

          {/* Mobile Phone Frame / Desktop Frame Toggle */}
          <button
            onClick={toggleDeviceFrameMode}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors hidden sm:flex"
            title={deviceFrameMode ? 'Switch to Responsive Mode' : 'Switch to Mobile Frame'}
          >
            {deviceFrameMode ? <Maximize2 size={18} /> : <Smartphone size={18} />}
          </button>

          {/* Dark / Light Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-amber-500 dark:text-amber-300 transition-colors"
            title="Toggle Light/Dark Theme"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </div>
    </header>
  );
};
