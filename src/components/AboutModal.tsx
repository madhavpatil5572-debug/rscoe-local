import React from 'react';
import { 
  ShieldCheck, 
  MapPin, 
  Sparkles, 
  Database, 
  Bot, 
  GraduationCap
} from 'lucide-react';

export const AboutModal: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-10 animate-fadeIn">
      {/* Hero header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 text-blue-700 dark:text-blue-300 text-xs font-bold">
          <GraduationCap className="w-4 h-4" />
          <span>JSPM RSCOE Tathwade • Student Initiative</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          About RSCOE Local
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          The verified hyperlocal campus discovery platform designed to help new engineers, hostelites, and residents navigate daily life around Tathwade, Pune.
        </p>
      </div>

      {/* Purpose cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white text-base">Physical Peer Audits</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Our student volunteer team visits local spots to verify menu prices, student meal passes, Wi-Fi availability, and timings. No fake sponsored 5-star reviews.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 flex items-center justify-center font-bold">
            <MapPin className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white text-base">Campus-First Distances</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Every distance is measured straight from RSCOE Main Gate & Back Gate. Know whether a print shop is a 2-minute sprint during exam rush or a 15-minute walk.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white text-base">Student Affordability</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Filter messes under ₹3,000/month, haircuts under ₹150, and ₹1.5 double-sided engineering drawing prints. Built to respect student budgets.
          </p>
        </div>
      </div>

      {/* Technical Architecture Blueprint */}
      <div className="bg-slate-900 dark:bg-slate-950 text-white rounded-3xl p-6 sm:p-8 space-y-6 border border-slate-800">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
            System Design & Future Roadmap
          </span>
          <h2 className="text-xl sm:text-2xl font-black mt-1">
            Engineering Blueprint for RSCOE Local
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            How this frontend prototype is engineered to scale into a full campus platform:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          {/* Core pipeline */}
          <div className="space-y-3 bg-slate-800/80 dark:bg-slate-900 p-5 rounded-2xl border border-slate-700 dark:border-slate-800">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <Database className="w-4 h-4" />
              <span>Core Application Pipeline</span>
            </div>
            <div className="space-y-2 text-slate-300 font-mono text-[11px] leading-relaxed">
              <div className="p-2 bg-slate-950 rounded-lg border border-slate-800">
                1. Frontend (React 19 + TypeScript + Tailwind CSS)
              </div>
              <div className="text-center text-slate-500">↓ REST / GraphQL</div>
              <div className="p-2 bg-slate-950 rounded-lg border border-slate-800">
                2. Backend API (FastAPI / Node.js)
              </div>
              <div className="text-center text-slate-500">↓ RLS Security</div>
              <div className="p-2 bg-slate-950 rounded-lg border border-slate-800">
                3. PostgreSQL / Supabase Verified Places Schema
              </div>
              <div className="text-center text-slate-500">↓ GeoJSON</div>
              <div className="p-2 bg-slate-950 rounded-lg border border-slate-800">
                4. Leaflet / Mapbox Location & Routing
              </div>
            </div>
          </div>

          {/* AI assistant pipeline */}
          <div className="space-y-3 bg-slate-800/80 dark:bg-slate-900 p-5 rounded-2xl border border-slate-700 dark:border-slate-800">
            <div className="flex items-center gap-2 text-blue-400 font-bold">
              <Bot className="w-4 h-4" />
              <span>RSCOE AI Grounded Pipeline</span>
            </div>
            <div className="space-y-2 text-slate-300 font-mono text-[11px] leading-relaxed">
              <div className="p-2 bg-slate-950 rounded-lg border border-slate-800">
                1. Student Query ("Haircut under ₹150 within 500m")
              </div>
              <div className="text-center text-slate-500">↓ Semantic Search</div>
              <div className="p-2 bg-slate-950 rounded-lg border border-slate-800">
                2. Vector DB (Supabase pgvector Embeddings)
              </div>
              <div className="text-center text-slate-500">↓ Retrieved Context</div>
              <div className="p-2 bg-slate-950 rounded-lg border border-slate-800">
                3. LLM API (Grounded strictly on physical audits)
              </div>
              <div className="text-center text-slate-500">↓ Verified Output</div>
              <div className="p-2 bg-slate-950 rounded-lg border border-slate-800">
                4. Hallucination-free direct recommendations
              </div>
            </div>
          </div>
        </div>

        {/* Prototype Verification disclaimer */}
        <div className="p-4 bg-slate-800/60 dark:bg-slate-900 rounded-xl border border-slate-700 dark:border-slate-800 text-slate-400 text-xs">
          <strong>Academic Prototype Notice:</strong> Developed for educational demonstration at JSPM Rajarshi Shahu College of Engineering, Tathwade, Pune. All listings are categorized as prototype sample data.
        </div>
      </div>
    </div>
  );
};
