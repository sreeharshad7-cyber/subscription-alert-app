import React, { useState } from 'react';
import { useSubscription } from '../context/SubscriptionContext';
import {
  Settings,
  Moon,
  Sun,
  DollarSign,
  Bell,
  Download,
  FileSpreadsheet,
  CloudUpload,
  RefreshCw,
  Code2,
  Trash2,
  User,
  ShieldAlert,
  Smartphone,
  Check,
  Zap,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const SettingsView: React.FC = () => {
  const {
    user,
    budget,
    setBudgetAmount,
    currencySymbol,
    setCurrencySymbol,
    darkMode,
    toggleDarkMode,
    deviceFrameMode,
    toggleDeviceFrameMode,
    isSyncing,
    syncCloud,
    exportCSV,
    exportPDF,
    setIsFlutterCodeDrawerOpen,
    setUser,
  } = useSubscription();

  const [notificationDays, setNotificationDays] = useState<number[]>([1, 3, 7, 15, 30]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [budgetInput, setBudgetInput] = useState(budget.monthlyBudget.toString());

  const handleToggleNotifDay = (day: number) => {
    if (notificationDays.includes(day)) {
      setNotificationDays(notificationDays.filter((d) => d !== day));
    } else {
      setNotificationDays([...notificationDays, day]);
    }
  };

  const handleUpdateBudget = () => {
    const val = parseFloat(budgetInput);
    if (!isNaN(val) && val > 0) {
      setBudgetAmount(val);
    }
  };

  const handleDeleteAccount = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Settings Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-[2rem] shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Settings size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">App Settings</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Preferences, backup & integrations</p>
          </div>
        </div>
      </div>

      {/* User Account Card */}
      <div className="p-5 rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <img
            src={user.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'}
            alt={user.name}
            className="w-12 h-12 rounded-full object-cover ring-2 ring-indigo-500/80"
          />
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span>{user.name}</span>
              {user.isGuest && (
                <span className="text-[10px] bg-amber-50 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30 px-2 py-0.5 rounded-full font-bold">
                  Guest Mode
                </span>
              )}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
          </div>
        </div>
      </div>

      {/* 1. Appearance & Theme */}
      <div className="p-5 rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
          {darkMode ? <Sun size={16} className="text-amber-400" /> : <Moon size={16} className="text-indigo-600 dark:text-indigo-400" />}
          <span>Appearance & Frame</span>
        </h4>

        <div className="flex items-center justify-between text-xs">
          <div>
            <span className="font-bold text-slate-800 dark:text-slate-200 block">Dark Mode</span>
            <span className="text-slate-500 dark:text-slate-400">Sleek interface light & dark mode toggle</span>
          </div>
          <button
            onClick={toggleDarkMode}
            className={`w-12 h-6 rounded-full p-1 transition-colors cursor-pointer ${
              darkMode ? 'bg-indigo-600' : 'bg-slate-200'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transition-transform ${
                darkMode ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 dark:border-slate-800/60">
          <div>
            <span className="font-bold text-slate-800 dark:text-slate-200 block">Mobile Shell Frame</span>
            <span className="text-slate-500 dark:text-slate-400">Simulate Android mobile frame container</span>
          </div>
          <button
            onClick={toggleDeviceFrameMode}
            className={`w-12 h-6 rounded-full p-1 transition-colors cursor-pointer ${
              deviceFrameMode ? 'bg-indigo-600' : 'bg-slate-200'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transition-transform ${
                deviceFrameMode ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* 2. Monthly Budget & Currency */}
      <div className="p-5 rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
          <DollarSign size={16} className="text-emerald-600 dark:text-emerald-400" />
          <span>Currency & Budget Planner</span>
        </h4>

        {/* Currency Switcher */}
        <div className="flex items-center justify-between text-xs">
          <div>
            <span className="font-bold text-slate-800 dark:text-slate-200 block">Primary Currency</span>
            <span className="text-slate-500 dark:text-slate-400">Applies across all subscriptions & analytics</span>
          </div>
          <select
            value={currencySymbol}
            onChange={(e) => setCurrencySymbol(e.target.value)}
            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-indigo-700 dark:text-indigo-300 font-bold text-xs rounded-xl px-3 py-1.5 focus:outline-none cursor-pointer"
          >
            <option value="₹">₹ INR (Indian Rupee)</option>
            <option value="$">$ USD (US Dollar)</option>
            <option value="€">€ EUR (Euro)</option>
            <option value="£">£ GBP (British Pound)</option>
          </select>
        </div>

        {/* Set Budget */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/60 space-y-2">
          <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block">Monthly Budget Limit</label>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-indigo-600 dark:text-indigo-400 text-xs">
                {currencySymbol}
              </span>
              <input
                type="number"
                value={budgetInput}
                onChange={(e) => setBudgetInput(e.target.value)}
                className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <button
              onClick={handleUpdateBudget}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-all cursor-pointer shadow-sm"
            >
              Update
            </button>
          </div>
        </div>
      </div>

      {/* 3. Notification Settings */}
      <div className="p-5 rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
          <Bell size={16} className="text-amber-500" />
          <span>Smart Notification Days</span>
        </h4>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Configure when local & FCM push notifications are triggered before deadline:
        </p>

        <div className="flex flex-wrap gap-2">
          {[30, 15, 7, 3, 1].map((day) => {
            const isSelected = notificationDays.includes(day);
            return (
              <button
                key={day}
                onClick={() => handleToggleNotifDay(day)}
                className={`px-3.5 py-2 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-amber-400 text-slate-950 shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-700'
                }`}
              >
                {isSelected && <Check size={14} className="stroke-[3]" />}
                <span>{day} Days Before</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Firebase Backup & Cloud Sync */}
      <div className="p-5 rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
          <CloudUpload size={16} className="text-sky-500" />
          <span>Cloud Sync & Offline Database</span>
        </h4>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Firebase Firestore cloud database sync + local SQLite / IndexedDB cache fallback.
        </p>

        <div className="flex items-center gap-3">
          <button
            onClick={() => syncCloud()}
            disabled={isSyncing}
            className="flex-1 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
          >
            <RefreshCw size={16} className={isSyncing ? 'animate-spin' : ''} />
            <span>{isSyncing ? 'Syncing with Firestore...' : 'Sync Now with Cloud'}</span>
          </button>
        </div>
      </div>

      {/* 5. Export Data (PDF & CSV) */}
      <div className="p-5 rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
          <Download size={16} className="text-teal-600 dark:text-teal-400" />
          <span>Export Data & Statements</span>
        </h4>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={exportCSV}
            className="py-2.5 px-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-500 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <FileSpreadsheet size={16} className="text-emerald-600 dark:text-emerald-400" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={exportPDF}
            className="py-2.5 px-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-500 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Download size={16} className="text-rose-500" />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* 6. Developer Flutter Architecture Inspector */}
      <div className="p-5 rounded-[2rem] bg-slate-900 text-white border border-slate-800 shadow-lg space-y-3 relative overflow-hidden">
        <div className="flex items-center gap-2">
          <Code2 size={18} className="text-emerald-400" />
          <h4 className="text-sm font-bold text-white">Flutter Developer Source Code</h4>
        </div>
        <p className="text-xs text-slate-300">
          Inspect the full Flutter/Dart code structure, Provider state management, Firestore rules, and SQLite local database helper.
        </p>
        <button
          onClick={() => setIsFlutterCodeDrawerOpen(true)}
          className="w-full py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <Code2 size={16} />
          <span>Open Flutter Code Inspector</span>
        </button>
      </div>

      {/* 7. Danger Zone: Delete Account / Reset */}
      <div className="p-5 rounded-[2rem] bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-500/30 shadow-sm space-y-3">
        <h4 className="text-sm font-bold text-rose-600 dark:text-rose-400 flex items-center gap-2">
          <ShieldAlert size={16} />
          <span>Danger Zone</span>
        </h4>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Reset all stored data and clear local cache.
        </p>

        <button
          onClick={() => setShowDeleteModal(true)}
          className="px-4 py-2 rounded-xl bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-500/40 hover:bg-rose-600 hover:text-white font-bold text-xs transition-all cursor-pointer"
        >
          Delete Account & Reset Data
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 border border-rose-500/40 p-6 rounded-3xl max-w-sm w-full space-y-4 shadow-2xl"
            >
              <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
                <Trash2 size={24} />
              </div>
              <h3 className="text-base font-bold text-white text-center">Delete Account & Reset?</h3>
              <p className="text-xs text-slate-300 text-center">
                This will permanently remove all subscriptions, payment logs, and settings from local storage.
              </p>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="flex-1 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-500"
                >
                  Delete Everything
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
