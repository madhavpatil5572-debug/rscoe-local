import React from 'react';
import { 
  Filter, 
  RotateCcw, 
  ShieldCheck, 
  Clock, 
  Sparkles, 
  Check, 
  Tag,
  Star,
  Navigation
} from 'lucide-react';
import type { CategoryId, FilterState, PriceLevel } from '../types';
import { CATEGORIES } from '../data/placesData';

interface FilterPanelProps {
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  onResetFilters: () => void;
  totalResultsCount: number;
  className?: string;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  totalResultsCount,
  className = "",
}) => {
  const quickAffordabilityOptions = [
    { id: 'all_prices', label: 'All Budgets', desc: 'No price cap' },
    { id: 'food_under_50', label: 'Food under ₹50', desc: 'Snacks & rolls' },
    { id: 'mess_under_3000', label: 'Mess under ₹3,000/mo', desc: 'Monthly meals' },
    { id: 'salon_under_150', label: 'Salon under ₹150', desc: 'Affordable cuts' },
  ];

  const handleQuickAffordability = (optId: string) => {
    if (filters.quickAffordabilityFilter === optId) {
      onFilterChange({ ...filters, quickAffordabilityFilter: undefined });
    } else {
      let targetCat = filters.category;
      if (optId === 'mess_under_3000') targetCat = 'mess';
      if (optId === 'salon_under_150') targetCat = 'salon';

      onFilterChange({ 
        ...filters, 
        quickAffordabilityFilter: optId,
        category: targetCat,
      });
    }
  };

  return (
    <div className={`bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-xs space-y-5 transition-colors duration-200 ${className}`}>
      {/* Header with Title and Reset */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">Filters & Criteria</h3>
        </div>

        <button
          onClick={onResetFilters}
          className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Affordability Quick Chips */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Student Affordability</span>
        </label>
        <div className="grid grid-cols-1 gap-1.5">
          {quickAffordabilityOptions.map((opt) => {
            const isSelected = filters.quickAffordabilityFilter === opt.id || (!filters.quickAffordabilityFilter && opt.id === 'all_prices');
            return (
              <button
                key={opt.id}
                onClick={() => handleQuickAffordability(opt.id)}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition border flex items-center justify-between cursor-pointer ${
                  isSelected && opt.id !== 'all_prices'
                    ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-800 shadow-xs'
                    : isSelected && opt.id === 'all_prices'
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border-slate-200 dark:border-slate-700'
                    : 'bg-white dark:bg-slate-850 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <div>
                  <div className="font-bold">{opt.label}</div>
                  <div className="text-[10px] text-slate-400 dark:text-slate-500 font-normal">{opt.desc}</div>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Category Dropdown */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
          Category
        </label>
        <select
          value={filters.category}
          onChange={(e) => onFilterChange({ ...filters, category: e.target.value as CategoryId })}
          className="w-full text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat.id} value={cat.id} className="dark:bg-slate-900">
              {cat.label}
            </option>
          ))}
        </select>
      </div>

      {/* Distance Radius */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 flex items-center justify-between">
          <span className="flex items-center gap-1">
            <Navigation className="w-3.5 h-3.5 text-slate-400" /> Max Distance from RSCOE
          </span>
          <span className="text-blue-600 dark:text-blue-400 font-bold">{filters.maxDistanceKm >= 3 ? 'Any' : `< ${filters.maxDistanceKm} km`}</span>
        </label>
        <div className="grid grid-cols-4 gap-1.5">
          {[0.5, 1.0, 1.5, 3.0].map((dist) => {
            const isSelected = filters.maxDistanceKm === dist;
            return (
              <button
                key={dist}
                onClick={() => onFilterChange({ ...filters, maxDistanceKm: dist })}
                className={`py-1.5 text-xs font-bold rounded-lg border transition text-center cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 border-slate-900 dark:border-white'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750'
                }`}
              >
                {dist >= 3 ? 'Any' : `${dist * 1000}m`}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Level Tier */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1">
          <Tag className="w-3.5 h-3.5 text-slate-400" /> Price Tier
        </label>
        <div className="grid grid-cols-4 gap-1.5 text-xs">
          {[
            { id: 'all', label: 'All' },
            { id: 'budget', label: '₹ Budget' },
            { id: 'moderate', label: '₹₹ Mid' },
            { id: 'premium', label: '₹₹₹ High' },
          ].map((tier) => {
            const isSelected = filters.priceLevel === tier.id;
            return (
              <button
                key={tier.id}
                onClick={() => onFilterChange({ ...filters, priceLevel: tier.id as 'all' | PriceLevel })}
                className={`py-1.5 px-1 rounded-lg border font-semibold transition text-center cursor-pointer text-[11px] ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750'
                }`}
              >
                {tier.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Rating Filter */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1">
          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" /> Minimum Rating
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          {[
            { val: 0, label: 'Any' },
            { val: 4.0, label: '4.0+ ★' },
            { val: 4.5, label: '4.5+ ★' },
          ].map((item) => {
            const isSelected = filters.minRating === item.val;
            return (
              <button
                key={item.val}
                onClick={() => onFilterChange({ ...filters, minRating: item.val })}
                className={`py-1.5 text-xs font-bold rounded-lg border transition text-center cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 border-slate-900 dark:border-white'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Toggles */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3">
        <label className="flex items-center justify-between cursor-pointer group">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <div>
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200">Student Verified Only</div>
              <div className="text-[10px] text-slate-400 dark:text-slate-500">Physically audited spots</div>
            </div>
          </div>
          <input
            type="checkbox"
            checked={filters.verifiedOnly}
            onChange={(e) => onFilterChange({ ...filters, verifiedOnly: e.target.checked })}
            className="w-4 h-4 text-blue-600 rounded-sm border-slate-300 dark:border-slate-700 focus:ring-blue-500 cursor-pointer"
          />
        </label>

        <label className="flex items-center justify-between cursor-pointer group">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <div>
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200">Open Now</div>
              <div className="text-[10px] text-slate-400 dark:text-slate-500">Currently serving students</div>
            </div>
          </div>
          <input
            type="checkbox"
            checked={filters.openNowOnly}
            onChange={(e) => onFilterChange({ ...filters, openNowOnly: e.target.checked })}
            className="w-4 h-4 text-blue-600 rounded-sm border-slate-300 dark:border-slate-700 focus:ring-blue-500 cursor-pointer"
          />
        </label>
      </div>

      {/* Results Counter footer */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span>Matching Places:</span>
        <span className="font-bold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-full">
          {totalResultsCount} found
        </span>
      </div>
    </div>
  );
};
