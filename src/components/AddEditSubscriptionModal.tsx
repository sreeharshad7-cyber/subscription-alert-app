import React, { useState, useEffect } from 'react';
import { useSubscription } from '../context/SubscriptionContext';
import {
  BillingCycleType,
  CategoryType,
  PaymentMethodType,
  Subscription,
} from '../types';
import { X, Calendar, DollarSign, Tag, Clock, CreditCard, FileText, Sparkles, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const AddEditSubscriptionModal: React.FC = () => {
  const {
    isAddModalOpen,
    setIsAddModalOpen,
    editingSubscription,
    setEditingSubscription,
    addSubscription,
    updateSubscription,
    currencySymbol,
  } = useSubscription();

  const [serviceName, setServiceName] = useState('');
  const [category, setCategory] = useState<CategoryType>('Entertainment');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState(currencySymbol);
  const [billingCycle, setBillingCycle] = useState<BillingCycleType>('Monthly');
  const [renewalDate, setRenewalDate] = useState('');
  const [reminderDays, setReminderDays] = useState<number>(3);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('Credit Card');
  const [autoRenew, setAutoRenew] = useState(true);
  const [notes, setNotes] = useState('');
  const [logoPreset, setLogoPreset] = useState('default');

  const presets = [
    { name: 'Spotify', logo: 'spotify', cat: 'Entertainment' as CategoryType, price: 119 },
    { name: 'Netflix', logo: 'netflix', cat: 'Entertainment' as CategoryType, price: 649 },
    { name: 'JioFiber', logo: 'wifi', cat: 'Utilities' as CategoryType, price: 1179 },
    { name: 'AWS Cloud', logo: 'cloud', cat: 'Cloud' as CategoryType, price: 1450 },
    { name: 'ChatGPT Plus', logo: 'bot', cat: 'Education' as CategoryType, price: 1999 },
    { name: 'Adobe CC', logo: 'palette', cat: 'Education' as CategoryType, price: 4230 },
    { name: 'Xbox Pass', logo: 'gamepad', cat: 'Gaming' as CategoryType, price: 549 },
    { name: 'Gym Club', logo: 'dumbbell', cat: 'Others' as CategoryType, price: 2000 },
    { name: 'Amazon Prime', logo: 'shopping-bag', cat: 'Shopping' as CategoryType, price: 1499 },
  ];

  useEffect(() => {
    if (editingSubscription) {
      setServiceName(editingSubscription.serviceName);
      setCategory(editingSubscription.category);
      setAmount(editingSubscription.amount.toString());
      setCurrency(editingSubscription.currency || currencySymbol);
      setBillingCycle(editingSubscription.billingCycle);
      setRenewalDate(editingSubscription.renewalDate);
      setReminderDays(editingSubscription.reminderDays);
      setPaymentMethod(editingSubscription.paymentMethod);
      setAutoRenew(editingSubscription.autoRenew);
      setNotes(editingSubscription.notes || '');
      setLogoPreset(editingSubscription.logo || 'default');
    } else {
      // Defaults for new subscription
      setServiceName('');
      setCategory('Entertainment');
      setAmount('');
      setCurrency(currencySymbol);
      setBillingCycle('Monthly');
      setRenewalDate(new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0]);
      setReminderDays(3);
      setPaymentMethod('Credit Card');
      setAutoRenew(true);
      setNotes('');
      setLogoPreset('default');
    }
  }, [editingSubscription, isAddModalOpen, currencySymbol]);

  const handleSelectPreset = (p: typeof presets[0]) => {
    setServiceName(p.name);
    setCategory(p.cat);
    setAmount(p.price.toString());
    setLogoPreset(p.logo);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceName || !amount || !renewalDate) return;

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) return;

    if (editingSubscription) {
      updateSubscription(editingSubscription.id, {
        serviceName,
        category,
        amount: numAmount,
        currency,
        billingCycle,
        renewalDate,
        reminderDays,
        paymentMethod,
        autoRenew,
        notes,
        logo: logoPreset,
      });
    } else {
      addSubscription({
        serviceName,
        category,
        amount: numAmount,
        currency,
        billingCycle,
        renewalDate,
        reminderDays,
        paymentMethod,
        autoRenew,
        notes,
        logo: logoPreset,
      });
    }

    handleClose();
  };

  const handleClose = () => {
    setIsAddModalOpen(false);
    setEditingSubscription(null);
  };

  if (!isAddModalOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-indigo-500/30 rounded-[2rem] max-w-lg w-full p-5 sm:p-6 shadow-2xl space-y-5 my-auto max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles size={20} className="text-indigo-600 dark:text-indigo-400" />
              <span>{editingSubscription ? 'Edit Subscription' : 'Add Subscription'}</span>
            </h3>
            <button
              onClick={handleClose}
              className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Preset Buttons */}
          {!editingSubscription && (
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                Quick Presets
              </label>
              <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                {presets.map((p) => (
                  <button
                    type="button"
                    key={p.name}
                    onClick={() => handleSelectPreset(p)}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-600 hover:text-white border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold whitespace-nowrap transition-all cursor-pointer"
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Service Name */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-200">Service Name *</label>
              <input
                type="text"
                required
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
                placeholder="e.g. Spotify, Netflix, JioFiber"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Category & Amount */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-200">Category</label>
                <select
                  value={category}
                  onChange={(e: any) => setCategory(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                >
                  <option value="Entertainment">Entertainment</option>
                  <option value="Utilities">Utilities</option>
                  <option value="Gaming">Gaming</option>
                  <option value="Education">Education</option>
                  <option value="Cloud">Cloud</option>
                  <option value="Shopping">Shopping</option>
                  <option value="Finance">Finance</option>
                  <option value="Others">Others</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-200">Amount *</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-indigo-600 dark:text-indigo-400">
                    {currency}
                  </span>
                  <input
                    type="number"
                    step="any"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="119"
                    className="w-full pl-8 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* Billing Cycle & Currency */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-200">Billing Cycle</label>
                <select
                  value={billingCycle}
                  onChange={(e: any) => setBillingCycle(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-semibold focus:outline-none cursor-pointer"
                >
                  <option value="Monthly">Monthly</option>
                  <option value="Quarterly">Quarterly</option>
                  <option value="Half Yearly">Half Yearly</option>
                  <option value="Yearly">Yearly</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-200">Currency</label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-semibold focus:outline-none cursor-pointer"
                >
                  <option value="₹">₹ INR</option>
                  <option value="$">$ USD</option>
                  <option value="€">€ EUR</option>
                  <option value="£">£ GBP</option>
                </select>
              </div>
            </div>

            {/* Renewal Date & Reminder Days */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-200">Renewal Date *</label>
                <input
                  type="date"
                  required
                  value={renewalDate}
                  onChange={(e) => setRenewalDate(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-200">Reminder Days</label>
                <select
                  value={reminderDays}
                  onChange={(e) => setReminderDays(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-semibold focus:outline-none cursor-pointer"
                >
                  <option value={1}>1 Day Before</option>
                  <option value={3}>3 Days Before</option>
                  <option value={7}>7 Days Before</option>
                  <option value={15}>15 Days Before</option>
                  <option value={30}>30 Days Before</option>
                </select>
              </div>
            </div>

            {/* Payment Method & Auto Renewal Toggle */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-200">Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={(e: any) => setPaymentMethod(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-semibold focus:outline-none cursor-pointer"
                >
                  <option value="UPI">UPI</option>
                  <option value="Debit Card">Debit Card</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Net Banking">Net Banking</option>
                  <option value="Cash">Cash</option>
                </select>
              </div>

              <div className="space-y-1 flex flex-col justify-end">
                <label className="font-bold text-slate-700 dark:text-slate-200 block mb-1">Auto Renewal</label>
                <button
                  type="button"
                  onClick={() => setAutoRenew(!autoRenew)}
                  className={`py-2 px-3 rounded-xl border font-bold flex items-center justify-between transition-all cursor-pointer ${
                    autoRenew
                      ? 'bg-emerald-50 dark:bg-emerald-500/20 border-emerald-200 dark:border-emerald-500/40 text-emerald-700 dark:text-emerald-300'
                      : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  <span>{autoRenew ? 'Auto Renewal ON' : 'Auto Renewal OFF'}</span>
                  {autoRenew && <Check size={16} className="text-emerald-600 dark:text-emerald-400" />}
                </button>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-200">Add Notes</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Plan details, account email, or renewal instructions..."
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Buttons */}
            <div className="pt-3 flex gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold shadow-lg shadow-indigo-300 dark:shadow-indigo-600/30 transition-all cursor-pointer"
              >
                {editingSubscription ? 'Save Changes' : 'Save Subscription'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
