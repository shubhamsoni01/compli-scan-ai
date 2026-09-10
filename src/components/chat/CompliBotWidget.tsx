import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, Sparkles, Copy, Check, ShieldAlert, Scale, HeartPulse, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils/cn';
import { sendCompliBotMessage, type ChatMessage, type CompliBotContext } from '@/services/compliBotService';

interface CompliBotWidgetProps {
  scanData?: any;
  defaultOpen?: boolean;
}

export const CompliBotWidget: React.FC<CompliBotWidgetProps> = ({ scanData, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const productContext: CompliBotContext = {
    productName: scanData?.productName || scanData?.brand || 'Packaged Product',
    brand: scanData?.brand || '',
    category: scanData?.category || 'food',
    score: scanData?.score || 82,
    overallStatus: scanData?.overallStatus || 'Under Review',
    failedRules: scanData?.checks?.filter((c: any) => c.status === 'failed' || c.status === 'review') || [],
    extractedInfo: scanData?.extractedInfo || {},
    nutritionAudit: scanData?.nutritionAudit || {},
    fssaiLicense: scanData?.extractedInfo?.fssaiLicenseNumber || scanData?.extractedInfo?.licenseNumber,
    mrp: scanData?.extractedInfo?.mrp,
    netQuantity: scanData?.extractedInfo?.netQuantity,
  };

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: `👋 Namaste! I am **CompliBot AI**, your statutory legal & consumer safety copilot for **${productContext.productName}**.\n\nYou can ask me to draft legal notices, analyze health & sugar risks, or explain penalties under the Legal Metrology Act & FSSAI 2020!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (customText?: string) => {
    const textToSend = (customText || inputMessage).trim();
    if (!textToSend || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customText) setInputMessage('');
    setIsLoading(true);

    try {
      const botReply = await sendCompliBotMessage(textToSend, productContext, messages);
      const botMsg: ChatMessage = {
        id: `bot_${Date.now()}`,
        sender: 'bot',
        text: botReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `err_${Date.now()}`,
        sender: 'bot',
        text: '⚠️ Sorry, I could not process that query. Please try asking again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const quickPrompts = [
    { label: '⚖️ Draft Legal Notice', query: 'Draft a formal statutory legal notice under Section 36 of the Legal Metrology Act 2009 for the missing/failed declarations.' },
    { label: '🩺 Safe for Diabetics?', query: 'Based on the nutrition facts and sugar content, is this product safe for diabetic or hypertensive individuals?' },
    { label: '💰 Statutory Fine & Penalty', query: 'What are the legal fines and penalties for the manufacturer under Legal Metrology and FSSAI for these labeling violations?' },
    { label: '🇮🇳 हिंदी में समझाइए', query: 'इस उत्पाद के सभी नियमों और उल्लंघनों को सरल हिंदी में समझाइए।' },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Action Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-full shadow-xl hover:shadow-indigo-500/25 border border-white/20 backdrop-blur transition-all"
          >
            <div className="relative">
              <Bot size={20} />
              <span className="absolute -top-1 -right-1 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </div>
            <span className="font-semibold text-sm tracking-wide">Ask CompliBot AI</span>
            <Sparkles size={16} className="text-amber-300 animate-pulse" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="w-[92vw] sm:w-[420px] h-[580px] max-h-[85vh] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-3.5 bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-700 text-white flex items-center justify-between shadow-md">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 bg-white/10 rounded-lg backdrop-blur">
                  <Bot size={20} className="text-amber-300" />
                </div>
                <div>
                  <h4 className="font-bold text-sm leading-tight flex items-center gap-1.5">
                    CompliBot AI Copilot
                    <span className="text-[10px] bg-emerald-500/80 text-white px-1.5 py-0.2 rounded-full uppercase font-mono">
                      Online
                    </span>
                  </h4>
                  <p className="text-[11px] text-indigo-100 truncate max-w-[220px]">
                    Inspecting: {productContext.productName}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/50 dark:bg-slate-950/40 text-xs">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    'flex flex-col max-w-[88%]',
                    msg.sender === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'
                  )}
                >
                  <div
                    className={cn(
                      'p-3 rounded-2xl relative group',
                      msg.sender === 'user'
                        ? 'bg-indigo-600 text-white rounded-br-none shadow-sm'
                        : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700/80 rounded-bl-none shadow-sm'
                    )}
                  >
                    <div className="whitespace-pre-line leading-relaxed font-sans">{msg.text}</div>

                    {msg.sender === 'bot' && (
                      <button
                        onClick={() => copyToClipboard(msg.text, msg.id)}
                        className="mt-2 pt-1 border-t border-slate-100 dark:border-slate-700/60 flex items-center gap-1 text-[11px] text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                        title="Copy text"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check size={12} className="text-emerald-500" />
                            <span className="text-emerald-500 font-medium">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy size={12} />
                            <span>Copy response</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 px-1 mt-0.5">{msg.timestamp}</span>
                </div>
              ))}

              {isLoading && (
                <div className="flex items-center gap-2 p-3 bg-white dark:bg-slate-800 rounded-2xl rounded-bl-none border border-slate-200 dark:border-slate-700 w-fit">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                  <span className="text-[11px] text-slate-400">Analyzing statutory database...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Action Suggestion Pills */}
            <div className="p-2 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-x-auto flex gap-1.5 no-scrollbar">
              {quickPrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(p.query)}
                  disabled={isLoading}
                  className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 dark:hover:text-indigo-400 border border-slate-200/60 dark:border-slate-700/60 rounded-full text-[11px] whitespace-nowrap text-slate-700 dark:text-slate-300 font-medium transition-all shrink-0"
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask statutory query or legal draft..."
                disabled={isLoading}
                className="flex-1 px-3.5 py-2 bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
              />
              <button
                onClick={() => handleSend()}
                disabled={!inputMessage.trim() || isLoading}
                className="p-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-xl shadow-sm transition-all"
              >
                <Send size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
