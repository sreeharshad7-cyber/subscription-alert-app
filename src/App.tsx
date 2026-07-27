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
    <div className={`min-h-screen font-sans selection:bg-indigo-500 selection:text-white transition-colors duration-200 ${darkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      {/* Mobile Device Frame Simulation Container or Fullscreen */}
      <div className={deviceFrameMode ? 'py-4 sm:py-8 px-2 flex justify-center items-center min-h-screen bg-slate-200/60 dark:bg-slate-950/90' : 'min-h-screen'}>
        <div
          className={
            deviceFrameMode
              ? 'w-full max-w-md bg-slate-50 dark:bg-slate-950 border-[8px] border-slate-900 rounded-[48px] shadow-2xl shadow-indigo-500/10 overflow-hidden relative flex flex-col min-h-[850px] my-auto ring-1 ring-slate-300 dark:ring-slate-800'
              : 'w-full max-w-7xl mx-auto flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950'
          }
        >
          {/* Mobile Phone Status Bar in Device Frame Mode */}
          {deviceFrameMode && (
            <div className="bg-slate-900 text-slate-200 text-[11px] font-bold px-6 py-2 flex items-center justify-between z-40 shrink-0">
              <span>9:41</span>
              {/* Camera Notch Punch Hole */}
              <div className="w-16 h-3.5 bg-slate-950 rounded-full mx-auto shadow-inner" />
              <div className="flex items-center gap-1.5">
                <Signal size={12} />
                <Wifi size={12} />
                <Battery size={13} className="text-emerald-400 fill-emerald-400" />
              </div>
            </div>
          )}

          {/* Top AppBar Header */}
          <Header
            onOpenAuth={() => setIsAuthOpen(true)}
            onOpenAiModal={() => setIsAiModalOpen(true)}
            onOpenSearch={() => setActiveTab('subscriptions')}
          />

          {/* Main View Area */}
          <main className="flex-1 p-4 md:p-6 overflow-y-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {renderActiveTabContent()}
              </motion.div>
            </AnimatePresence>
          </main>

          {/* Bottom Navigation */}
          <BottomNav />
        </div>
      </div>

      {/* Global Modals & Drawers */}
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
