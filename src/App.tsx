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

function AppContent() {
  const { activeTab, setActiveTab, darkMode } = useSubscription();
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
    <div className={`ledger-shell min-h-screen w-full transition-colors duration-200 ${darkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-[#f5f5f0] text-[#19231f]'}`}>
      <div className="min-h-screen w-full">
        <div className="mx-auto flex min-h-screen w-full max-w-[1600px] flex-col bg-transparent">
          <Header
            onOpenAuth={() => setIsAuthOpen(true)}
            onOpenAiModal={() => setIsAiModalOpen(true)}
            onOpenSearch={() => setActiveTab('subscriptions')}
          />

          <main className="w-full flex-1 overflow-y-auto px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">
            <div className="mx-auto mb-6 flex w-full max-w-[1440px] items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-[11px] uppercase tracking-[.19em] text-[#748078]">
                <span className="inline-block h-2 w-2 rounded-full bg-lime-500" />
                Personal finance workspace
                <span className="text-[#b4bcb2]">/</span>
                <span className="font-semibold tracking-[.12em] text-[#19231f]">{activeTab}</span>
              </div>
              <div className="hidden items-center gap-2 text-xs text-[#748078] md:flex">
                <span className="ledger-mono">LEDGER / 01</span>
                <span className="h-px w-10 bg-[#d7ddd3]" />
                <span>Subscription control center</span>
              </div>
            </div>

            <div className="mx-auto w-full max-w-[1440px]">
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
