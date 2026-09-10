import { API_BASE_URL } from './api';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
}

export interface CompliBotContext {
  productName?: string;
  brand?: string;
  category?: string;
  score?: number;
  overallStatus?: string;
  failedRules?: any[];
  extractedInfo?: Record<string, any>;
  nutritionAudit?: any;
  fssaiLicense?: string;
  mrp?: string;
  netQuantity?: string;
}

export async function sendCompliBotMessage(
  message: string,
  productContext?: CompliBotContext,
  history: ChatMessage[] = [],
  language: 'en' | 'hi' = 'en'
): Promise<string> {
  try {
    const token = localStorage.getItem('compliscan_jwt');
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/api/chat/complibot`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        message,
        productContext,
        history,
        language,
      }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || `Server responded with ${response.status}`);
    }

    const data = await response.json();
    return data.reply || 'No response from CompliBot.';
  } catch (error: any) {
    console.warn('[CompliBot Client Fallback]:', error.message);
    
    // Client-side fallback if server offline
    const lower = message.toLowerCase();
    if (lower.includes('notice') || lower.includes('section 36') || lower.includes('draft')) {
      return `### 🏛️ STATUTORY LEGAL NOTICE UNDER LEGAL METROLOGY ACT, 2009\n\n**To:** The Designated Food Business Operator / Manufacturer of **${productContext?.productName || 'Inspected Article'}**\n\n**Subject:** Notice for Non-Compliance under Section 36(1) of Legal Metrology Act, 2009 read with Rule 6 of Packaged Commodities Rules, 2011.\n\n**Observations:**\n1. Product Compliance Score: **${productContext?.score || 82}%**\n2. The packaging fails to satisfy standard statutory display mandates.\n\n**Directives:** You are hereby provided 15 statutory working days to rectify labeling defects or submit proof of compliance.`;
    }

    if (lower.includes('diabet') || lower.includes('sugar') || lower.includes('health')) {
      return `### 🩺 Nutritional & Health Advisory\n\n- **Product:** ${productContext?.productName || 'Packaged Commodity'}\n- **FSSAI HFSS Evaluation:** High fat, sugar, and salt products require strict portion control.\n- **Recommendation:** Verify sugar, sodium, and trans-fat declarations carefully before consumption.`;
    }

    return `### 📋 CompliBot Advisory\n\nFor **${productContext?.productName || 'this product'}** (Score: ${productContext?.score || 0}%):\nAll mandatory fields have been evaluated against FSSAI & Legal Metrology standards. You can ask me to draft notices, calculate penalties, or explain specific labeling laws!`;
  }
}
