import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Send, 
  ArrowRight, 
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import type { Place } from '../types';

const MINION_IMAGE = "https://m.media-amazon.com/images/I/51UCoS4VwyL._AC_UF894,1000_QL80_.jpg";

const MINION_REACTIONS = [
  "Bello! 👋 Looking for Biryani or Cafes?",
  "Banana! 🍌 Ask me anything near RSCOE!",
  "Unlimited thali under ₹3000/mo? Tap me!",
  "Need Xerox or mobile repair in 5 mins? 📱",
  "Tathwade's cutest campus guide! ✨",
];

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
  const [reactionIndex, setReactionIndex] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init-1',
      sender: 'assistant',
      text: "Bello! 🍌 I'm your RSCOE Minion campus buddy! Ask me about hot biryani, best student mess under ₹3000, cafes with Wi-Fi, late-night printing, or hostels in Tathwade!",
      timestamp: 'Just now',
    },
  ]);

  const samplePrompts = [
    "Best Biryani near RSCOE? 🍗",
    "Best cafes to study or chill ☕",
    "Messes under ₹3000/month 🍲",
    "Late night egg or snacks spot 🍳",
    "Where can I get lab manuals printed? 🖨️",
  ];

  // Rotate cartoon speech reactions every 4.5 seconds
  useEffect(() => {
    if (isOpen) return;
    const interval = setInterval(() => {
      setReactionIndex((prev) => (prev + 1) % MINION_REACTIONS.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isOpen]);

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

      if (lower.includes('biryani') || lower.includes('chicken') || lower.includes('non-veg') || lower.includes('pulao')) {
        matched = places.filter(p => 
          p.name.toLowerCase().includes('biryani') || 
          p.subcategory.toLowerCase().includes('biryani') ||
          p.description.toLowerCase().includes('biryani')
        );
        reply = `Bello! 🍗 Found delicious biryani hubs strictly near campus: PK Dum Biryani is right opposite RSCOE Main Gate (student half plate ₹130), and Reddy's Hyderabadi has spicy Andhra biryani with free extra salan!`;
      } else if (lower.includes('cafe') || lower.includes('coffee') || lower.includes('shake') || lower.includes('burger') || lower.includes('study')) {
        matched = places.filter(p => p.category === 'cafes');
        reply = `Banana! ☕ Check out Cafe Chokolade (120m away) for CadB shakes and cold coffee, Stories Cafe (190m away) with high-speed Wi-Fi and study desks, or Yewale Amruttulya right at Gate 1 for morning kadak chai!`;
      } else if (lower.includes('salon') || lower.includes('haircut') || lower.includes('beard') || lower.includes('grooming')) {
        matched = places.filter(p => p.category === 'salon');
        reply = `Looking fresh! ✨ Style Studio Men's Grooming is closest at ₹100 for a student haircut with RSCOE ID card discount!`;
      } else if (lower.includes('mess') || lower.includes('thali') || lower.includes('food under') || lower.includes('3000')) {
        matched = places.filter(p => p.category === 'mess' || p.category === 'food');
        reply = `Found great verified messes! Annapurna Mess has unlimited chapatis for ₹2,800/month (180m from Back Gate), and Sai Krupa offers Maharashtrian thalis for ₹60.`;
      } else if (lower.includes('print') || lower.includes('xerox') || lower.includes('binding') || lower.includes('journal')) {
        matched = places.filter(p => p.category === 'college-essentials' || p.subcategory.toLowerCase().includes('xerox'));
        reply = `Balaji Xerox & Book Center (120m from Gate) prints B&W for ₹1.5/page and does express project spiral binding. You can also send PDFs directly to their WhatsApp!`;
      } else if (lower.includes('pg') || lower.includes('hostel') || lower.includes('stay') || lower.includes('room')) {
        matched = places.filter(p => p.category === 'pg');
        reply = `Found verified accommodations near RSCOE: Shree Samarth for boys (from ₹4,500/mo) and Mayur Girls PG (includes 3 meals and biometric security).`;
      } else if (lower.includes('late night') || lower.includes('snack') || lower.includes('egg') || lower.includes('tea') || lower.includes('misal')) {
        matched = places.filter(p => p.category === 'mess' || p.category === 'cafes');
        reply = `Raju Bhurji is open till 12:30 AM right next to RSCOE ground. Yewale Amruttulya opens early at 6:30 AM for hot tea and bun maska!`;
      } else if (lower.includes('repair') || lower.includes('mobile') || lower.includes('laptop')) {
        matched = places.filter(p => p.category === 'repairs');
        reply = `Sai Mobile Care (170m from Gate) fixes cracked screens, broken charging ports, and provides fast Type-C cables with warranty!`;
      } else if (lower.includes('medical') || lower.includes('medicine') || lower.includes('chemist')) {
        matched = places.filter(p => p.category === 'medical');
        reply = `Wellness 24x7 Pharmacy near the underpass is open all night for emergencies. Sanjivani Medical also offers a 10% student discount.`;
      } else {
        matched = places.filter(p => p.featured).slice(0, 3);
        reply = `Poopaye! Here are top verified campus favorites right around JSPM RSCOE Tathwade. Check walking distance, timings, and menus below:`;
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
    }, 600);
  };

  return (
    <div className="fixed bottom-5 right-5 z-40">
      {/* Floating Trigger: Live Waving Minion Cartoon */}
      {!isOpen && (
        <div className="relative flex flex-col items-end">
          {/* Animated Cartoon Speech Bubble */}
          <div 
            onClick={() => setIsOpen(true)}
            className="mb-2 mr-1 cursor-pointer transition-transform hover:scale-105 active:scale-95"
          >
            <div className="relative bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs font-black px-3.5 py-1.5 rounded-2xl shadow-xl border-2 border-amber-400 dark:border-amber-400 flex items-center gap-1.5 whitespace-nowrap animate-speech-pop">
              <span className="text-sm">🍌</span>
              <span>{MINION_REACTIONS[reactionIndex]}</span>
              {/* Speech bubble pointy arrow */}
              <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-white dark:bg-slate-800 border-b-2 border-r-2 border-amber-400 rotate-45"></div>
            </div>
          </div>

          {/* Minion Avatar Floating Action Button */}
          <button
            onClick={() => setIsOpen(true)}
            className="group relative flex items-center gap-3 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-500 hover:to-yellow-400 text-slate-950 pl-2 pr-4 py-2 rounded-full shadow-2xl shadow-amber-500/40 hover:shadow-amber-500/60 transition-all duration-300 hover:scale-108 active:scale-95 cursor-pointer border-2 border-white dark:border-amber-300"
            aria-label="Open RSCOE Minion Assistant"
          >
            {/* Live Waving Minion Image Character */}
            <div className="relative w-12 h-12 rounded-full overflow-hidden bg-white shadow-md border-2 border-amber-400 flex items-center justify-center animate-minion-wave shrink-0">
              <img 
                src={MINION_IMAGE} 
                alt="Live Waving Minion" 
                className="w-full h-full object-cover object-center scale-110"
              />
              {/* Waving Hand Sticker */}
              <span className="absolute bottom-0 right-0 text-xs animate-hand-wiggle select-none drop-shadow">
                👋
              </span>
            </div>

            {/* Label */}
            <div className="text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black tracking-tight text-slate-950 uppercase">
                  RSCOE Minion
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white animate-pulse"></span>
              </div>
              <div className="text-[10px] font-extrabold text-slate-800 leading-tight flex items-center gap-1">
                <span>Bello! Tap to chat</span>
                <span className="text-xs">🍌</span>
              </div>
            </div>
          </button>
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="w-85 sm:w-96 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border-2 border-amber-400/80 dark:border-amber-400/70 overflow-hidden flex flex-col h-[520px] max-h-[85vh] animate-scaleUp">
          
          {/* Header with Minion Cartoon Style */}
          <div className="bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 p-3.5 flex items-center justify-between border-b-2 border-amber-500 shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="relative w-10 h-10 rounded-full overflow-hidden bg-white border-2 border-slate-900 shadow-md shrink-0 animate-minion-wave">
                <img 
                  src={MINION_IMAGE} 
                  alt="Minion Avatar" 
                  className="w-full h-full object-cover scale-110"
                />
                <span className="absolute bottom-0 right-0 text-[10px]">👋</span>
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-sm tracking-tight text-slate-950">RSCOE Minion AI</span>
                  <span className="bg-slate-950 text-amber-300 text-[10px] font-black px-1.5 py-0.2 rounded-full uppercase tracking-wider">
                    Bello!
                  </span>
                </div>
                <div className="text-[10px] font-bold text-slate-800 flex items-center gap-1">
                  <span>🍌 Your live Tathwade campus buddy</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-slate-800 hover:text-black rounded-full hover:bg-black/10 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Assistant Sub-banner */}
          <div className="bg-amber-50 dark:bg-amber-950/40 border-b border-amber-200 dark:border-amber-900/60 px-3 py-1.5 text-[11px] text-amber-950 dark:text-amber-200 flex items-center justify-between font-medium">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>Grounded in verified JSPM RSCOE spots & menus!</span>
            </span>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-3.5 text-xs bg-white dark:bg-slate-900">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2 ${
                  msg.sender === 'user' ? 'justify-end' : 'justify-start items-start'
                }`}
              >
                {/* Assistant Minion Avatar beside message */}
                {msg.sender === 'assistant' && (
                  <div className="w-7 h-7 rounded-full overflow-hidden bg-amber-100 border border-amber-400 shrink-0 mt-0.5 shadow-2xs">
                    <img 
                      src={MINION_IMAGE} 
                      alt="Minion" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="flex flex-col max-w-[82%]">
                  <div
                    className={`rounded-2xl px-3.5 py-2.5 leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-blue-600 text-white font-medium rounded-br-xs ml-auto shadow-xs'
                        : 'bg-amber-50/70 dark:bg-slate-800 text-slate-850 dark:text-slate-100 border border-amber-200/80 dark:border-slate-700 rounded-bl-xs shadow-2xs'
                    }`}
                  >
                    <p>{msg.text}</p>

                    {/* Matching place cards */}
                    {msg.suggestedPlaces && msg.suggestedPlaces.length > 0 && (
                      <div className="mt-2.5 space-y-1.5 pt-2 border-t border-amber-200/70 dark:border-slate-700/80">
                        {msg.suggestedPlaces.map((pl) => (
                          <div
                            key={pl.id}
                            onClick={() => {
                              onSelectPlace(pl);
                              setIsOpen(false);
                            }}
                            className="bg-white dark:bg-slate-850 p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-amber-400 dark:hover:border-amber-400 cursor-pointer transition shadow-2xs flex items-center justify-between gap-2"
                          >
                            <div>
                              <div className="font-bold text-slate-900 dark:text-white text-[11px]">{pl.name}</div>
                              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                                {pl.priceRange} • {pl.distanceFromCollege}
                              </div>
                            </div>
                            <ArrowRight className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <span className={`text-[9px] text-slate-400 px-1 mt-0.5 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full overflow-hidden bg-amber-100 border border-amber-400 shrink-0">
                  <img src={MINION_IMAGE} alt="Minion" className="w-full h-full object-cover" />
                </div>
                <div className="flex items-center gap-1.5 text-slate-500 bg-amber-50 dark:bg-slate-800 px-3 py-2 rounded-full border border-amber-200 dark:border-slate-700">
                  <span className="text-[11px] font-bold text-amber-700 dark:text-amber-300">Minion thinking</span>
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
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
                className="text-[10px] font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-amber-400 dark:hover:border-amber-400 hover:text-amber-700 dark:hover:text-amber-300 px-2.5 py-1 rounded-full whitespace-nowrap transition cursor-pointer text-slate-700 dark:text-slate-300 shrink-0 shadow-2xs"
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
              placeholder="Ask RSCOE Minion... e.g. Best Biryani?"
              className="flex-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim()}
              className="p-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 disabled:opacity-50 text-slate-950 font-bold rounded-xl transition cursor-pointer shadow-xs"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}
    </div>
  );
};
