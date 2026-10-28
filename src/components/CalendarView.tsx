import React, { useState } from 'react';
import { useSubscription } from '../context/SubscriptionContext';
import { ServiceLogo } from './ServiceLogo';
import { ChevronLeft, ChevronRight, CalendarDays, CheckCircle2, Clock, AlertTriangle, Check } from 'lucide-react';
import { motion } from 'motion/react';

export const CalendarView: React.FC = () => {
  const { subscriptions, payments, markAsPaid, currencySymbol, setSelectedSubscriptionForDetail } = useSubscription();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDateStr, setSelectedDateStr] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
  });
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const dateKey = (day: number) => `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
  const today = new Date();
  const todayKey = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
  const selectedDate = new Date(`${selectedDateStr}T00:00:00`);

  const getDayEvents = (dayNum: number) => {
    const formattedDate = dateKey(dayNum);
    const upcoming = subscriptions.filter((s) => s.renewalDate === formattedDate && s.status === 'active');
    const paidList = payments.filter((p) => p.paymentDate === formattedDate);
    return { formattedDate, upcoming, paidList, isPast: formattedDate < todayKey };
  };

  const selectedDayInfo = {
    upcoming: subscriptions.filter((s) => s.renewalDate === selectedDateStr),
    paidList: payments.filter((p) => p.paymentDate === selectedDateStr),
  };

  const calendarCells = [
    ...Array.from({ length: firstDayOfMonth }, (_, i) => ({ key: `blank-${i}`, blank: true as const })),
    ...Array.from({ length: daysInMonth }, (_, i) => ({ key: dateKey(i+1), blank: false as const, day: i+1 })),
  ];

  const dueThisMonth = subscriptions.filter((s) => s.status === 'active' && s.renewalDate.startsWith(`${year}-${String(month+1).padStart(2,'0')}`));

  return (
    <div className="space-y-5 pb-28">
      <section className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[.2em] ledger-muted font-semibold mb-2">Renewal planner</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold">Calendar<span className="text-[#87b85b]">.</span></h2>
          <p className="text-sm ledger-muted mt-2">Plan ahead. Keep every recurring charge visible.</p>
        </div>
        <div className="ledger-card flex items-center justify-between gap-3 p-2">
          <button onClick={() => setCurrentDate(new Date(year, month-1, 1))} className="p-2 rounded-lg hover:bg-[#f0f5e8]" aria-label="Previous month"><ChevronLeft size={18}/></button>
          <span className="min-w-36 text-center text-sm font-bold">{monthNames[month]} {year}</span>
          <button onClick={() => setCurrentDate(new Date(year, month+1, 1))} className="p-2 rounded-lg hover:bg-[#f0f5e8]" aria-label="Next month"><ChevronRight size={18}/></button>
          <button onClick={() => { setCurrentDate(new Date()); setSelectedDateStr(todayKey); }} className="px-3 py-2 rounded-lg bg-[#202b26] text-lime-300 text-xs font-semibold">Today</button>
        </div>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-[1.5fr_.8fr] gap-4">
        <div className="ledger-card p-4 sm:p-6">
          <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2">
            {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map((day) => <div key={day} className="text-center text-[10px] uppercase tracking-wider text-[#8a958c] font-semibold py-2">{day}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {calendarCells.map((cell) => {
              if (cell.blank) return <div key={cell.key} className="min-h-16 sm:min-h-24 rounded-xl bg-[#f8f9f4]/50" />;
              const event = getDayEvents(cell.day);
              const isSelected = selectedDateStr === event.formattedDate;
              const isToday = todayKey === event.formattedDate;
              const hasUpcoming = event.upcoming.length > 0;
              const hasPaid = event.paidList.length > 0;
              return (
                <button key={cell.key} onClick={() => setSelectedDateStr(event.formattedDate)} className={`relative text-left min-h-16 sm:min-h-24 p-1.5 sm:p-2 rounded-xl border transition-all ${isSelected ? 'bg-[#eff7e5] border-[#9abe77] ring-1 ring-[#9abe77]' : 'bg-[#fffefa] border-[#edf0e9] hover:border-[#c6d4b7]'}`}>
                  <span className={`text-xs sm:text-sm font-semibold ${isToday ? 'w-6 h-6 inline-flex items-center justify-center rounded-full bg-[#202b26] text-lime-300' : 'text-[#19231f]'}`}>{cell.day}</span>
                  <div className="mt-2 flex gap-1 flex-wrap">
                    {hasUpcoming && <span className="w-1.5 h-1.5 rounded-full bg-[#d39a3d]" />}
                    {hasPaid && <span className="w-1.5 h-1.5 rounded-full bg-[#78a94b]" />}
                    {event.isPast && hasUpcoming && <span className="w-1.5 h-1.5 rounded-full bg-[#d26d51]" />}
                  </div>
                  <span className="hidden sm:block text-[9px] mt-1 text-[#8a958c]">{event.upcoming.length ? `${event.upcoming.length} due` : event.paidList.length ? 'Paid' : ''}</span>
                </button>
              );
            })}
          </div>
          <div className="flex flex-wrap items-center gap-4 mt-5 pt-4 border-t border-[#edf0e9] text-[11px] text-[#748078]">
            <span className="flex items-center gap-2"><i className="w-2 h-2 rounded-full bg-[#d39a3d]"/>Upcoming</span>
            <span className="flex items-center gap-2"><i className="w-2 h-2 rounded-full bg-[#78a94b]"/>Payment recorded</span>
            <span className="flex items-center gap-2"><i className="w-2 h-2 rounded-full bg-[#d26d51]"/>Past renewal</span>
          </div>
        </div>

        <aside className="ledger-card overflow-hidden">
          <div className="p-5 border-b border-[#e2e5dd]">
            <p className="text-[10px] uppercase tracking-[.18em] ledger-muted font-semibold">Selected date</p>
            <h3 className="text-2xl font-bold mt-2">{selectedDate.toLocaleDateString('en-IN', { weekday: 'long' })}</h3>
            <p className="text-sm ledger-muted mt-1">{selectedDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          </div>
          <div className="p-4 space-y-3">
            {selectedDayInfo.upcoming.length === 0 && selectedDayInfo.paidList.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-10 h-10 rounded-xl bg-[#f0f5e8] text-[#557a35] flex items-center justify-center mx-auto"><CalendarDays size={18}/></div>
                <p className="text-sm font-semibold mt-3">Nothing scheduled</p><p className="text-xs ledger-muted mt-1">This day is clear of recorded renewals.</p>
              </div>
            ) : (
              <>
                {selectedDayInfo.upcoming.map((sub) => (
                  <div key={sub.id} className="p-3 rounded-xl border border-[#e2e5dd] bg-[#fffefa]">
                    <button onClick={() => setSelectedSubscriptionForDetail(sub)} className="flex items-center gap-3 w-full text-left">
                      <ServiceLogo name={sub.serviceName} category={sub.category} logoKey={sub.logo} size="md"/>
                      <div className="min-w-0 flex-1"><p className="text-sm font-semibold truncate">{sub.serviceName}</p><p className="text-[10px] ledger-muted mt-1">{sub.billingCycle} renewal</p></div>
                      <span className="ledger-mono text-sm">{sub.currency || currencySymbol}{sub.amount.toLocaleString('en-IN')}</span>
                    </button>
                    <button onClick={() => markAsPaid(sub.id)} className="mt-3 w-full rounded-lg bg-[#eff7e5] text-[#557a35] py-2 text-xs font-semibold flex items-center justify-center gap-1"><Check size={14}/> Mark as paid</button>
                  </div>
                ))}
                {selectedDayInfo.paidList.map((payment) => <div key={payment.id} className="p-3 rounded-xl bg-[#f5f8f0] flex items-center gap-3"><CheckCircle2 size={16} className="text-[#6c9948]"/><div className="flex-1 min-w-0"><p className="text-sm font-semibold truncate">{payment.serviceName}</p><p className="text-[10px] ledger-muted">Payment recorded</p></div><span className="ledger-mono text-sm">{payment.currency || currencySymbol}{payment.amount.toLocaleString('en-IN')}</span></div>)}
              </>
            )}
          </div>
          <div className="p-5 border-t border-[#e2e5dd] bg-[#fafbf7]">
            <p className="text-[10px] uppercase tracking-[.18em] ledger-muted font-semibold">Month at a glance</p>
            <p className="ledger-mono text-2xl mt-2">{dueThisMonth.length.toString().padStart(2, '0')} <span className="font-sans text-sm ledger-muted">active renewals</span></p>
          </div>
        </aside>
      </section>
    </div>
  );
};
