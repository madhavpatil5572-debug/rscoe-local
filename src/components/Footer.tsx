import React from 'react';
import { MapPin, ShieldCheck, Heart, Sparkles, Navigation } from 'lucide-react';
import type { ActiveView } from '../types';

interface FooterProps {
  setActiveView: (view: ActiveView) => void;
  onOpenAddPlace: () => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveView, onOpenAddPlace }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand info */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-extrabold text-base shadow-md">
                RL
              </div>
              <div>
                <span className="font-extrabold text-white text-lg tracking-tight">RSCOE</span>
                <span className="font-semibold text-blue-400 text-lg tracking-tight"> Local</span>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              A student-built hyperlocal discovery platform tailored for engineers, hostelites, and staff at JSPM Rajarshi Shahu College of Engineering, Tathwade, Pune.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              <span>Ashok Nagar, Tathwade, Pune 411033</span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Quick Navigation</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button 
                  onClick={() => { setActiveView('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-blue-400 transition"
                >
                  Home Overview
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setActiveView('explore'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-blue-400 transition"
                >
                  Explore Interactive Map
                </button>
              </li>

              <li>
                <button 
                  onClick={onOpenAddPlace}
                  className="hover:text-blue-400 transition text-emerald-400"
                >
                  + Suggest New Place
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setActiveView('admin'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-blue-400 transition"
                >
                  Student Admin Desk
                </button>
              </li>
            </ul>
          </div>

          {/* Student Verification Pillars */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">The Student Pledge</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong className="text-slate-200">Physically Verified:</strong> Inspected by RSCOE students for genuine menu rates.</span>
              </li>
              <li className="flex items-start gap-2">
                <Navigation className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span><strong className="text-slate-200">Walking Distances:</strong> Measured accurately from RSCOE Main & Back Gates.</span>
              </li>
              <li className="flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span><strong className="text-slate-200">Zero Sponsored Bias:</strong> Affordable mess and printing shops prioritized for student wallets.</span>
              </li>
            </ul>
          </div>

          {/* Prototype Notice */}
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 text-xs space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-amber-400">
              <Sparkles className="w-4 h-4" />
              <span>College Project MVP Notice</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              This is a functional prototype. Business names and sample rates reflect real Tathwade campus conditions for academic demonstration. Authentication, payments, and live GPS routing will integrate in future phases.
            </p>
            <div className="pt-2 border-t border-slate-700 flex items-center justify-between text-[11px] text-slate-500">
              <span>Status: Frontend MVP v1.0</span>
              <span className="text-emerald-400">Active</span>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} RSCOE Local • Created for JSPM RSCOE Students & Tathwade Community.</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>by RSCOE Student Developers</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
