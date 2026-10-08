import React from 'react';
import { 
  UtensilsCrossed, 
  Scissors, 
  Home, 
  Pill, 
  BookOpen, 
  ShoppingBag, 
  Flame, 
  Sparkles, 
  Printer, 
  Wrench,
  Coffee,
  Compass,
  ArrowRight
} from 'lucide-react';
import type { CategoryId, CategoryMeta } from '../types';
import { CATEGORIES } from '../data/placesData';

interface CategoryGridProps {
  selectedCategory: CategoryId;
  onSelectCategory: (category: CategoryId) => void;
  placesCountByCategory?: Record<CategoryId, number>;
  compact?: boolean;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({
  selectedCategory,
  onSelectCategory,
  placesCountByCategory = {} as Record<CategoryId, number>,
  compact = false,
}) => {
  const renderIcon = (name: string, className: string = "w-6 h-6") => {
    switch (name) {
      case 'UtensilsCrossed': return <UtensilsCrossed className={className} />;
      case 'Scissors': return <Scissors className={className} />;
      case 'Home': return <Home className={className} />;
      case 'Pill': return <Pill className={className} />;
      case 'BookOpen': return <BookOpen className={className} />;
      case 'ShoppingBag': return <ShoppingBag className={className} />;
      case 'Flame': return <Flame className={className} />;
      case 'Sparkles': return <Sparkles className={className} />;
      case 'Printer': return <Printer className={className} />;
      case 'Wrench': return <Wrench className={className} />;
      case 'Coffee': return <Coffee className={className} />;
      default: return <Compass className={className} />;
    }
  };

  const getCategoryTheme = (id: CategoryId) => {
    switch (id) {
      case 'mess': return { iconBg: 'bg-orange-500 text-white' };
      case 'food': return { iconBg: 'bg-amber-500 text-white' };
      case 'street-food': return { iconBg: 'bg-red-500 text-white' };
      case 'salon': return { iconBg: 'bg-indigo-600 text-white' };
      case 'pg': return { iconBg: 'bg-blue-600 text-white' };
      case 'printing': return { iconBg: 'bg-cyan-600 text-white' };
      case 'stationery': return { iconBg: 'bg-emerald-600 text-white' };
      case 'medical': return { iconBg: 'bg-rose-600 text-white' };
      case 'grocery': return { iconBg: 'bg-green-600 text-white' };
      case 'laundry': return { iconBg: 'bg-sky-600 text-white' };
      case 'shops': return { iconBg: 'bg-purple-600 text-white' };
      default: return { iconBg: 'bg-slate-700 text-white' };
    }
  };

  // Compact variant for explore view
  if (compact) {
    return (
      <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 no-scrollbar">
        {CATEGORIES.map((cat: CategoryMeta) => {
          const isSelected = selectedCategory === cat.id;
          const count = placesCountByCategory[cat.id] ?? 0;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer border ${
                isSelected
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 border-slate-900 dark:border-white shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-750'
              }`}
            >
              <span className={isSelected ? 'text-white dark:text-slate-950' : 'text-slate-500 dark:text-slate-400'}>
                {renderIcon(cat.iconName, "w-4 h-4")}
              </span>
              <span>{cat.label}</span>
              {count > 0 && cat.id !== 'all' && (
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                  isSelected 
                    ? 'bg-slate-800 dark:bg-slate-200 text-slate-200 dark:text-slate-900' 
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300'
                }`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  // Grid layout for home view
  const gridCategories = CATEGORIES.filter(c => c.id !== 'all');

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4">
      {gridCategories.map((cat: CategoryMeta) => {
        const theme = getCategoryTheme(cat.id);
        const count = placesCountByCategory[cat.id] ?? 0;
        const isSelected = selectedCategory === cat.id;

        return (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={`group text-left p-4 rounded-2xl border transition-all duration-200 flex flex-col justify-between h-34 sm:h-38 cursor-pointer relative overflow-hidden bg-white dark:bg-slate-900 hover:-translate-y-0.5 hover:shadow-md ${
              isSelected 
                ? 'ring-2 ring-blue-600 border-blue-600' 
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            {/* Top row with icon & count */}
            <div className="flex items-center justify-between w-full">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-xs ${theme.iconBg}`}>
                {renderIcon(cat.iconName, "w-5 h-5")}
              </div>
              <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                {count > 0 ? `${count} spots` : 'Explore'}
              </span>
            </div>

            {/* Bottom info */}
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base group-hover:text-blue-600 dark:group-hover:text-blue-400 transition flex items-center justify-between">
                <span>{cat.label}</span>
                <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-blue-600 dark:text-blue-400" />
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5 font-normal">
                {cat.description}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
};
