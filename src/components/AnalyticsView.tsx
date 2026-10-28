import React from 'react';
import { useSubscription } from '../context/SubscriptionContext';
import { PieChart as PieChartIcon, BarChart3, TrendingUp, PiggyBank, ArrowUpRight, ChartNoAxesCombined } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, LineChart, Line, CartesianGrid, Legend } from 'recharts';

export const AnalyticsView: React.FC = () => {
  const { subscriptions, payments, currencySymbol, budget } = useSubscription();
  const activeSubs = subscriptions.filter((s) => s.status === 'active');
  const monthlyAmount = (amount: number, cycle: string) => {
    if (cycle === 'Quarterly') return amount / 3;
    if (cycle === 'Half Yearly') return amount / 6;
    if (cycle === 'Yearly') return amount / 12;
    return amount;
  };
  const fmt = (n: number) => n.toLocaleString('en-IN', { maximumFractionDigits: 0 });
  const categoryTotals: Record<string, number> = {};
  activeSubs.forEach((sub) => { categoryTotals[sub.category] = (categoryTotals[sub.category] || 0) + monthlyAmount(sub.amount, sub.billingCycle); });
  const categoryColors: Record<string, string> = {
    Entertainment: '#8ea96b', Utilities: '#d4a45f', Gaming: '#d07960', Education: '#7c9b9a',
    Cloud: '#9a8cba', Shopping: '#c9bd7e', Finance: '#64866c', Others: '#9ca6a0',
  };
  const pieChartData = Object.keys(categoryTotals).map((name) => ({ name, value: Math.round(categoryTotals[name]), color: categoryColors[name] || '#a4ad9f' }));
  const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const totalMonthlySpend = activeSubs.reduce((sum, sub) => sum + monthlyAmount(sub.amount, sub.billingCycle), 0);
  const barChartData = monthNames.map((month) => ({ month, spent: Math.round(totalMonthlySpend), budget: budget.monthlyBudget }));
  const lineChartData = monthNames.map((month, index) => ({ month, projected: Math.round(totalMonthlySpend * (index + 1)) }));
  const sortedByCost = [...activeSubs].sort((a,b) => monthlyAmount(b.amount,b.billingCycle) - monthlyAmount(a.amount,a.billingCycle));
  const mostExpensive = sortedByCost[0] || null;
  const lowestSub = sortedByCost[sortedByCost.length - 1] || null;
  const averageMonthlyCost = activeSubs.length ? totalMonthlySpend / activeSubs.length : 0;
  const totalSpentHistory = payments.reduce((sum,p) => sum + p.amount, 0);
  const projectedAnnual = totalMonthlySpend * 12;
  const tooltipStyle = { backgroundColor: '#202b26', borderColor: '#35443b', borderRadius: '12px', color: '#f7faef', fontSize: 12 };

  return (
    <div className="space-y-5 pb-28">
      <section className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div><p className="text-[10px] uppercase tracking-[.2em] ledger-muted font-semibold mb-2">Numbers, not guesswork</p><h2 className="text-3xl sm:text-4xl font-extrabold">Spending insights<span className="text-[#87b85b]">.</span></h2><p className="text-sm ledger-muted mt-2">A clear read on what your recurring plans really cost.</p></div>
        <div className="ledger-card p-4"><p className="text-[10px] uppercase tracking-wider ledger-muted">Annualized run rate</p><p className="ledger-mono text-2xl mt-1">{currencySymbol}{fmt(projectedAnnual)}</p></div>
      </section>

      <section className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        {[
          { label:'Monthly run rate', value: `${currencySymbol}${fmt(totalMonthlySpend)}`, sub:'Active subscriptions only' },
          { label:'Largest commitment', value: mostExpensive?.serviceName || '—', sub: mostExpensive ? `${currencySymbol}${fmt(monthlyAmount(mostExpensive.amount, mostExpensive.billingCycle))} / month` : 'No active plans' },
          { label:'Average per service', value: `${currencySymbol}${fmt(averageMonthlyCost)}`, sub:'Monthly equivalent' },
          { label:'Payments recorded', value: `${currencySymbol}${fmt(totalSpentHistory)}`, sub:`${payments.length} payment entries` },
        ].map((stat) => <div key={stat.label} className="ledger-card p-4 sm:p-5"><p className="text-xs ledger-muted">{stat.label}</p><p className="text-xl sm:text-2xl font-extrabold mt-3 truncate">{stat.value}</p><p className="text-[10px] ledger-muted mt-2">{stat.sub}</p></div>)}
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="ledger-card p-5 sm:p-6">
          <div className="flex items-start justify-between gap-3 mb-4"><div><p className="text-[10px] uppercase tracking-[.18em] ledger-muted font-semibold">Where it goes</p><h3 className="text-lg font-bold mt-1">Monthly cost by category</h3></div><PieChartIcon size={18} className="text-[#6e8d4c]"/></div>
          {pieChartData.length === 0 ? <div className="h-64 flex items-center justify-center text-sm ledger-muted">Add subscriptions to see category spending.</div> : <>
            <div className="h-64"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={pieChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={88} innerRadius={54} paddingAngle={3}>{pieChartData.map((entry) => <Cell key={entry.name} fill={entry.color}/>)}</Pie><Tooltip contentStyle={tooltipStyle} formatter={(value: any) => [`${currencySymbol}${value}`, 'Monthly cost']}/></PieChart></ResponsiveContainer></div>
            <div className="grid grid-cols-2 gap-3 border-t border-[#edf0e9] pt-4">{pieChartData.map((item) => <div key={item.name} className="flex items-center gap-2 text-xs min-w-0"><span className="w-2 h-2 rounded-full shrink-0" style={{backgroundColor:item.color}}/><span className="truncate text-[#748078]">{item.name}</span><span className="ml-auto ledger-mono">{currencySymbol}{fmt(item.value)}</span></div>)}</div>
          </>}
        </div>

        <div className="ledger-card p-5 sm:p-6">
          <div className="flex items-start justify-between gap-3 mb-4"><div><p className="text-[10px] uppercase tracking-[.18em] ledger-muted font-semibold">Budget check</p><h3 className="text-lg font-bold mt-1">Monthly spend vs limit</h3></div><BarChart3 size={18} className="text-[#b58a43]"/></div>
          <div className="flex justify-between items-end"><div><p className="text-xs ledger-muted">Monthly commitment</p><p className="ledger-mono text-3xl mt-1">{currencySymbol}{fmt(totalMonthlySpend)}</p></div><div className="text-right"><p className="text-xs ledger-muted">Budget limit</p><p className="ledger-mono text-lg mt-1">{currencySymbol}{fmt(budget.monthlyBudget)}</p></div></div>
          <div className="h-2 rounded-full bg-[#edf0e9] mt-5 overflow-hidden"><div className={`h-full rounded-full ${totalMonthlySpend > budget.monthlyBudget ? 'bg-[#d26d51]' : 'bg-[#8fac69]'}`} style={{width:`${Math.min(budget.monthlyBudget > 0 ? totalMonthlySpend / budget.monthlyBudget * 100 : 0,100)}%`}}/></div>
          <p className="text-xs ledger-muted mt-3">{budget.monthlyBudget > 0 ? Math.round(totalMonthlySpend / budget.monthlyBudget * 100) : 0}% of the planned limit used.</p>
          <div className="mt-8 border-t border-[#edf0e9] pt-5"><div className="flex items-center gap-2 text-[#678648]"><PiggyBank size={17}/><span className="text-[10px] uppercase tracking-[.15em] font-semibold">Projection note</span></div><p className="text-sm leading-relaxed mt-2">At the current run rate, twelve months of active subscriptions would total <strong className="ledger-mono">{currencySymbol}{fmt(projectedAnnual)}</strong>. This projection assumes no changes to your plans.</p></div>
        </div>
      </section>

      <section className="ledger-card p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3 mb-5"><div><p className="text-[10px] uppercase tracking-[.18em] ledger-muted font-semibold">Forward view</p><h3 className="text-lg font-bold mt-1">Annualized spend trajectory</h3><p className="text-xs ledger-muted mt-1">Projection based on current recurring commitments, not historical bank data.</p></div><TrendingUp size={18} className="text-[#6e8d4c]"/></div>
        <div className="h-72"><ResponsiveContainer width="100%" height="100%"><LineChart data={lineChartData} margin={{top:8,right:8,left:0,bottom:0}}><CartesianGrid stroke="#e8ece4" strokeDasharray="3 3"/><XAxis dataKey="month" stroke="#8a958c" fontSize={11} tickLine={false} axisLine={false}/><YAxis stroke="#8a958c" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(value) => `${currencySymbol}${value >= 1000 ? `${Math.round(value/1000)}k` : value}`}/><Tooltip contentStyle={tooltipStyle} formatter={(value: any) => [`${currencySymbol}${fmt(value)}`, 'Projected total']}/><Line type="monotone" dataKey="projected" stroke="#789d55" strokeWidth={3} dot={false} activeDot={{r:5,fill:'#baf36a',stroke:'#202b26'}}/></LineChart></ResponsiveContainer></div>
      </section>

      <section className="ledger-card overflow-hidden">
        <div className="p-5 border-b border-[#e2e5dd] flex items-center justify-between"><div><p className="text-[10px] uppercase tracking-[.18em] ledger-muted font-semibold">Recurring commitments</p><h3 className="text-lg font-bold mt-1">Cost leaders</h3></div><ChartNoAxesCombined size={18} className="text-[#6e8d4c]"/></div>
        {sortedByCost.length === 0 ? <p className="p-6 text-sm ledger-muted">No active subscriptions to compare yet.</p> : sortedByCost.slice(0,5).map((sub,index) => <div key={sub.id} className="p-4 border-b border-[#edf0e9] last:border-0 flex items-center gap-3"><span className="ledger-mono text-xs text-[#9aa49a] w-5">0{index+1}</span><div className="flex-1 min-w-0"><p className="text-sm font-semibold truncate">{sub.serviceName}</p><p className="text-[10px] ledger-muted mt-1">{sub.category} · {sub.billingCycle}</p></div><div className="text-right"><p className="ledger-mono text-sm">{currencySymbol}{fmt(monthlyAmount(sub.amount,sub.billingCycle))}</p><p className="text-[10px] ledger-muted">per month</p></div><ArrowUpRight size={15} className="text-[#8fac69]"/></div>)}
      </section>
    </div>
  );
};
