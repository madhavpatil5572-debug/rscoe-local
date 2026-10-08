import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  X, 
  Send, 
  ArrowRight, 
  ShieldCheck 
} from 'lucide-react';
import type { Place } from '../types';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestedPlaces?: Place[];
}

interface ChatAssistantProps {
  places: Place[];
  onSelectPlace: (place: Place) => void;
}

export const ChatAssistant: React.FC<ChatAssistantProps> = ({ places, onSelectPlace }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init-1',
      sender: 'assistant',
      text: "Namaskar! I'm RSCOE AI, your campus buddy. Ask me about affordable messes, haircuts, late-night printing, or hostels around Tathwade.",
      timestamp: 'Just now',
    },
  ]);

  const samplePrompts = [
    "Find me a cheap salon within 1 km.",
    "Best mess under ₹3000/month",
    "Where can I get lab manuals printed?",
    "Late night egg or snacks spot",
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

  const handleSend = (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim()) return;

    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const lower = textToSend.toLowerCase();
      let matched: Place[] = [];
      let reply = "";

      if (lower.includes('salon') || lower.includes('haircut') || lower.includes('beard')) {
        matched = places.filter(p => p.category === 'salon');
        reply = `I found ${matched.length} student-friendly salons nearby. Style Studio is closest at ₹100 for a haircut with student ID discount!`;
      } else if (lower.includes('mess') || lower.includes('thali') || lower.includes('food under') || lower.includes('3000')) {
        matched = places.filter(p => p.category === 'mess' || p.category === 'food');
        reply = `Found great verified messes! Annapurna Mess has unlimited chapatis for ₹2,800/month (180m from Back Gate), and Sai Krupa has Maharashtrian thalis for ₹60.`;
      } else if (lower.includes('print') || lower.includes('xerox') || lower.includes('binding') || lower.includes('journal')) {
        matched = places.filter(p => p.category === 'printing');
        reply = `Balaji Xerox (120m from Gate) prints B&W for ₹1.5/page and does fast project spiral binding. You can also send PDFs on their WhatsApp!`;
      } else if (lower.includes('pg') || lower.includes('hostel') || lower.includes('stay') || lower.includes('room')) {
        matched = places.filter(p => p.category === 'pg');
        reply = `Found ${matched.length} verified accommodations near RSCOE: Shree Samarth for boys (from ₹4,500/mo) and Mayur Girls PG (includes 3 meals and biometric security).`;
      } else if (lower.includes('late night') || lower.includes('snack') || lower.includes('egg') || lower.includes('tea') || lower.includes('misal')) {
        matched = places.filter(p => p.category === 'street-food' || p.category === 'food');
        reply = `Raju Bhurji is open till 12:30 AM right next to RSCOE ground. Kolhapuri Misal House opens early at 7:00 AM for spicy breakfast.`;
      } else if (lower.includes('medical') || lower.includes('medicine') || lower.includes('chemist')) {
        matched = places.filter(p => p.category === 'medical');
        reply = `Wellness Pharmacy near the underpass is open 24x7 for emergencies. Sanjivani Medical gives a 10% student discount on medicines.`;
      } else {
        matched = places.filter(p => p.featured).slice(0, 3);
        reply = `Here are student favorites verified around JSPM RSCOE. You can check prices, timings, and walking distances below:`;
      }

      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedPlaces: matched.slice(0, 2),
      };

      setIsTyping(false);
      setMessages((prev) => [...prev, botMsg]);
    }, 700);
  };

  return (
    <div className="fixed bottom-5 right-5 z-40">
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-2.5 bg-slate-900 dark:bg-slate-800 hover:bg-blue-600 dark:hover:bg-blue-600 text-white pl-3.5 pr-4 py-3 rounded-full shadow-xl shadow-slate-900/25 transition-all duration-300 hover:scale-105 cursor-pointer border border-slate-700"
          aria-label="Open RSCOE AI Assistant"
        >
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-blue-500 group-hover:bg-white text-white group-hover:text-blue-600 flex items-center justify-center transition-colors">
              <Bot className="w-4 h-4" />
            </div>
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-slate-900 animate-pulse"></span>
          </div>
          <div className="text-left">
            <div className="text-xs font-black tracking-tight leading-none">RSCOE AI</div>
            <div className="text-[10px] text-slate-300 group-hover:text-blue-100 font-medium">Campus Guide</div>
          </div>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="w-85 sm:w-96 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col h-[520px] max-h-[85vh] animate-scaleUp">
          
          {/* Header */}
          <div className="bg-slate-900 dark:bg-slate-950 text-white p-4 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-blue-600 flex items-center justify-center shadow-md">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-sm tracking-tight">RSCOE AI</span>
                  <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-1.5 py-0.2 rounded">
                    Verified
                  </span>
                </div>
                <div className="text-[11px] text-slate-400">
                  Grounded in Tathwade student data
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Assistant Sub-banner */}
          <div className="bg-blue-50 dark:bg-blue-950/60 border-b border-blue-100 dark:border-blue-900/60 px-3 py-1.5 text-[11px] text-blue-900 dark:text-blue-300 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              Answers only using physically verified campus spots.
            </span>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs bg-white dark:bg-slate-900">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.sender === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white font-medium rounded-br-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200/60 dark:border-slate-700/60 rounded-bl-xs'
                  }`}
                >
                  <p>{msg.text}</p>

                  {/* Matching place cards */}
                  {msg.suggestedPlaces && msg.suggestedPlaces.length > 0 && (
                    <div className="mt-2.5 space-y-1.5 pt-2 border-t border-slate-200/80 dark:border-slate-700/80">
                      {msg.suggestedPlaces.map((pl) => (
                        <div
                          key={pl.id}
                          onClick={() => {
                            onSelectPlace(pl);
                            setIsOpen(false);
                          }}
                          className="bg-white dark:bg-slate-850 p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-400 cursor-pointer transition shadow-2xs flex items-center justify-between gap-2"
                        >
                          <div>
                            <div className="font-bold text-slate-900 dark:text-white text-[11px]">{pl.name}</div>
                            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                              {pl.priceRange} • {pl.distanceFromCollege}
                            </div>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <span className="text-[9px] text-slate-400 px-1 mt-0.5">
                  {msg.timestamp}
                </span>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-1.5 text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded-full w-20">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompt Suggestions */}
          <div className="px-3 py-2 bg-slate-50 dark:bg-slate-850 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {samplePrompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSend(prompt)}
                className="text-[10px] font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 hover:text-blue-600 dark:hover:text-blue-400 px-2.5 py-1 rounded-full whitespace-nowrap transition cursor-pointer text-slate-600 dark:text-slate-300 shrink-0 shadow-2xs"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Chat Input Field */}
          <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask RSCOE AI..."
              className="flex-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim()}
              className="p-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl transition cursor-pointer shadow-xs"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}
    </div>
  );
};
