/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SubscriptionProvider, useSubscription } from './context/SubscriptionContext';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { DashboardView } from './components/DashboardView';
import { SubscriptionsView } from './components/SubscriptionsView';
import { CalendarView } from './components/CalendarView';
import { AnalyticsView } from './components/AnalyticsView';
import { SettingsView } from './components/SettingsView';
import { AddEditSubscriptionModal } from './components/AddEditSubscriptionModal';
import { SubscriptionDetailModal } from './components/SubscriptionDetailModal';
import { AiSmartAdvisorModal } from './components/AiSmartAdvisorModal';
import { ReceiptOcrModal } from './components/ReceiptOcrModal';
import { FlutterCodeDrawer } from './components/FlutterCodeDrawer';
import { AuthModal } from './components/AuthModal';
import { motion, AnimatePresence } from 'motion/react';
import { Smartphone, Wifi, Battery, Signal } from 'lucide-react';

function AppContent() {
  const { activeTab, setActiveTab, deviceFrameMode, darkMode } = useSubscription();

  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView onOpenAiModal={() => setIsAiModalOpen(true)} />;
      case 'subscriptions':
        return <SubscriptionsView />;
      case 'calendar':
        return <CalendarView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView onOpenAiModal={() => setIsAiModalOpen(true)} />;
    }
  };

  return (
    <div className={`ledger-shell min-h-screen transition-colors duration-200 ${darkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-[#f5f5f0] text-[#19231f]'}`}>
      <div className={deviceFrameMode ? 'py-4 sm:py-8 px-2 flex justify-center items-center min-h-screen bg-stone-200/60 dark:bg-slate-950/90' : 'min-h-screen'}>
        <div
          className={
            deviceFrameMode
              ? 'w-full max-w-md bg-[#f5f5f0] dark:bg-slate-950 border-[8px] border-slate-900 rounded-[36px] shadow-2xl overflow-hidden relative flex flex-col min-h-[850px] my-auto'
              : 'w-full max-w-[1440px] mx-auto flex flex-col min-h-screen bg-transparent'
          }
        >
          {deviceFrameMode && (
            <div className="bg-[#202b26] text-slate-200 text-[11px] font-bold px-6 py-2 flex items-center justify-between z-40 shrink-0">
              <span>9:41</span>
              <div className="w-16 h-3.5 bg-slate-950 rounded-full mx-auto shadow-inner" />
              <div className="flex items-center gap-1.5">
                <Signal size={12} />
                <Wifi size={12} />
                <Battery size={13} className="text-lime-300 fill-lime-300" />
              </div>
            </div>
          )}

          <Header
            onOpenAuth={() => setIsAuthOpen(true)}
            onOpenAiModal={() => setIsAiModalOpen(true)}
            onOpenSearch={() => setActiveTab('subscriptions')}
          />

          <main className={deviceFrameMode ? 'flex-1 p-3 sm:p-4 overflow-y-auto' : 'flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-8 overflow-y-auto'}>
            {!deviceFrameMode && (
              <div className="mx-auto max-w-[1240px] mb-6 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-[11px] uppercase tracking-[.19em] text-[#748078]">
                  <span className="inline-block h-2 w-2 rounded-full bg-lime-500" />
                  Personal finance workspace
                  <span className="text-[#b4bcb2]">/</span>
                  <span className="text-[#19231f] font-semibold tracking-[.12em]">{activeTab}</span>
                </div>
                <div className="hidden md:flex items-center gap-2 text-xs text-[#748078]">
                  <span className="ledger-mono">LEDGER / 01</span>
                  <span className="h-px w-10 bg-[#d7ddd3]" />
                  <span>Subscription control center</span>
                </div>
              </div>
            )}
            <div className={deviceFrameMode ? '' : 'mx-auto max-w-[1240px]'}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.18 }}
                >
                  {renderActiveTabContent()}
                </motion.div>
              </AnimatePresence>
            </div>
          </main>

          <BottomNav />
        </div>
      </div>

      <AddEditSubscriptionModal />
      <SubscriptionDetailModal />
      <AiSmartAdvisorModal isOpen={isAiModalOpen} onClose={() => setIsAiModalOpen(false)} />
      <ReceiptOcrModal />
      <FlutterCodeDrawer />
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </div>
  );
}

export default function App() {
  return (
    <SubscriptionProvider>
      <AppContent />
    </SubscriptionProvider>
  );
}
