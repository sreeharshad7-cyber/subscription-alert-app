export type CategoryType =
  | 'Entertainment'
  | 'Utilities'
  | 'Gaming'
  | 'Education'
  | 'Cloud'
  | 'Shopping'
  | 'Finance'
  | 'Others';

export type BillingCycleType = 'Monthly' | 'Quarterly' | 'Half Yearly' | 'Yearly';

export type PaymentMethodType = 'UPI' | 'Debit Card' | 'Credit Card' | 'Net Banking' | 'Cash';

export type CurrencyCode = 'INR' | 'USD' | 'EUR' | 'GBP';

export interface User {
  id: string;
  name: string;
  email: string;
  photo?: string;
  isGuest: boolean;
}

export interface Subscription {
  id: string;
  userId: string;
  serviceName: string;
  category: CategoryType;
  logo: string; // Presets or custom image base64/URL
  amount: number;
  currency: string; // e.g. "₹", "$", "€", "£"
  billingCycle: BillingCycleType;
  renewalDate: string; // YYYY-MM-DD
  reminderDays: number; // e.g. 1, 3, 7, 15, 30
  paymentMethod: PaymentMethodType;
  autoRenew: boolean;
  notes?: string;
  status: 'active' | 'cancelled' | 'paused';
  createdAt: string;
}

export interface PaymentHistory {
  id: string;
  subscriptionId: string;
  serviceName: string;
  paymentDate: string;
  amount: number;
  currency: string;
  status: 'paid' | 'overdue' | 'pending';
}

export interface NotificationItem {
  id: string;
  subscriptionId: string;
  serviceName: string;
  notificationDate: string;
  message: string;
  status: 'unread' | 'read';
  amount: number;
  currency: string;
}

export interface AiSuggestion {
  id: string;
  type: 'warning' | 'savings' | 'insight';
  title: string;
  message: string;
  potentialSavings: number;
  actionText: string;
  actionType: string;
}

export interface BudgetConfig {
  monthlyBudget: number;
  warningThresholdPercent: number; // e.g. 90%
}
