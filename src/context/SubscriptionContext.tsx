import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Subscription,
  PaymentHistory,
  NotificationItem,
  AiSuggestion,
  User,
  BudgetConfig,
  CategoryType,
  BillingCycleType,
  PaymentMethodType,
} from '../types';
import {
  INITIAL_USER,
  INITIAL_SUBSCRIPTIONS,
  INITIAL_PAYMENTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_AI_SUGGESTIONS,
} from '../data/initialData';
import confetti from 'canvas-confetti';
import { jsPDF } from 'jspdf';

interface SubscriptionContextType {
  subscriptions: Subscription[];
  payments: PaymentHistory[];
  notifications: NotificationItem[];
  aiSuggestions: AiSuggestion[];
  user: User;
  budget: BudgetConfig;
  currencySymbol: string;
  darkMode: boolean;
  deviceFrameMode: boolean;
  isSyncing: boolean;
  isAiLoading: boolean;
  activeTab: 'dashboard' | 'subscriptions' | 'calendar' | 'analytics' | 'settings';
  setActiveTab: (tab: 'dashboard' | 'subscriptions' | 'calendar' | 'analytics' | 'settings') => void;
  selectedSubscriptionForDetail: Subscription | null;
  setSelectedSubscriptionForDetail: (sub: Subscription | null) => void;
  isAddModalOpen: boolean;
  setIsAddModalOpen: (open: boolean) => void;
  editingSubscription: Subscription | null;
  setEditingSubscription: (sub: Subscription | null) => void;
  isOcrModalOpen: boolean;
  setIsOcrModalOpen: (open: boolean) => void;
  isFlutterCodeDrawerOpen: boolean;
  setIsFlutterCodeDrawerOpen: (open: boolean) => void;
  addSubscription: (subData: Omit<Subscription, 'id' | 'createdAt' | 'userId' | 'status'>) => void;
  updateSubscription: (id: string, subData: Partial<Subscription>) => void;
  deleteSubscription: (id: string) => void;
  markAsPaid: (id: string) => void;
  toggleAutoRenew: (id: string) => void;
  setBudgetAmount: (amount: number) => void;
  setCurrencySymbol: (currency: string) => void;
  toggleDarkMode: () => void;
  toggleDeviceFrameMode: () => void;
  syncCloud: () => Promise<void>;
  refreshAiSuggestions: () => Promise<void>;
  scanReceiptImage: (imageBase64: string) => Promise<any>;
  parseEmailSmsText: (rawText: string) => Promise<any>;
  markNotificationRead: (id: string) => void;
  setUser: (user: User) => void;
  exportCSV: () => void;
  exportPDF: () => void;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load from localStorage or initial
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(() => {
    const saved = localStorage.getItem('sub_alert_subscriptions');
    return saved ? JSON.parse(saved) : INITIAL_SUBSCRIPTIONS;
  });

  const [payments, setPayments] = useState<PaymentHistory[]>(() => {
    const saved = localStorage.getItem('sub_alert_payments');
    return saved ? JSON.parse(saved) : INITIAL_PAYMENTS;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('sub_alert_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [aiSuggestions, setAiSuggestions] = useState<AiSuggestion[]>(() => {
    const saved = localStorage.getItem('sub_alert_ai');
    return saved ? JSON.parse(saved) : INITIAL_AI_SUGGESTIONS;
  });

  const [user, setUser] = useState<User>(() => {
    const saved = localStorage.getItem('sub_alert_user');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  const [budget, setBudget] = useState<BudgetConfig>(() => {
    const saved = localStorage.getItem('sub_alert_budget');
    return saved ? JSON.parse(saved) : { monthlyBudget: 12000, warningThresholdPercent: 90 };
  });

  const [currencySymbol, setCurrencySymbolState] = useState<string>(() => {
    return localStorage.getItem('sub_alert_currency') || '₹';
  });

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('sub_alert_dark');
    return saved ? JSON.parse(saved) : false; // Default light mode for Sleek Interface theme
  });

  const [deviceFrameMode, setDeviceFrameMode] = useState<boolean>(() => {
    return localStorage.getItem('sub_alert_frame') !== 'false'; // default true
  });

  const [activeTab, setActiveTab] = useState<'dashboard' | 'subscriptions' | 'calendar' | 'analytics' | 'settings'>('dashboard');
  const [selectedSubscriptionForDetail, setSelectedSubscriptionForDetail] = useState<Subscription | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null);
  const [isOcrModalOpen, setIsOcrModalOpen] = useState(false);
  const [isFlutterCodeDrawerOpen, setIsFlutterCodeDrawerOpen] = useState(false);

