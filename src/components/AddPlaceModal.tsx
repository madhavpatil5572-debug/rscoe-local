import React, { useState } from 'react';
import { 
  X, 
  PlusCircle, 
  Upload, 
  CheckCircle2, 
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import type { CategoryId, Place, PriceLevel } from '../types';
import { CATEGORIES, RSCOE_LOCATION } from '../data/placesData';

interface AddPlaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPlace: (newPlace: Place) => void;
  initialPlaceToUpdate?: Place | null;
}

export const AddPlaceModal: React.FC<AddPlaceModalProps> = ({
  isOpen,
  onClose,
  onAddPlace,
  initialPlaceToUpdate,
}) => {
  const [name, setName] = useState(initialPlaceToUpdate?.name || '');
  const [category, setCategory] = useState<CategoryId>(initialPlaceToUpdate?.category || 'food');
  const [subcategory, setSubcategory] = useState(initialPlaceToUpdate?.subcategory || '');
  const [address, setAddress] = useState(initialPlaceToUpdate?.address || '');
  const [phone, setPhone] = useState(initialPlaceToUpdate?.phone || '');
  const [openingHours, setOpeningHours] = useState(initialPlaceToUpdate?.openingHours || '9:00 AM - 9:00 PM');
  const [priceLevel, setPriceLevel] = useState<PriceLevel>(initialPlaceToUpdate?.priceLevel || 'budget');
  const [priceRange, setPriceRange] = useState(initialPlaceToUpdate?.priceRange || '₹50 - ₹150');
  const [description, setDescription] = useState(initialPlaceToUpdate?.description || '');
  const [studentPerks, setStudentPerks] = useState(initialPlaceToUpdate?.studentPerks || '');
  const [photoUrl] = useState(
    initialPlaceToUpdate?.photos[0] || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80'
  );
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const latOffset = (Math.random() - 0.5) * 0.005;
    const lngOffset = (Math.random() - 0.5) * 0.005;

    const newPlaceObj: Place = {
      id: initialPlaceToUpdate?.id || `user-place-${Date.now()}`,
      name: name.trim(),
      category,
      subcategory: subcategory.trim() || `${category.toUpperCase()} Spot`,
      latitude: initialPlaceToUpdate?.latitude || RSCOE_LOCATION.latitude + latOffset,
      longitude: initialPlaceToUpdate?.longitude || RSCOE_LOCATION.longitude + lngOffset,
      address: address.trim() || 'Tathwade, Near RSCOE, Pune',
      phone: phone.trim() || '+91 98000 00000',
      rating: initialPlaceToUpdate?.rating || 4.5,
      reviewCount: initialPlaceToUpdate?.reviewCount || 1,
      priceLevel,
      priceRange: priceRange.trim() || '₹50 - ₹150',
      openingHours: openingHours.trim(),
      isOpenNow: true,
      description: description.trim() || 'Student recommended local business near JSPM RSCOE campus.',
      services: [
        { name: 'Standard Service / Menu Item', price: 80, popular: true },
        { name: 'Student Special Combo', price: 120, popular: true },
      ],
      photos: [photoUrl],
      verified: false,
      lastVerified: 'Pending Student Audit',
      distanceFromCollege: initialPlaceToUpdate?.distanceFromCollege || '300m from College Gate',
      distanceKm: initialPlaceToUpdate?.distanceKm || 0.3,
      featured: false,
      studentPerks: studentPerks.trim() || undefined,
      reviews: [
        {
          id: `rev-sub-${Date.now()}`,
          author: 'Student Contributor',
          role: 'RSCOE Community',
          rating: 5,
          date: 'Today',
          comment: 'Submitted for peer verification. Excellent spot for engineering students.',
        },
      ],
      isDemo: true,
    };

    onAddPlace(newPlaceObj);
    setSubmittedSuccess(true);
    setTimeout(() => {
      setSubmittedSuccess(false);
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 dark:bg-black/75 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div 
        className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-850/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                {initialPlaceToUpdate ? 'Suggest Update for Spot' : 'Add / Suggest a Place'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Contribute to the RSCOE verified campus network
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Message Banner */}
        {submittedSuccess ? (
          <div className="p-8 text-center space-y-3 animate-fadeIn">
            <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Spot Successfully Submitted!
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 max-w-sm mx-auto leading-relaxed">
              Added to local discovery. Our student verification team will inspect prices and timings on our next weekly campus walk.
            </p>
          </div>
        ) : (
          /* Form Content */
          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
            {/* Student verification note */}
            <div className="p-3 bg-blue-50/70 dark:bg-blue-950/50 border border-blue-200/80 dark:border-blue-900/60 rounded-2xl flex items-start gap-2.5 text-xs text-blue-900 dark:text-blue-200">
              <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
              <span>
                <strong>How it works:</strong> All student suggestions appear immediately in the prototype and are flagged for physical audit by student coordinators.
              </span>
            </div>

            {/* Place Name & Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Place / Business Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Mahaveer Mess, Cut & Style Salon"
                  className="w-full text-xs sm:text-sm px-3 py-2 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as CategoryId)}
                  className="w-full text-xs sm:text-sm px-3 py-2 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  {CATEGORIES.filter(c => c.id !== 'all').map((cat) => (
                    <option key={cat.id} value={cat.id} className="dark:bg-slate-900">
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Subcategory & Price Level */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Subcategory Tag
                </label>
                <input
                  type="text"
                  value={subcategory}
                  onChange={(e) => setSubcategory(e.target.value)}
                  placeholder="e.g. Unlimited Thali, B&W Xerox"
                  className="w-full text-xs sm:text-sm px-3 py-2 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Affordability Tier
                </label>
                <select
                  value={priceLevel}
                  onChange={(e) => setPriceLevel(e.target.value as PriceLevel)}
                  className="w-full text-xs sm:text-sm px-3 py-2 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="budget" className="dark:bg-slate-900">₹ Budget Friendly (Student Saver)</option>
                  <option value="moderate" className="dark:bg-slate-900">₹₹ Moderate (Standard)</option>
                  <option value="premium" className="dark:bg-slate-900">₹₹₹ Premium</option>
                </select>
              </div>
            </div>

            {/* Address & Approximate Price */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Address / Nearby Landmark
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. Near RSCOE Gate 2, Ashok Nagar"
                  className="w-full text-xs sm:text-sm px-3 py-2 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Price Range
                </label>
                <input
                  type="text"
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  placeholder="e.g. ₹60 - ₹80 per meal"
                  className="w-full text-xs sm:text-sm px-3 py-2 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Phone & Timings */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Phone / WhatsApp
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98220 00000"
                  className="w-full text-xs sm:text-sm px-3 py-2 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Opening Timings
                </label>
                <input
                  type="text"
                  value={openingHours}
                  onChange={(e) => setOpeningHours(e.target.value)}
                  placeholder="e.g. 8:00 AM - 10:00 PM"
                  className="w-full text-xs sm:text-sm px-3 py-2 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Student Perks / Tip */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Special Student Benefit / Campus Tip</span>
              </label>
              <input
                type="text"
                value={studentPerks}
                onChange={(e) => setStudentPerks(e.target.value)}
                placeholder="e.g. 10% off with RSCOE ID card, free WiFi, Sunday extra sabji"
                className="w-full text-xs sm:text-sm px-3 py-2 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Description & Student Experience
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe food quality, cleanliness, crowd rush times, seating..."
                className="w-full text-xs sm:text-sm px-3 py-2 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Photo Upload Placeholder */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Photo Upload (Prototype Demo)
              </label>
              <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-center bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 transition cursor-pointer flex flex-col items-center justify-center gap-1">
                <Upload className="w-6 h-6 text-slate-400 dark:text-slate-500" />
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Click to upload photo from phone</span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500">PNG, JPG up to 5MB (Sample image assigned for demo)</span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-blue-500/25 transition cursor-pointer"
              >
                Submit Spot for Verification
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
