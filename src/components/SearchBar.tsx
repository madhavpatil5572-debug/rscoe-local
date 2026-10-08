import React, { useState } from 'react';
import { Search, MapPin, X, ArrowRight, Sparkles } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
  className?: string;
  showLocationBadge?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  onSubmit,
  placeholder = "Search for a salon, mess, PG, medical store...",
  className = "",
  showLocationBadge = true,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const quickPicks = [
    { label: "Mess under ₹3000", query: "mess" },
    { label: "Cheap haircut ₹100", query: "salon" },
    { label: "Urgent Xerox & Print", query: "printing" },
    { label: "Late night food", query: "street-food" },
    { label: "Hostels / PG", query: "pg" },
  ];

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSubmit) {
      onSubmit();
    }
  };

  return (
    <div className={`w-full relative ${className}`}>
      <div 
        className={`flex items-center bg-white dark:bg-slate-900 rounded-2xl border transition-all duration-200 shadow-md ${
          isFocused 
            ? 'border-blue-500 ring-4 ring-blue-500/15 shadow-lg' 
            : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
        } p-2 sm:p-2.5`}
      >
        <div className="pl-2 sm:pl-3 text-slate-400 dark:text-slate-500 shrink-0">
          <Search className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </div>

        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full bg-transparent border-none px-3 py-1.5 text-sm sm:text-base text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-0 font-medium"
        />

        {value && (
          <button
            onClick={() => onChange('')}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full mr-1 transition"
            title="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {showLocationBadge && (
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold shrink-0 border border-slate-200/80 dark:border-slate-700 mr-2">
            <MapPin className="w-3.5 h-3.5 text-rose-500" />
            <span>Near RSCOE</span>
          </div>
        )}

        <button
          onClick={onSubmit}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-semibold text-xs sm:text-sm flex items-center gap-1.5 transition shadow-sm shadow-blue-500/25 shrink-0 cursor-pointer"
        >
          <span>Find</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Quick Search Chips below input */}
      <div className="flex items-center gap-1.5 mt-3 overflow-x-auto no-scrollbar py-1 text-xs">
        <span className="text-slate-400 dark:text-slate-500 font-medium flex items-center gap-1 shrink-0">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Popular:
        </span>
        {quickPicks.map((pick) => (
          <button
            key={pick.label}
            onClick={() => {
              onChange(pick.query);
              if (onSubmit) onSubmit();
            }}
            className="bg-white/90 dark:bg-slate-850 hover:bg-blue-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-blue-700 dark:hover:text-blue-400 border border-slate-200 dark:border-slate-700 hover:border-blue-200 dark:hover:border-slate-600 px-2.5 py-1 rounded-full whitespace-nowrap transition cursor-pointer font-medium shadow-2xs"
          >
            {pick.label}
          </button>
        ))}
      </div>
    </div>
  );
};
