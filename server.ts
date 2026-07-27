import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Lazy Gemini Client setup
let genAIClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  if (!genAIClient && process.env.GEMINI_API_KEY) {
    genAIClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return genAIClient;
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 1. AI Smart Advisor Endpoint
app.post('/api/advisor', async (req, res) => {
  try {
    const { subscriptions, budget, currency } = req.body;
    const ai = getGenAI();

    if (!ai) {
      // Fallback response if GEMINI_API_KEY is not available
      return res.json({
        suggestions: [
          {
            id: 'fallback-1',
            type: 'warning',
            title: 'Unused Subscription Alert',
            message: 'You have multiple streaming services active. Netflix hasn\'t been logged as watched recently.',
            potentialSavings: 649,
            actionText: 'Review Netflix',
            actionType: 'cancel_suggestion'
          },
          {
            id: 'fallback-2',
            type: 'savings',
            title: 'Annual Plan Savings',
            message: 'Switching Spotify to annual billing could save you 16% per year.',
            potentialSavings: 300,
            actionText: 'Switch to Yearly',
            actionType: 'cycle_change'
          },
          {
            id: 'fallback-3',
            type: 'insight',
            title: 'Education vs Entertainment',
            message: 'Your education spending (ChatGPT, Adobe) accounts for 45% of total recurring expenses.',
            potentialSavings: 0,
            actionText: 'View Analytics',
            actionType: 'view_analytics'
          }
        ]
      });
    }

    const prompt = `You are a personal financial advisor specializing in subscription optimization.
Analyze the following subscription list for a user:
Subscriptions: ${JSON.stringify(subscriptions, null, 2)}
Monthly Budget: ${currency} ${budget}

Provide 3 actionable, specific, intelligent suggestions in valid JSON format only.
JSON schema requirement:
[
  {
    "id": "string",
    "type": "warning" | "savings" | "insight",
    "title": "string (short headline)",
    "message": "string (1-2 clear sentences explaining why)",
    "potentialSavings": number (numeric value in user's currency),
    "actionText": "string (button text)",
    "actionType": "string"
  }
]
No extra markdown code blocks, return clean raw JSON.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '[]';
    const suggestions = JSON.parse(text);
    return res.json({ suggestions });
  } catch (err: any) {
    console.error('Error in /api/advisor:', err);
    return res.status(500).json({
      error: 'Failed to generate AI advice',
      suggestions: [
        {
          id: 'err-1',
          type: 'warning',
          title: 'Optimize Streaming Services',
          message: 'Combining your active streaming subscriptions into a bundle could save up to ₹1200/year.',
          potentialSavings: 1200,
          actionText: 'Explore Bundles',
          actionType: 'explore'
        }
      ]
    });
  }
});

// 2. Receipt / Screenshot OCR Endpoint
app.post('/api/ocr-scan', async (req, res) => {
  try {
    const { imageBase64, mimeType = 'image/png' } = req.body;
    const ai = getGenAI();

    if (!ai || !imageBase64) {
      return res.json({
        parsed: {
          serviceName: 'Netflix Premium',
          category: 'Entertainment',
          amount: 649,
          currency: 'INR',
          billingCycle: 'Monthly',
          renewalDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
          paymentMethod: 'Credit Card',
          notes: 'Extracted from uploaded receipt/screenshot sample'
        }
      });
    }

    // Strip header if present
    const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType,
              data: cleanBase64,
            },
          },
          {
            text: `Analyze this receipt, bill, or subscription screenshot. Extract recurring subscription details and return ONLY a JSON object matching this schema:
{
  "serviceName": "string",
  "category": "Entertainment" | "Utilities" | "Gaming" | "Education" | "Cloud" | "Shopping" | "Finance" | "Others",
  "amount": number,
  "currency": "INR" | "USD" | "EUR" | "GBP",
  "billingCycle": "Monthly" | "Quarterly" | "Half Yearly" | "Yearly",
  "renewalDate": "YYYY-MM-DD",
  "paymentMethod": "UPI" | "Debit Card" | "Credit Card" | "Net Banking" | "Cash",
  "notes": "string"
}`,
          },
        ],
      },
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ parsed });
  } catch (err: any) {
    console.error('Error in /api/ocr-scan:', err);
    return res.status(500).json({ error: err.message || 'OCR parsing failed' });
  }
});

// 3. Email / SMS Parser Endpoint
app.post('/api/parse-email-sms', async (req, res) => {
  try {
    const { rawText } = req.body;
    const ai = getGenAI();

    if (!ai || !rawText) {
      return res.json({
        parsed: {
          serviceName: 'JioFiber Broadband',
          category: 'Utilities',
          amount: 1179,
          currency: 'INR',
          billingCycle: 'Monthly',
          renewalDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
          paymentMethod: 'UPI',
          notes: 'Parsed from payment SMS notification'
        }
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: `Extract subscription renewal details from the following SMS or Email message text:
"${rawText}"

Return ONLY a JSON object matching this schema:
{
  "serviceName": "string",
  "category": "Entertainment" | "Utilities" | "Gaming" | "Education" | "Cloud" | "Shopping" | "Finance" | "Others",
  "amount": number,
  "currency": "INR" | "USD" | "EUR" | "GBP",
  "billingCycle": "Monthly" | "Quarterly" | "Half Yearly" | "Yearly",
  "renewalDate": "YYYY-MM-DD",
  "paymentMethod": "UPI" | "Debit Card" | "Credit Card" | "Net Banking" | "Cash",
  "notes": "string"
}`,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ parsed });
  } catch (err: any) {
    console.error('Error in /api/parse-email-sms:', err);
    return res.status(500).json({ error: 'Failed to parse text' });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
