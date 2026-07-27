import React, { useState } from 'react';
import { useSubscription } from '../context/SubscriptionContext';
import { ScanLine, X, Upload, FileText, Sparkles, Check, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ReceiptOcrModal: React.FC = () => {
  const { isOcrModalOpen, setIsOcrModalOpen, scanReceiptImage, parseEmailSmsText, addSubscription, currencySymbol } =
    useSubscription();

  const [activeTab, setActiveTab] = useState<'receipt' | 'sms'>('receipt');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [rawText, setRawText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState<any | null>(null);

  if (!isOcrModalOpen) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleScanReceipt = async () => {
    if (!imagePreview) return;
    setIsProcessing(true);
    setExtractedData(null);

    const parsed = await scanReceiptImage(imagePreview);
    setIsProcessing(false);
    if (parsed) {
      setExtractedData(parsed);
    }
  };

  const handleParseSms = async () => {
    if (!rawText.trim()) return;
    setIsProcessing(true);
    setExtractedData(null);

    const parsed = await parseEmailSmsText(rawText);
    setIsProcessing(false);
    if (parsed) {
      setExtractedData(parsed);
    }
  };

  const handleConfirmAdd = () => {
    if (!extractedData) return;

    addSubscription({
      serviceName: extractedData.serviceName || 'Scanned Service',
      category: extractedData.category || 'Utilities',
      amount: extractedData.amount || 499,
      currency: extractedData.currency === 'INR' ? '₹' : currencySymbol,
      billingCycle: extractedData.billingCycle || 'Monthly',
      renewalDate: extractedData.renewalDate || new Date().toISOString().split('T')[0],
      reminderDays: 3,
      paymentMethod: extractedData.paymentMethod || 'UPI',
      autoRenew: true,
      notes: extractedData.notes || 'Imported via OCR Scanner',
      logo: 'default',
    });

    handleClose();
  };

  const handleClose = () => {
    setIsOcrModalOpen(false);
    setSelectedFile(null);
    setImagePreview(null);
    setRawText('');
    setExtractedData(null);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-indigo-500/30 rounded-[2rem] max-w-lg w-full p-6 shadow-2xl space-y-5 my-auto max-h-[90vh] overflow-y-auto relative"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                <ScanLine size={22} />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Smart OCR Receipt & SMS Scanner</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Extract subscription details automatically with AI</p>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Mode Tabs */}
          <div className="flex rounded-2xl bg-slate-100 dark:bg-slate-950 p-1 border border-slate-200 dark:border-slate-800">
            <button
              onClick={() => {
                setActiveTab('receipt');
                setExtractedData(null);
              }}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'receipt'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Receipt Screenshot OCR
            </button>
            <button
              onClick={() => {
                setActiveTab('sms');
                setExtractedData(null);
              }}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'sms'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Paste SMS / Email Receipt
            </button>
          </div>

          {/* Tab 1: Receipt Image Scan */}
          {activeTab === 'receipt' ? (
            <div className="space-y-4">
              <label className="border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-indigo-500 rounded-[1.5rem] p-6 flex flex-col items-center justify-center cursor-pointer transition-colors text-center bg-slate-50 dark:bg-slate-950/40">
                <Upload size={32} className="text-indigo-600 dark:text-indigo-400 mb-2" />
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Upload Receipt or Screenshot</span>
                <span className="text-[10px] text-slate-400 mt-1">PNG, JPG or WebP (Max 10MB)</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>

              {imagePreview && (
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 max-h-48 flex items-center justify-center bg-slate-50 dark:bg-slate-950">
                  <img src={imagePreview} alt="Receipt preview" className="object-contain max-h-48" />
                </div>
              )}

              <button
                onClick={handleScanReceipt}
                disabled={!imagePreview || isProcessing}
                className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md disabled:opacity-50 cursor-pointer"
              >
                <Sparkles size={16} />
                <span>{isProcessing ? 'AI Extracting Details...' : 'Scan Receipt with Gemini AI'}</span>
              </button>
            </div>
          ) : (
            /* Tab 2: SMS Text Parser */
            <div className="space-y-4">
              <textarea
                rows={4}
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                placeholder="Paste payment confirmation SMS or Email text (e.g. 'Your subscription for Netflix of Rs. 649 renewed successfully. Next due 2026-08-25.')"
                className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />

              <button
                onClick={handleParseSms}
                disabled={!rawText.trim() || isProcessing}
                className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md disabled:opacity-50 cursor-pointer"
              >
                <FileText size={16} />
                <span>{isProcessing ? 'Parsing Message...' : 'Parse Payment Message'}</span>
              </button>
            </div>
          )}

          {/* Extracted Details Preview */}
          {extractedData && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-500/40 space-y-3"
            >
              <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-xs">
                <Check size={16} />
                <span>Extracted Subscription Details:</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-slate-800 dark:text-slate-200">
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Service</span>
                  <span className="font-bold">{extractedData.serviceName}</span>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Amount</span>
                  <span className="font-bold text-emerald-700 dark:text-emerald-400">
                    {extractedData.currency || '₹'} {extractedData.amount}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Category</span>
                  <span className="font-bold">{extractedData.category}</span>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Renewal Date</span>
                  <span className="font-bold">{extractedData.renewalDate}</span>
                </div>
              </div>

              <button
                onClick={handleConfirmAdd}
                className="w-full py-2.5 rounded-xl bg-emerald-500 text-white font-extrabold text-xs hover:bg-emerald-600 transition-all cursor-pointer shadow-md"
              >
                Add This Subscription
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
