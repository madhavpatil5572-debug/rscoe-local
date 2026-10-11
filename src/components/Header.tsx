import React, { useState } from 'react';
import { 
  MapPin, 
  Search, 
  Menu, 
  X, 
  Compass, 
  PlusCircle, 
  ShieldCheck, 
  Info, 
  Sparkles,
  Layers,
  Sun,
  Moon
} from 'lucide-react';
import type { ActiveView } from '../types';
import { useTheme } from '../context/ThemeContext';

interface HeaderProps {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  onOpenAddPlace: () => void;
  onQuickSearchClick?: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeView,
  setActiveView,
  onOpenAddPlace,
  onQuickSearchClick,
  searchQuery,
  setSearchQuery,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const navItems: { id: ActiveView; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Home', icon: <Compass className="w-4 h-4" /> },
    { id: 'explore', label: 'Explore & Map', icon: <Layers className="w-4 h-4" /> },
    { id: 'admin', label: 'Admin Desk', icon: <ShieldCheck className="w-4 h-4" /> },
    { id: 'about', label: 'About', icon: <Info className="w-4 h-4" /> },
  ];

  const handleNavClick = (view: ActiveView) => {
    setActiveView(view);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/90 shadow-xs transition-colors duration-200">
      {/* Top Banner Notice for Prototype */}
      <div className="bg-slate-900 dark:bg-slate-950 text-slate-300 dark:text-slate-400 text-xs py-1.5 px-4 text-center font-medium flex items-center justify-center gap-2 border-b border-slate-800">
        <span className="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full text-[11px] font-semibold">
          <Sparkles className="w-3 h-3 text-emerald-400" /> Prototype MVP
        </span>
        <span className="hidden sm:inline">
          RSCOE Local • Hyperlocal student discovery platform for JSPM RSCOE Tathwade, Pune.
        </span>
        <span className="sm:hidden">
          JSPM RSCOE Tathwade Campus Portal
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Campus Tag */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => handleNavClick('home')}
              className="flex items-center gap-2.5 text-left group transition"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-md shadow-blue-500/20 text-white font-black text-lg tracking-tight group-hover:scale-105 transition-transform">
                RL
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-slate-900 dark:text-white text-lg tracking-tight">RSCOE</span>
                  <span className="font-semibold text-blue-600 dark:text-blue-400 text-lg tracking-tight">Local</span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  <MapPin className="w-3 h-3 text-rose-500" />
                  <span>Tathwade • JSPM Campus</span>
                </div>
              </div>
            </button>
          </div>

          {/* Desktop Search field */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
            <div className="relative w-full">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (activeView !== 'explore' && e.target.value.trim().length > 0) {
                    setActiveView('explore');
                  }
                }}
                onFocus={() => {
                  if (onQuickSearchClick) onQuickSearchClick();
                }}
                placeholder="Search for a salon, mess, PG, medical store..."
                className="w-full pl-10 pr-4 py-2 text-sm bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 border border-slate-200 dark:border-slate-700 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 font-semibold shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Action Buttons + Dark/White Theme Toggle */}
          <div className="flex items-center gap-2">
            
            {/* THEME TOGGLE BUTTON (Dark / White Theme) */}
            <button
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? "Switch to White Theme" : "Switch to Dark Theme"}
              title={theme === 'dark' ? "Switch to White Theme" : "Switch to Dark Theme"}
              className="relative p-2 sm:px-3 sm:py-2 text-xs font-semibold rounded-xl border transition-all duration-200 flex items-center gap-1.5 cursor-pointer shadow-xs bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-750 hover:border-slate-300 dark:hover:border-slate-600 group"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400 group-hover:rotate-45 transition-transform duration-300" />
                  <span className="hidden md:inline text-xs font-medium text-slate-200">Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-slate-700 group-hover:-rotate-12 transition-transform duration-300" />
                  <span className="hidden md:inline text-xs font-medium text-slate-700">Dark</span>
                </>
              )}
            </button>

            {/* Add Place button */}
            <button
              onClick={onOpenAddPlace}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-750 hover:border-slate-400 dark:hover:border-slate-600 transition shadow-xs cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="hidden sm:inline">Add / Suggest</span>
              <span className="sm:hidden">Add</span>
            </button>

            {/* Near RSCOE explore shortcut */}
            <button
              onClick={() => handleNavClick('explore')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm shadow-blue-500/25 transition cursor-pointer"
            >
              <MapPin className="w-4 h-4" />
              Near RSCOE
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>

        {/* Mobile search bar if on mobile */}
        <div className="md:hidden pb-3 pt-1">
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (activeView !== 'explore' && e.target.value.trim().length > 0) {
                  setActiveView('explore');
                }
              }}
              placeholder="Search salons, messes, PGs, xerox..."
              className="w-full pl-9 pr-8 py-2 text-sm bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 border border-slate-200 dark:border-slate-700 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-300"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-3 pb-6 space-y-1 shadow-lg animate-fadeIn">
          {navItems.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 font-semibold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            );
          })}

          {/* Mobile Theme Toggle Item */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 mt-2 flex items-center justify-between px-3.5 py-2">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
              <span>Current: {theme === 'dark' ? 'Dark Theme' : 'White Theme'}</span>
            </span>
            <button
              onClick={toggleTheme}
              className="px-3 py-1.5 text-xs font-bold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
            >
              Switch to {theme === 'dark' ? 'White' : 'Dark'}
            </button>
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 mt-1">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAddPlace();
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 rounded-xl font-semibold text-sm"
            >
              <PlusCircle className="w-4 h-4" />
              Suggest New Local Place
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
