import React, { useState } from 'react';
import { useSubscription } from '../context/SubscriptionContext';
import { Code2, X, Copy, Check, FileCode, Layers, Database, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const FlutterCodeDrawer: React.FC = () => {
  const { isFlutterCodeDrawerOpen, setIsFlutterCodeDrawerOpen } = useSubscription();

  const [activeCodeTab, setActiveCodeTab] = useState<
    'pubspec' | 'models' | 'provider' | 'sqlite' | 'firestore'
  >('pubspec');
  const [copied, setCopied] = useState(false);

  if (!isFlutterCodeDrawerOpen) return null;

  const codeSnippets = {
    pubspec: `name: subscription_alert
description: "Subscription Alert - Mobile Subscription & Bill Manager"
publish_to: 'none'
version: 1.0.0+1

environment:
  sdk: '>=3.0.0 <4.0.0'

dependencies:
  flutter:
    sdk: flutter
  cupertino_icons: ^1.0.6
  provider: ^6.1.1
  firebase_core: ^2.24.2
  cloud_firestore: ^4.14.0
  firebase_auth: ^4.16.0
  flutter_local_notifications: ^16.3.0
  sqflite: ^2.3.0
  path: ^1.8.3
  fl_chart: ^0.66.0
  google_sign_in: ^6.2.1
  intl: ^0.19.0

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^3.0.0

flutter:
  uses-material-design: true`,

    models: `// lib/models/subscription_model.dart
import 'package:cloud_firestore/cloud_firestore.dart';

class SubscriptionModel {
  final String id;
  final String userId;
  final String serviceName;
  final String category;
  final String logo;
  final double amount;
  final String currency;
  final String billingCycle;
  final String renewalDate;
  final int reminderDays;
  final String paymentMethod;
  final bool autoRenew;
  final String? notes;

  SubscriptionModel({
    required this.id,
    required this.userId,
    required this.serviceName,
    required this.category,
    required this.logo,
    required this.amount,
    required this.currency,
    required this.billingCycle,
    required this.renewalDate,
    required this.reminderDays,
    required this.paymentMethod,
    required this.autoRenew,
    this.notes,
  });

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'userId': userId,
      'serviceName': serviceName,
      'category': category,
      'logo': logo,
      'amount': amount,
      'currency': currency,
      'billingCycle': billingCycle,
      'renewalDate': renewalDate,
      'reminderDays': reminderDays,
      'paymentMethod': paymentMethod,
      'autoRenew': autoRenew ? 1 : 0,
      'notes': notes,
    };
  }

  factory SubscriptionModel.fromMap(Map<String, dynamic> map) {
    return SubscriptionModel(
      id: map['id'] ?? '',
      userId: map['userId'] ?? '',
      serviceName: map['serviceName'] ?? '',
      category: map['category'] ?? 'Others',
      logo: map['logo'] ?? 'default',
      amount: (map['amount'] as num).toDouble(),
      currency: map['currency'] ?? '₹',
      billingCycle: map['billingCycle'] ?? 'Monthly',
      renewalDate: map['renewalDate'] ?? '',
      reminderDays: map['reminderDays'] ?? 3,
      paymentMethod: map['paymentMethod'] ?? 'Credit Card',
      autoRenew: map['autoRenew'] == 1 || map['autoRenew'] == true,
      notes: map['notes'],
    );
  }
}`,

    provider: `// lib/providers/subscription_provider.dart
import 'package:flutter/material.dart';
import '../models/subscription_model.dart';
import '../services/local_database_service.dart';

class SubscriptionProvider extends ChangeNotifier {
  List<SubscriptionModel> _subscriptions = [];
  bool _isLoading = false;

  List<SubscriptionModel> get subscriptions => _subscriptions;
  bool get isLoading => _isLoading;

  double get totalMonthlySpend {
    return _subscriptions.fold(0.0, (sum, sub) {
      if (sub.billingCycle == 'Yearly') return sum + (sub.amount / 12);
      if (sub.billingCycle == 'Quarterly') return sum + (sub.amount / 3);
      return sum + sub.amount;
    });
  }

  Future<void> fetchSubscriptions() async {
    _isLoading = true;
    notifyListeners();
    _subscriptions = await LocalDatabaseService.instance.getAllSubscriptions();
    _isLoading = false;
    notifyListeners();
  }

  Future<void> addSubscription(SubscriptionModel sub) async {
    await LocalDatabaseService.instance.insertSubscription(sub);
    _subscriptions.insert(0, sub);
    notifyListeners();
  }

  Future<void> deleteSubscription(String id) async {
    await LocalDatabaseService.instance.deleteSubscription(id);
    _subscriptions.removeWhere((s) => s.id == id);
    notifyListeners();
  }
}`,

    sqlite: `// lib/services/local_database_service.dart
import 'package:sqflite/sqflite.dart';
import 'package:path/path.dart';
import '../models/subscription_model.dart';

class LocalDatabaseService {
  static final LocalDatabaseService instance = LocalDatabaseService._init();
  static Database? _database;

  LocalDatabaseService._init();

  Future<Database> get database async {
    if (_database != null) return _database!;
    _database = await _initDB('subscription_alert.db');
    return _database!;
  }

  Future<Database> _initDB(String filePath) async {
    final dbPath = await getDatabasesPath();
    final pathStr = join(dbPath, filePath);

    return await openDatabase(
      pathStr,
      version: 1,
      onCreate: (db, version) async {
        await db.execute('''
          CREATE TABLE subscriptions (
            id TEXT PRIMARY KEY,
            userId TEXT NOT NULL,
            serviceName TEXT NOT NULL,
            category TEXT NOT NULL,
            logo TEXT NOT NULL,
            amount REAL NOT NULL,
            currency TEXT NOT NULL,
            billingCycle TEXT NOT NULL,
            renewalDate TEXT NOT NULL,
            reminderDays INTEGER NOT NULL,
            paymentMethod TEXT NOT NULL,
            autoRenew INTEGER NOT NULL,
            notes TEXT
          )
        ''');
      },
    );
  }

  Future<int> insertSubscription(SubscriptionModel sub) async {
    final db = await instance.database;
    return await db.insert('subscriptions', sub.toMap(), conflictAlgorithm: ConflictAlgorithm.replace);
  }

  Future<List<SubscriptionModel>> getAllSubscriptions() async {
    final db = await instance.database;
    final result = await db.query('subscriptions', orderBy: 'renewalDate ASC');
    return result.map((json) => SubscriptionModel.fromMap(json)).toList();
  }

  Future<int> deleteSubscription(String id) async {
    final db = await instance.database;
    return await db.delete('subscriptions', where: 'id = ?', whereArgs: [id]);
  }
}`,

    firestore: `// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /subscriptions/{subscriptionId} {
      allow read, write: if request.auth != null && resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
    }
    
    match /payments/{paymentId} {
      allow read, write: if request.auth != null && resource.data.userId == request.auth.uid;
    }
  }
}`,
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(codeSnippets[activeCodeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-indigo-500/40 rounded-[2rem] max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] flex flex-col relative"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                <Code2 size={22} />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Flutter Project Architecture</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Complete Mobile App Dart & Firestore Source Code</p>
              </div>
            </div>

            <button
              onClick={() => setIsFlutterCodeDrawerOpen(false)}
              className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Sub Navigation Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-950 p-1 rounded-2xl overflow-x-auto no-scrollbar border border-slate-200 dark:border-slate-800 text-xs">
            <button
              onClick={() => setActiveCodeTab('pubspec')}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeCodeTab === 'pubspec' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              pubspec.yaml
            </button>
            <button
              onClick={() => setActiveCodeTab('models')}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeCodeTab === 'models' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Model
            </button>
            <button
              onClick={() => setActiveCodeTab('provider')}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeCodeTab === 'provider' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Provider State
            </button>
            <button
              onClick={() => setActiveCodeTab('sqlite')}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeCodeTab === 'sqlite' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              SQLite Service
            </button>
            <button
              onClick={() => setActiveCodeTab('firestore')}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeCodeTab === 'firestore' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Firestore Rules
            </button>
          </div>

          {/* Code Viewer Box */}
          <div className="relative flex-1 bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden flex flex-col min-h-[280px]">
            <div className="p-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>{activeCodeTab}.dart</span>
              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-bold cursor-pointer"
              >
                {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                <span>{copied ? 'Copied!' : 'Copy Code'}</span>
              </button>
            </div>

            <pre className="p-4 overflow-auto text-[11px] font-mono text-emerald-400 leading-relaxed max-h-72">
              <code>{codeSnippets[activeCodeTab]}</code>
            </pre>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
