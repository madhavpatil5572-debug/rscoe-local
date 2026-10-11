import React from 'react';
import { 
  X, 
  Navigation, 
  Footprints, 
  ExternalLink, 
  ShieldCheck
} from 'lucide-react';
import type { Place } from '../types';
import { RSCOE_LOCATION } from '../data/placesData';

interface DirectionsModalProps {
  place: Place | null;
  onClose: () => void;
}

export const DirectionsModal: React.FC<DirectionsModalProps> = ({ place, onClose }) => {
  if (!place) return null;

    const googleMapsKey = (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyCZsXFZAdC6YKYeLk1S6riL_mn1vo02fRg';
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${RSCOE_LOCATION.latitude},${RSCOE_LOCATION.longitude}&destination=${place.latitude},${place.longitude}&travelmode=walking`;

    const estimatedWalkingMinutes = Math.max(1, Math.round(place.distanceKm * 13));

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 dark:bg-black/75 backdrop-blur-sm overflow-y-auto animate-fadeIn">
        <div 
          className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-850/50">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                <Navigation className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Walking Directions
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  From JSPM RSCOE to {place.name}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 space-y-5">
            {/* Embedded Google Maps Live Route */}
            <div className="w-full h-48 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-inner bg-slate-100 dark:bg-slate-800">
              <iframe
                title={`Google Maps route to ${place.name}`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.google.com/maps/embed/v1/directions?key=${googleMapsKey}&origin=${RSCOE_LOCATION.latitude},${RSCOE_LOCATION.longitude}&destination=${place.latitude},${place.longitude}&mode=walking`}
              />
            </div>

            {/* Walking Time & Distance Pill */}
            <div className="p-4 bg-blue-50 dark:bg-blue-950/60 border border-blue-200/80 dark:border-blue-900/60 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                  <Footprints className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-base font-extrabold text-blue-950 dark:text-blue-100">
                    ~{estimatedWalkingMinutes} mins walk
                  </div>
                  <div className="text-xs text-blue-700 dark:text-blue-300 font-medium">
                    {place.distanceFromCollege}
                  </div>
                </div>
              </div>

              <span className="text-[11px] font-bold bg-white dark:bg-slate-900 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full shadow-2xs border border-blue-200 dark:border-blue-800">
                Student Route
              </span>
            </div>

          {/* Stepper Route Preview */}
          <div className="space-y-4 pl-2">
            {/* Step 1: College Gate */}
            <div className="flex items-start gap-3 relative">
              <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-black shrink-0 mt-0.5 shadow-xs">
                1
              </div>
              <div className="flex-1 pb-4 border-l-2 border-dashed border-slate-200 dark:border-slate-700 pl-4 ml-[-20px] pt-0.5">
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  Depart from JSPM RSCOE Campus
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Main College Gate, Ashok Nagar, Tathwade
                </div>
              </div>
            </div>

            {/* Step 2: Campus road checkpoint */}
            <div className="flex items-start gap-3 relative">
              <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center text-xs font-black shrink-0 mt-0.5">
                2
              </div>
              <div className="flex-1 pb-4 border-l-2 border-dashed border-slate-200 dark:border-slate-700 pl-4 ml-[-20px] pt-0.5">
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  Head along Campus Perimeter Road
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Well-lit student walkway with daily messes and tea stalls
                </div>
              </div>
            </div>

            {/* Step 3: Destination */}
            <div className="flex items-start gap-3 relative">
              <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-black shrink-0 mt-0.5 shadow-xs">
                3
              </div>
              <div className="flex-1 pl-4 ml-[-20px] pt-0.5">
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  Arrive at {place.name}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  {place.address}
                </div>
              </div>
            </div>
          </div>

          {/* Verification badge reminder */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
            <span className="flex items-center gap-1.5 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Verified opening hours: {place.openingHours}
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
              place.isOpenNow 
                ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300' 
                : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
            }`}>
              {place.isOpenNow ? 'Open Now' : 'Closed'}
            </span>
          </div>

          {/* Action Button: Google Maps External Link */}
          <div className="pt-2">
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-sm shadow-md shadow-blue-500/25 transition cursor-pointer"
            >
              <span>Open Live Route in Google Maps</span>
              <ExternalLink className="w-4 h-4" />
            </a>
            <p className="text-[11px] text-center text-slate-400 dark:text-slate-500 mt-2">
              Opens full GPS turn-by-turn navigation on your phone
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