  const [isSyncing, setIsSyncing] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('sub_alert_subscriptions', JSON.stringify(subscriptions));
  }, [subscriptions]);

  useEffect(() => {
    localStorage.setItem('sub_alert_payments', JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    localStorage.setItem('sub_alert_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('sub_alert_ai', JSON.stringify(aiSuggestions));
  }, [aiSuggestions]);

  useEffect(() => {
    localStorage.setItem('sub_alert_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('sub_alert_budget', JSON.stringify(budget));
  }, [budget]);

  useEffect(() => {
    localStorage.setItem('sub_alert_currency', currencySymbol);
  }, [currencySymbol]);

  useEffect(() => {
    localStorage.setItem('sub_alert_dark', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('sub_alert_frame', JSON.stringify(deviceFrameMode));
  }, [deviceFrameMode]);

  // Actions
  const addSubscription = (subData: Omit<Subscription, 'id' | 'createdAt' | 'userId' | 'status'>) => {
    const newSub: Subscription = {
      ...subData,
      id: 'sub_' + Date.now(),
      userId: user.id,
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
    };

    setSubscriptions((prev) => [newSub, ...prev]);

    // Add notification
    const newNotif: NotificationItem = {
      id: 'notif_' + Date.now(),
      subscriptionId: newSub.id,
      serviceName: newSub.serviceName,
      notificationDate: new Date().toISOString().split('T')[0],
      message: `${newSub.serviceName} added! Next renewal on ${newSub.renewalDate}.`,
      status: 'unread',
      amount: newSub.amount,
      currency: newSub.currency || currencySymbol,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const updateSubscription = (id: string, subData: Partial<Subscription>) => {
    setSubscriptions((prev) =>
      prev.map((sub) => (sub.id === id ? { ...sub, ...subData } : sub))
    );
    if (selectedSubscriptionForDetail && selectedSubscriptionForDetail.id === id) {
      setSelectedSubscriptionForDetail((prev) => (prev ? { ...prev, ...subData } : null));
    }
  };

  const deleteSubscription = (id: string) => {
    setSubscriptions((prev) => prev.filter((sub) => sub.id !== id));
    if (selectedSubscriptionForDetail?.id === id) {
      setSelectedSubscriptionForDetail(null);
    }
  };

  const markAsPaid = (id: string) => {
    const sub = subscriptions.find((s) => s.id === id);
    if (!sub) return;

    // Confetti burst
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#4F46E5', '#22C55E', '#3B82F6', '#EC4899'],
    });

    // Advance renewal date by billing cycle
    const oldDate = new Date(sub.renewalDate);
    let nextDate = new Date(oldDate);

    if (sub.billingCycle === 'Monthly') {
      nextDate.setMonth(nextDate.getMonth() + 1);
    } else if (sub.billingCycle === 'Quarterly') {
      nextDate.setMonth(nextDate.getMonth() + 3);
    } else if (sub.billingCycle === 'Half Yearly') {
      nextDate.setMonth(nextDate.getMonth() + 6);
    } else if (sub.billingCycle === 'Yearly') {
      nextDate.setFullYear(nextDate.getFullYear() + 1);
    }

    const nextDateStr = nextDate.toISOString().split('T')[0];

    updateSubscription(id, { renewalDate: nextDateStr });

    // Record in payment history
    const newPayment: PaymentHistory = {
      id: 'pay_' + Date.now(),
      subscriptionId: sub.id,
      serviceName: sub.serviceName,
      paymentDate: new Date().toISOString().split('T')[0],
      amount: sub.amount,
      currency: sub.currency || currencySymbol,
      status: 'paid',
    };
    setPayments((prev) => [newPayment, ...prev]);

    // Mark notification read or add new confirmation
    setNotifications((prev) => [
      {
        id: 'notif_' + Date.now(),
        subscriptionId: sub.id,
        serviceName: sub.serviceName,
        notificationDate: new Date().toISOString().split('T')[0],
        message: `Marked ${sub.serviceName} (${sub.currency}${sub.amount}) as PAID! Next due on ${nextDateStr}.`,
        status: 'unread',
        amount: sub.amount,
        currency: sub.currency,
      },
      ...prev,
    ]);
  };

  const toggleAutoRenew = (id: string) => {
    const sub = subscriptions.find((s) => s.id === id);
    if (sub) {
      updateSubscription(id, { autoRenew: !sub.autoRenew });
    }
  };

  const setBudgetAmount = (amount: number) => {
    setBudget((prev) => ({ ...prev, monthlyBudget: amount }));
  };

  const setCurrencySymbol = (curr: string) => {
    setCurrencySymbolState(curr);
    setSubscriptions((prev) =>
      prev.map((s) => ({ ...s, currency: curr }))
    );
  };

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  const toggleDeviceFrameMode = () => {
    setDeviceFrameMode((prev) => !prev);
  };

  const syncCloud = async () => {
    setIsSyncing(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSyncing(false);
  };

  const refreshAiSuggestions = async () => {
    setIsAiLoading(true);
    try {
      const res = await fetch('/api/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subscriptions,
          budget: budget.monthlyBudget,
          currency: currencySymbol,
        }),
      });
      const data = await res.json();
      if (data.suggestions && Array.isArray(data.suggestions)) {
        setAiSuggestions(data.suggestions);
      }
    } catch (e) {
      console.error('Failed to refresh AI suggestions', e);
    } finally {
      setIsAiLoading(false);
    }
  };

  const scanReceiptImage = async (imageBase64: string) => {
    try {
      const res = await fetch('/api/ocr-scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64 }),
      });
      const data = await res.json();
      return data.parsed;
    } catch (e) {
      console.error('Failed to scan receipt image', e);
      return null;
    }
  };

  const parseEmailSmsText = async (rawText: string) => {
    try {
      const res = await fetch('/api/parse-email-sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawText }),
      });
      const data = await res.json();
      return data.parsed;
    } catch (e) {
      console.error('Failed to parse text', e);
      return null;
    }
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, status: 'read' } : n))
    );
  };

  const exportCSV = () => {
    const headers = ['Service Name', 'Category', 'Amount', 'Currency', 'Billing Cycle', 'Renewal Date', 'Auto Renew', 'Payment Method'];
    const rows = subscriptions.map((s) => [
      `"${s.serviceName}"`,
      `"${s.category}"`,
      s.amount,
      `"${s.currency}"`,
      `"${s.billingCycle}"`,
      `"${s.renewalDate}"`,
      s.autoRenew ? 'ON' : 'OFF',
      `"${s.paymentMethod}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Subscription_Alert_Export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Subscription Alert - Statement Summary', 14, 22);

    doc.setFontSize(10);
    doc.text(`User: ${user.name} (${user.email})`, 14, 30);
    doc.text(`Generated Date: ${new Date().toLocaleDateString()}`, 14, 36);

    let y = 48;
    doc.setFontSize(12);
    doc.text('Active Subscriptions:', 14, y);
    y += 8;

    doc.setFontSize(9);
    subscriptions.forEach((sub, i) => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      doc.text(
        `${i + 1}. ${sub.serviceName} | ${sub.category} | ${sub.currency}${sub.amount} (${sub.billingCycle}) | Renewal: ${sub.renewalDate} | Auto-renew: ${sub.autoRenew ? 'YES' : 'NO'}`,
        14,
        y
      );
      y += 6;
    });

    doc.save(`Subscription_Alert_Report_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <SubscriptionContext.Provider
      value={{
        subscriptions,
        payments,
        notifications,
        aiSuggestions,
        user,
        budget,
        currencySymbol,
        darkMode,
        deviceFrameMode,
        isSyncing,
        isAiLoading,
        activeTab,
        setActiveTab,
        selectedSubscriptionForDetail,
        setSelectedSubscriptionForDetail,
        isAddModalOpen,
        setIsAddModalOpen,
        editingSubscription,
        setEditingSubscription,
        isOcrModalOpen,
        setIsOcrModalOpen,
        isFlutterCodeDrawerOpen,
        setIsFlutterCodeDrawerOpen,
        addSubscription,
        updateSubscription,
        deleteSubscription,
        markAsPaid,
        toggleAutoRenew,
        setBudgetAmount,
        setCurrencySymbol,
        toggleDarkMode,
        toggleDeviceFrameMode,
        syncCloud,
        refreshAiSuggestions,
        scanReceiptImage,
        parseEmailSmsText,
        markNotificationRead,
        setUser,
        exportCSV,
        exportPDF,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};
