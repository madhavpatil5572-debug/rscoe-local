import React from 'react';
import { 
  Star, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Sparkles, 
  Navigation, 
  ArrowRight
} from 'lucide-react';
import type { Place } from '../types';

interface PlaceCardProps {
  place: Place;
  isSelected?: boolean;
  onSelect: (place: Place) => void;
  onGetDirections?: (place: Place) => void;
  onHover?: (place: Place | null) => void;
}

export const PlaceCard: React.FC<PlaceCardProps> = ({
  place,
  isSelected = false,
  onSelect,
  onGetDirections,
  onHover,
}) => {
  const getPriceTierBadge = (level: string) => {
    switch (level) {
      case 'budget':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            ₹ Budget Friendly
          </span>
        );
      case 'moderate':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
            ₹₹ Moderate
          </span>
        );
      case 'premium':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
            ₹₹₹ Premium
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div
      onClick={() => onSelect(place)}
      onMouseEnter={() => onHover && onHover(place)}
      onMouseLeave={() => onHover && onHover(null)}
      className={`group bg-white dark:bg-slate-900 rounded-2xl border transition-all duration-200 overflow-hidden cursor-pointer flex flex-col justify-between ${
        isSelected
          ? 'ring-2 ring-blue-600 border-blue-600 shadow-md'
          : 'border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-lg'
      }`}
    >
      <div>
        {/* Card Image and Badges */}
        <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
          <img
            src={place.photos[0]}
            alt={place.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />

          {/* Top Badges */}
          <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
            {place.verified ? (
              <span className="inline-flex items-center gap-1 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md text-emerald-800 dark:text-emerald-300 text-[11px] font-bold px-2.5 py-1 rounded-full shadow-xs border border-emerald-200 dark:border-emerald-800">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 fill-emerald-100 dark:fill-emerald-950" />
                <span>Student Verified</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 bg-amber-500/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                Pending Audit
              </span>
            )}

            <div className="flex items-center gap-1 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-2 py-1 rounded-full text-slate-800 dark:text-slate-100 text-xs font-bold shadow-xs">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
              <span>{place.rating.toFixed(1)}</span>
              <span className="text-[10px] text-slate-400 font-normal">({place.reviewCount})</span>
            </div>
          </div>

          {/* Bottom Overlay Info on Image */}
          <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-xs font-semibold">
            <span className="bg-slate-950/80 backdrop-blur-md text-white text-[11px] px-2.5 py-1 rounded-lg flex items-center gap-1">
              <MapPin className="w-3 h-3 text-rose-400" />
              {place.distanceFromCollege}
            </span>

            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md backdrop-blur-md ${
              place.isOpenNow 
                ? 'bg-emerald-500/90 text-white' 
                : 'bg-slate-800/90 text-slate-300'
            }`}>
              {place.isOpenNow ? 'Open Now' : 'Closed Now'}
            </span>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-4 sm:p-5">
          {/* Category & Price tag row */}
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide">
              {place.subcategory}
            </span>
            {getPriceTierBadge(place.priceLevel)}
          </div>

          {/* Place Title */}
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
            {place.name}
          </h3>

          {/* Price Range */}
          <p className="text-xs font-medium text-slate-600 dark:text-slate-300 mt-1 flex items-center gap-1.5">
            <span className="text-slate-900 dark:text-slate-100 font-bold">{place.priceRange}</span>
          </p>

          {/* Student Perk or Description Snippet */}
          {place.studentPerks ? (
            <div className="mt-2.5 p-2 bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/60 rounded-xl text-[11px] text-amber-900 dark:text-amber-200 flex items-start gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <span className="line-clamp-1 font-medium">{place.studentPerks}</span>
            </div>
          ) : (
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
              {place.description}
            </p>
          )}

          {/* Popular Services Chips */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {place.services.slice(0, 3).map((svc, i) => (
              <span
                key={i}
                className="text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-md border border-slate-200/60 dark:border-slate-700/60"
              >
                {svc.name} • <span className="text-slate-900 dark:text-slate-100 font-bold">₹{svc.price}</span>
              </span>
            ))}
            {place.services.length > 3 && (
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium px-1.5 py-0.5">
                +{place.services.length - 3} more
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Card Actions Footer */}
      <div className="px-4 sm:px-5 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 flex items-center justify-between gap-2">
        <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 font-medium">
          <Clock className="w-3 h-3 text-slate-400 dark:text-slate-500" />
          <span className="line-clamp-1">{place.openingHours}</span>
        </span>

        <div className="flex items-center gap-1.5 shrink-0">
          {onGetDirections && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onGetDirections(place);
              }}
              className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800 rounded-lg transition"
              title="Get walking directions"
            >
              <Navigation className="w-4 h-4" />
            </button>
          )}
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(place);
            }}
            className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 group-hover:translate-x-0.5 transition-transform"
          >
            <span>Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
