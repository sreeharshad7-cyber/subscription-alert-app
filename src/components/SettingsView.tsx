import React, { useState } from 'react';
import { useSubscription } from '../context/SubscriptionContext';
import {
  Settings2, Moon, Sun, DollarSign, Bell, Download, FileSpreadsheet, CloudUpload,
  RefreshCw, Code2, Trash2, ShieldAlert, Smartphone, Check, UserRound, Sparkles, RotateCcw,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const SettingsView: React.FC = () => {
  const {
    user, budget, setBudgetAmount, currencySymbol, setCurrencySymbol, darkMode, toggleDarkMode,
    deviceFrameMode, toggleDeviceFrameMode, isSyncing, syncCloud, exportCSV, exportPDF,
    setIsFlutterCodeDrawerOpen, setUser,
  } = useSubscription();

  const [notificationDays, setNotificationDays] = useState<number[]>([1,3,7,15,30]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [budgetInput, setBudgetInput] = useState(budget.monthlyBudget.toString());
  const [savedNotice, setSavedNotice] = useState(false);

  const handleToggleNotifDay = (day: number) => setNotificationDays((days) => days.includes(day) ? days.filter((d) => d !== day) : [...days, day]);
  const handleUpdateBudget = () => {
    const val = Number.parseFloat(budgetInput);
    if (Number.isFinite(val) && val > 0) {
      setBudgetAmount(val);
      setSavedNotice(true);
      window.setTimeout(() => setSavedNotice(false), 1800);
    }
  };
  const handleDeleteAccount = () => { localStorage.clear(); window.location.reload(); };

  const sectionTitle = (eyebrow: string, title: string, icon: React.ReactNode) => (
    <div className="flex items-start gap-3">
      <div className="w-10 h-10 shrink-0 rounded-xl bg-[#eff7e5] text-[#557a35] flex items-center justify-center">{icon}</div>
      <div><p className="text-[10px] uppercase tracking-[.17em] ledger-muted font-semibold">{eyebrow}</p><h3 className="font-bold text-lg mt-1">{title}</h3></div>
    </div>
  );

  return (
    <div className="space-y-5 pb-28">
      <section><p className="text-[10px] uppercase tracking-[.2em] ledger-muted font-semibold mb-2">Make it yours</p><h2 className="text-3xl sm:text-4xl font-extrabold">Settings<span className="text-[#87b85b]">.</span></h2><p className="text-sm ledger-muted mt-2">Preferences, backups and personal finance controls.</p></section>

      <section className="ledger-banner p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-lime-300/15 border border-lime-300/20 flex items-center justify-center text-lime-300"><UserRound size={22}/></div>
        <div className="flex-1 min-w-0"><p className="text-[10px] uppercase tracking-[.18em] text-white/55 font-semibold">Current workspace</p><h3 className="text-lg font-bold mt-1">{user.name || 'Guest user'}</h3><p className="text-sm text-white/60 mt-1">{user.email || 'Local guest session'}</p></div>
        {user.isGuest && <span className="text-[10px] uppercase tracking-wider border border-white/20 rounded-full px-3 py-2 text-white/70">Guest mode</span>}
      </section>

      <section className="ledger-card p-5 sm:p-6 space-y-5">
        {sectionTitle('Interface', 'Appearance', <Sun size={19}/>)}
        <div className="divide-y divide-[#edf0e9]">
          <div className="py-4 flex items-center justify-between gap-4"><div><p className="text-sm font-semibold">{darkMode ? 'Dark mode enabled' : 'Light mode enabled'}</p><p className="text-xs ledger-muted mt-1">Choose the workspace contrast you prefer.</p></div><button onClick={toggleDarkMode} className={`w-12 h-7 rounded-full p-1 transition-colors ${darkMode ? 'bg-[#789d55]' : 'bg-[#dfe4d9]'}`} aria-label="Toggle dark mode"><span className={`block w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${darkMode ? 'translate-x-5' : ''}`}/></button></div>
          <div className="py-4 flex items-center justify-between gap-4"><div><p className="text-sm font-semibold">Device preview</p><p className="text-xs ledger-muted mt-1">Switch between a framed phone preview and the desktop workspace.</p></div><button onClick={toggleDeviceFrameMode} className={`w-12 h-7 rounded-full p-1 transition-colors ${deviceFrameMode ? 'bg-[#789d55]' : 'bg-[#dfe4d9]'}`} aria-label="Toggle device preview"><span className={`block w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${deviceFrameMode ? 'translate-x-5' : ''}`}/></button></div>
        </div>
      </section>

      <section className="ledger-card p-5 sm:p-6 space-y-5">
        {sectionTitle('Spending guardrails', 'Currency & budget', <DollarSign size={19}/>)}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <label className="space-y-2"><span className="text-xs font-semibold">Primary currency</span><select value={currencySymbol} onChange={(e) => setCurrencySymbol(e.target.value)} className="w-full bg-[#f7f8f3] dark:bg-slate-800 border border-[#e2e5dd] dark:border-slate-700 rounded-xl px-3 py-3 text-sm outline-none"><option value="₹">₹ INR — Indian Rupee</option><option value="$">$ USD — US Dollar</option><option value="€">€ EUR — Euro</option><option value="£">£ GBP — British Pound</option></select><span className="block text-[10px] ledger-muted">Changes the displayed currency symbol; it does not convert exchange rates.</span></label>
          <div className="space-y-2"><label htmlFor="monthly-budget" className="text-xs font-semibold block">Monthly budget limit</label><div className="flex gap-2"><div className="relative flex-1"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm ledger-muted">{currencySymbol}</span><input id="monthly-budget" type="number" min="1" value={budgetInput} onChange={(e) => setBudgetInput(e.target.value)} className="w-full pl-8 pr-3 py-3 rounded-xl bg-[#f7f8f3] dark:bg-slate-800 border border-[#e2e5dd] dark:border-slate-700 text-sm outline-none"/></div><button onClick={handleUpdateBudget} className="ledger-button-primary px-4 py-3 text-xs font-bold">Save</button></div>{savedNotice && <p className="text-xs text-[#557a35] flex items-center gap-1"><Check size={13}/> Budget updated</p>}</div>
        </div>
      </section>

      <section className="ledger-card p-5 sm:p-6 space-y-4">
        {sectionTitle('Reminders', 'Renewal notifications', <Bell size={19}/>)}
        <p className="text-sm ledger-muted">Choose how far ahead you prefer to review a recurring payment. These selections currently live in this screen state; they are not connected to a push notification scheduler.</p>
        <div className="flex flex-wrap gap-2">{[30,15,7,3,1].map((day) => { const selected = notificationDays.includes(day); return <button key={day} onClick={() => handleToggleNotifDay(day)} className={`px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 border transition-colors ${selected ? 'bg-[#eff7e5] text-[#4c6e30] border-[#dce8cf]' : 'bg-[#fffefa] text-[#748078] border-[#e2e5dd]'}`}>{selected && <Check size={13}/>} {day} day{day === 1 ? '' : 's'} before</button>; })}</div>
      </section>

      <section className="ledger-card p-5 sm:p-6 space-y-4">
        {sectionTitle('Keep a copy', 'Backup & export', <CloudUpload size={19}/>)}
        <p className="text-sm ledger-muted">Save a portable report or try the app's configured sync action.</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <button onClick={exportCSV} className="rounded-xl border border-[#e2e5dd] px-4 py-3 flex items-center justify-center gap-2 text-xs font-semibold hover:bg-[#f5f8ef]"><FileSpreadsheet size={16}/> Export CSV</button>
          <button onClick={exportPDF} className="rounded-xl border border-[#e2e5dd] px-4 py-3 flex items-center justify-center gap-2 text-xs font-semibold hover:bg-[#f5f8ef]"><Download size={16}/> Export PDF</button>
          <button onClick={() => syncCloud()} disabled={isSyncing} className="ledger-button-primary px-4 py-3 flex items-center justify-center gap-2 text-xs font-bold disabled:opacity-50"><RefreshCw size={15} className={isSyncing ? 'animate-spin' : ''}/>{isSyncing ? 'Syncing…' : 'Sync data'}</button>
        </div>
      </section>

      <section className="ledger-card p-5 sm:p-6 space-y-4">
        {sectionTitle('Developer tools', 'Code inspector', <Code2 size={19}/>)}
        <p className="text-sm ledger-muted">Inspect the app's documented Flutter-style structure and implementation notes.</p>
        <button onClick={() => setIsFlutterCodeDrawerOpen(true)} className="w-full sm:w-auto flex items-center justify-center gap-2 border border-[#e2e5dd] rounded-xl px-4 py-3 text-xs font-semibold hover:bg-[#f5f8ef]"><Code2 size={15}/> Open code inspector</button>
      </section>

      <section className="rounded-2xl border border-[#f0d7d0] bg-[#fff8f5] p-5 sm:p-6 space-y-3">
        <div className="flex items-center gap-2 text-[#a44b32]"><ShieldAlert size={18}/><h3 className="font-bold">Reset local workspace</h3></div>
        <p className="text-sm text-[#8f6d63] leading-relaxed">This clears locally stored app data in this browser. It does not delete a remote account or remote records.</p>
        <button onClick={() => setShowDeleteModal(true)} className="rounded-xl border border-[#efc8bf] text-[#a44b32] px-4 py-2.5 text-xs font-bold hover:bg-[#fff0ea]">Reset local data</button>
      </section>

      <AnimatePresence>
        {showDeleteModal && <div className="fixed inset-0 z-50 bg-[#16201b]/70 backdrop-blur-sm flex items-center justify-center p-4"><motion.div initial={{scale:.96,opacity:0}} animate={{scale:1,opacity:1}} exit={{scale:.96,opacity:0}} className="bg-[#fffefa] dark:bg-slate-900 border border-[#e2e5dd] p-6 rounded-2xl max-w-sm w-full space-y-4 shadow-2xl"><div className="w-11 h-11 rounded-xl bg-[#fff0ea] text-[#a44b32] flex items-center justify-center"><Trash2 size={20}/></div><h3 className="text-lg font-bold">Reset this browser's workspace?</h3><p className="text-sm ledger-muted">Subscriptions, payment records, and preferences stored locally will be removed. This cannot be undone.</p><div className="flex gap-2 pt-2"><button onClick={() => setShowDeleteModal(false)} className="flex-1 border border-[#e2e5dd] rounded-xl py-3 text-xs font-semibold">Cancel</button><button onClick={handleDeleteAccount} className="flex-1 bg-[#bf6048] text-white rounded-xl py-3 text-xs font-bold">Reset data</button></div></motion.div></div>}
      </AnimatePresence>
    </div>
  );
};
