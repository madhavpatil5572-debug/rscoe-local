import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Phone, 
  Clock, 
  Star, 
  ShieldCheck, 
  Navigation, 
  Share2, 
  Check, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  Info, 
  MessageSquarePlus
} from 'lucide-react';
import type { Place } from '../types';

interface PlaceDetailsModalProps {
  place: Place | null;
  onClose: () => void;
  onGetDirections: (place: Place) => void;
  onSuggestUpdate?: (place: Place) => void;
}

export const PlaceDetailsModal: React.FC<PlaceDetailsModalProps> = ({
  place,
  onClose,
  onGetDirections,
  onSuggestUpdate,
}) => {
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [copiedShare, setCopiedShare] = useState(false);
  const [newReviewText, setNewReviewText] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [reviewsList, setReviewsList] = useState(place?.reviews || []);
  const [showReviewInput, setShowReviewInput] = useState(false);
  const googleMapsKey = (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyCZsXFZAdC6YKYeLk1S6riL_mn1vo02fRg';

  if (!place) return null;

  const handleShare = () => {
    const url = `${window.location.origin}${window.location.pathname}?spot=${place.id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
    }
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewText.trim()) return;

    const newRev = {
      id: `rev-${Date.now()}`,
      author: 'RSCOE Student',
      role: 'Verified Campus Visitor',
      rating: newReviewRating,
      date: 'Just now',
      comment: newReviewText.trim(),
    };

    setReviewsList([newRev, ...reviewsList]);
    setNewReviewText('');
    setShowReviewInput(false);
  };

  const nextPhoto = () => {
    setActivePhotoIndex((prev) => (prev + 1) % place.photos.length);
  };

  const prevPhoto = () => {
    setActivePhotoIndex((prev) => (prev - 1 + place.photos.length) % place.photos.length);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-900/60 dark:bg-black/75 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div 
        className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Floating Controls */}
        <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
          <button
            onClick={onClose}
            className="pointer-events-auto bg-white/90 dark:bg-slate-800/90 hover:bg-white dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 p-2.5 rounded-full shadow-lg border border-slate-200 dark:border-slate-700 transition hover:scale-105 cursor-pointer flex items-center gap-1.5 text-xs font-bold"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Map</span>
          </button>

          <div className="pointer-events-auto flex items-center gap-2">
            <button
              onClick={handleShare}
              className="bg-white/90 dark:bg-slate-800/90 hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 p-2.5 rounded-full shadow-lg border border-slate-200 dark:border-slate-700 transition hover:scale-105 cursor-pointer"
              title="Share place"
            >
              {copiedShare ? <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="bg-white/90 dark:bg-slate-800/90 hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 p-2.5 rounded-full shadow-lg border border-slate-200 dark:border-slate-700 transition hover:scale-105 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Container */}
        <div className="overflow-y-auto flex-1">
          {/* Photo Gallery Carousel */}
          <div className="relative h-64 sm:h-80 w-full bg-slate-900 select-none">
            <img
              src={place.photos[activePhotoIndex]}
              alt={place.name}
              className="w-full h-full object-cover transition-opacity duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20 pointer-events-none" />

            {/* Photo Navigation arrows */}
            {place.photos.length > 1 && (
              <div className="absolute inset-x-3 top-1/2 -translate-y-1/2 flex items-center justify-between pointer-events-none">
                <button
                  onClick={prevPhoto}
                  className="pointer-events-auto p-2 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-sm transition"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextPhoto}
                  className="pointer-events-auto p-2 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-sm transition"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* Photo Thumbnails Dots */}
            {place.photos.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full">
                {place.photos.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActivePhotoIndex(idx)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      activePhotoIndex === idx ? 'bg-white w-5' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            )}

            {/* Floating verification and category banner */}
            <div className="absolute bottom-4 left-4 right-4 pointer-events-none flex items-end justify-between">
              <div>
                <span className="inline-block px-2.5 py-1 bg-blue-600/90 text-white text-xs font-bold rounded-lg uppercase tracking-wider backdrop-blur-sm shadow-md">
                  {place.subcategory}
                </span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/95 dark:bg-slate-900/95 text-slate-900 dark:text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
                <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                <span>{place.rating.toFixed(1)}</span>
                <span className="text-slate-400 font-normal">({place.reviewCount} reviews)</span>
              </div>
            </div>
          </div>

          {/* Details Content Body */}
          <div className="p-5 sm:p-7 space-y-6">
            
            {/* Header Title & Verification Block */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {place.name}
                </h1>
                
                {/* Student Verified Big Badge */}
                {place.verified ? (
                  <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 px-3.5 py-1.5 rounded-2xl shadow-2xs">
                    <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    <div>
                      <div className="text-xs font-black tracking-tight">Student Verified</div>
                      <div className="text-[10px] text-emerald-700 dark:text-emerald-400 font-medium">Last audited: {place.lastVerified}</div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 px-3 py-1.5 rounded-xl text-xs font-semibold">
                    <Info className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <span>Community Listed (Pending Audit)</span>
                  </div>
                )}
              </div>

              {/* Price & Distance Row */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 dark:text-slate-300 pt-1">
                <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-xl">
                  <span>{place.priceRange}</span>
                </div>
                <div className="flex items-center gap-1 text-slate-700 dark:text-slate-300 font-medium">
                  <MapPin className="w-4 h-4 text-rose-500" />
                  <span>{place.distanceFromCollege}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                  <Clock className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                  <span>{place.openingHours}</span>
                  <span className={`ml-1 text-[11px] font-bold px-2 py-0.5 rounded-md ${
                    place.isOpenNow 
                      ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300' 
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}>
                    {place.isOpenNow ? 'Open Now' : 'Closed'}
                  </span>
                </div>
              </div>
            </div>

            {/* Student Perks Banner */}
            {place.studentPerks && (
              <div className="bg-gradient-to-r from-amber-500/10 via-amber-50 to-orange-500/10 dark:from-amber-950/30 dark:via-amber-900/20 dark:to-orange-950/30 border border-amber-200 dark:border-amber-800/60 rounded-2xl p-4 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-200">
                    RSCOE Student Benefit / Campus Tip
                  </h4>
                  <p className="text-sm font-semibold text-amber-950 dark:text-amber-100 mt-0.5">
                    {place.studentPerks}
                  </p>
                </div>
              </div>
            )}

            {/* Quick Action Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <button
                onClick={() => onGetDirections(place)}
                className="flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-sm shadow-md shadow-blue-500/20 transition cursor-pointer"
              >
                <Navigation className="w-4 h-4" />
                <span>Get Directions</span>
              </button>

              <a
                href={`tel:${place.phone.replace(/\s+/g, '')}`}
                className="flex items-center justify-center gap-2 py-3 px-4 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white rounded-2xl font-bold text-sm shadow-md transition"
              >
                <Phone className="w-4 h-4" />
                <span>Call Business</span>
              </a>

              <button
                onClick={() => {
                  if (onSuggestUpdate) onSuggestUpdate(place);
                }}
                className="col-span-2 sm:col-span-1 flex items-center justify-center gap-2 py-3 px-4 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 rounded-2xl font-bold text-sm shadow-xs transition cursor-pointer"
              >
                <span>Suggest Update</span>
              </button>
            </div>

            {/* About / Description */}
            <div className="border-t border-slate-200 dark:border-slate-800 pt-5">
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">About this spot</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {place.description}
              </p>
              <div className="mt-3 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <MapPin className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" />
                <span><strong>Address:</strong> {place.address}</span>
              </div>
              {/* Google Maps Embed Preview */}
              <div className="mt-3 w-full h-36 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-inner bg-slate-100 dark:bg-slate-800">
                <iframe
                  title={`Google Map location of ${place.name}`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://www.google.com/maps/embed/v1/place?key=${googleMapsKey}&q=${place.latitude},${place.longitude}&zoom=17`}
                />
              </div>
            </div>

            {/* Verified Services & Pricing Menu */}
            <div className="border-t border-slate-200 dark:border-slate-800 pt-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Verified Services & Pricing
                </h3>
                <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-2.5 py-0.5 rounded-full">
                  Physically Audited
                </span>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-50/50 dark:bg-slate-850">
                {place.services.map((item, idx) => (
                  <div 
                    key={idx}
                    className="p-3.5 sm:px-4 flex items-center justify-between gap-4 hover:bg-white dark:hover:bg-slate-800 transition"
                  >
                    <div className="flex items-center gap-2">
                      {item.popular && (
                        <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200">
                          Popular
                        </span>
                      )}
                      <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                        {item.name}
                      </span>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                        ₹{item.price}
                      </span>
                      {item.unit && (
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium ml-1">
                          / {item.unit}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Student Reviews & Tips */}
            <div className="border-t border-slate-200 dark:border-slate-800 pt-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Student Reviews & Insights
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Real feedback from JSPM RSCOE peers
                  </p>
                </div>

                <button
                  onClick={() => setShowReviewInput(!showReviewInput)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 px-3 py-1.5 rounded-xl transition cursor-pointer"
                >
                  <MessageSquarePlus className="w-3.5 h-3.5" />
                  <span>Add Review</span>
                </button>
              </div>

              {/* Add Review inline form */}
              {showReviewInput && (
                <form onSubmit={handleAddReview} className="mb-4 p-4 rounded-2xl bg-blue-50/60 dark:bg-slate-800/80 border border-blue-200 dark:border-slate-700 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Your Rating:</span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewReviewRating(star)}
                          className="p-1 cursor-pointer"
                        >
                          <Star className={`w-4 h-4 ${
                            star <= newReviewRating 
                              ? 'text-amber-500 fill-amber-400' 
                              : 'text-slate-300 dark:text-slate-600'
                          }`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <textarea
                    rows={2}
                    value={newReviewText}
                    onChange={(e) => setNewReviewText(e.target.value)}
                    placeholder="Share honest tips for fellow students (e.g., best time to go, discounts)..."
                    className="w-full text-xs p-2.5 rounded-xl border border-blue-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowReviewInput(false)}
                      className="px-3 py-1 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-3 py-1 text-xs font-bold bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-xs cursor-pointer"
                    >
                      Post Review
                    </button>
                  </div>
                </form>
              )}

              {/* Reviews List */}
              <div className="space-y-3">
                {reviewsList.map((rev) => (
                  <div 
                    key={rev.id}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">{rev.author}</span>
                        <span className="ml-2 text-[11px] font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-md">
                          {rev.role}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-xs font-bold text-slate-700 dark:text-slate-300">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                        <span>{rev.rating}</span>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      "{rev.comment}"
                    </p>

                    <div className="text-[10px] text-slate-400 dark:text-slate-500 pt-1">
                      {rev.date}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Prototype Demo Data Notice */}
            <div className="border-t border-slate-200 dark:border-slate-800 pt-4 text-center">
              <span className="inline-block text-[11px] text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full font-medium">
                Prototype Demo Listing • JSPM RSCOE Tathwade Student Discovery MVP
              </span>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
