import React, { useState } from 'react';
import { useSubscription } from '../context/SubscriptionContext';
import { ServiceLogo } from './ServiceLogo';
import { Subscription, PaymentHistory } from '../types';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Check,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const CalendarView: React.FC = () => {
  const { subscriptions, payments, markAsPaid, currencySymbol, setSelectedSubscriptionForDetail } = useSubscription();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDateStr, setSelectedDateStr] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Calendar matrix calculations
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Helper to get status of a specific day
  const getDayEvents = (dayNum: number) => {
    const formattedDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
    const todayStr = new Date().toISOString().split('T')[0];

    const upcoming = subscriptions.filter((s) => s.renewalDate === formattedDate);
    const paidList = payments.filter((p) => p.paymentDate === formattedDate);

    const isPast = formattedDate < todayStr;
    const hasOverdue = upcoming.some(() => isPast);

    return {
      formattedDate,
      upcoming,
      paidList,
      hasOverdue,
      hasUpcoming: upcoming.length > 0 && !hasOverdue,
      hasPaid: paidList.length > 0,
    };
  };

  const selectedDayInfo = (() => {
    const upcoming = subscriptions.filter((s) => s.renewalDate === selectedDateStr);
    const paidList = payments.filter((p) => p.paymentDate === selectedDateStr);
    return { upcoming, paidList };
  })();

  return (
    <div className="space-y-6 pb-24">
      {/* Calendar Header */}
      <div className="flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-[2rem] shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <CalendarIcon size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              {monthNames[month]} {year}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Monthly renewal timeline</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevMonth}
            className="p-2 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-3 py-1.5 rounded-2xl bg-indigo-50 dark:bg-indigo-600/30 border border-indigo-200 dark:border-indigo-500/40 text-indigo-700 dark:text-indigo-300 text-xs font-bold hover:bg-indigo-600 hover:text-white transition-all cursor-pointer"
          >
            Today
          </button>
          <button
            onClick={handleNextMonth}
            className="p-2 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Color Legend */}
      <div className="flex items-center justify-around bg-white/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 p-3 rounded-2xl text-xs text-slate-600 dark:text-slate-300 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm" />
          <span>Green = Paid</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-amber-400 shadow-sm" />
          <span>Yellow = Upcoming</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-rose-500 shadow-sm" />
          <span>Red = Overdue</span>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-4 shadow-sm">
        {/* Days of week header */}
        <div className="grid grid-cols-7 text-center text-xs font-bold text-slate-400 dark:text-slate-500 pb-2 border-b border-slate-100 dark:border-slate-800">
          <span>Sun</span>
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
        </div>

        {/* Days cells */}
        <div className="grid grid-cols-7 gap-1 pt-2">
          {/* Empty cells before month starts */}
          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <div key={`empty_${i}`} className="h-12 rounded-2xl bg-slate-50 dark:bg-slate-950/20 opacity-30" />
          ))}

          {/* Month days */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const { formattedDate, upcoming, paidList, hasOverdue, hasUpcoming, hasPaid } =
              getDayEvents(dayNum);
            const isSelected = selectedDateStr === formattedDate;
            const isToday = formattedDate === new Date().toISOString().split('T')[0];

            return (
              <button
                key={dayNum}
                onClick={() => setSelectedDateStr(formattedDate)}
                className={`h-13 rounded-2xl p-1.5 flex flex-col items-center justify-between relative transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600 text-white ring-2 ring-indigo-400 shadow-md'
                    : isToday
                    ? 'bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-700/60 font-bold'
                    : 'bg-slate-50 dark:bg-slate-950/40 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span className={`text-xs font-bold ${isToday && !isSelected ? 'text-indigo-600 dark:text-indigo-400' : ''}`}>
                  {dayNum}
                </span>

                {/* Status Indicator Dots */}
                <div className="flex items-center gap-1">
                  {hasPaid && (
                    <span className="w-2 h-2 rounded-full bg-emerald-500 ring-1 ring-emerald-300" title="Paid" />
                  )}
                  {hasUpcoming && (
                    <span className="w-2 h-2 rounded-full bg-amber-400 ring-1 ring-amber-200" title="Upcoming" />
                  )}
                  {hasOverdue && (
                    <span className="w-2 h-2 rounded-full bg-rose-500 ring-1 ring-rose-200 animate-ping" title="Overdue" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Day Details Panel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedDateStr}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-[2rem] space-y-4 shadow-sm"
        >
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <CalendarIcon size={16} className="text-indigo-600 dark:text-indigo-400" />
              <span>Events for {selectedDateStr}</span>
            </h4>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {selectedDayInfo.upcoming.length + selectedDayInfo.paidList.length} items
            </span>
          </div>

          {selectedDayInfo.upcoming.length === 0 && selectedDayInfo.paidList.length === 0 ? (
            <p className="text-xs text-slate-500 dark:text-slate-400 italic text-center py-4">
              No bills scheduled or paid on this date.
            </p>
          ) : (
            <div className="space-y-3">
              {/* Upcoming / Due */}
              {selectedDayInfo.upcoming.map((sub) => {
                const isOverdue = new Date(sub.renewalDate) < new Date();

                return (
                  <div
                    key={sub.id}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3"
                  >
                    <div
                      onClick={() => setSelectedSubscriptionForDetail(sub)}
                      className="flex items-center gap-3 cursor-pointer min-w-0 flex-1"
                    >
                      <ServiceLogo name={sub.serviceName} category={sub.category} logoKey={sub.logo} size="md" />
                      <div className="min-w-0">
                        <h5 className="text-sm font-bold text-slate-900 dark:text-slate-200 truncate">{sub.serviceName}</h5>
                        <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                          <span className="font-semibold text-indigo-600 dark:text-indigo-300">{sub.currency}{sub.amount}</span>
                          <span>•</span>
                          <span className={isOverdue ? 'text-rose-600 dark:text-rose-400 font-bold' : 'text-amber-600 dark:text-amber-400'}>
                            {isOverdue ? 'Overdue' : 'Due Today'}
                          </span>
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => markAsPaid(sub.id)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500 hover:text-white font-bold text-xs transition-all cursor-pointer"
                    >
                      Mark Paid
                    </button>
                  </div>
                );
              })}

              {/* Paid List */}
              {selectedDayInfo.paidList.map((pay) => (
                <div
                  key={pay.id}
                  className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-500/30 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                      <CheckCircle2 size={16} />
                    </div>
                    <div>
                      <h5 className="font-bold text-slate-900 dark:text-slate-200">{pay.serviceName}</h5>
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">Payment completed</span>
                    </div>
                  </div>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                    {pay.currency}{pay.amount}
                  </span>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
