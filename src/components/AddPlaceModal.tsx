import React, { useState } from 'react';
import { 
  X, 
  PlusCircle, 
  Upload, 
  CheckCircle2, 
  ShieldCheck,
  Sparkles,
  MapPin,
  Image as ImageIcon,
  Compass,
  Info
} from 'lucide-react';
import type { CategoryId, Place, PriceLevel } from '../types';
import { CATEGORIES, RSCOE_LOCATION } from '../data/placesData';

interface AddPlaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPlace: (newPlace: Place) => void;
  initialPlaceToUpdate?: Place | null;
}

const PHOTO_PRESETS: { label: string; url: string }[] = [
  { label: 'Biryani / Non-Veg', url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80' },
  { label: 'Cafe / Coffee', url: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&auto=format&fit=crop&q=80' },
  { label: 'Student Mess / Thali', url: 'https://images.unsplash.com/photo-1613292443284-8d10ef9383fe?w=800&auto=format&fit=crop&q=80' },
  { label: 'Grocery / Mart', url: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=800&auto=format&fit=crop&q=80' },
  { label: 'Mobile / Laptop Repair', url: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800&auto=format&fit=crop&q=80' },
  { label: 'College Essentials / Books', url: 'https://images.unsplash.com/photo-1507842229451-7f01be7fe80d?w=800&auto=format&fit=crop&q=80' },
  { label: 'Gym / Fitness', url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=80' },
  { label: 'Salon & Grooming', url: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=800&auto=format&fit=crop&q=80' },
];

export const AddPlaceModal: React.FC<AddPlaceModalProps> = ({
  isOpen,
  onClose,
  onAddPlace,
  initialPlaceToUpdate,
}) => {
  const [name, setName] = useState(initialPlaceToUpdate?.name || '');
  const [category, setCategory] = useState<CategoryId>(initialPlaceToUpdate?.category || 'mess');
  const [subcategory, setSubcategory] = useState(initialPlaceToUpdate?.subcategory || '');
  const [address, setAddress] = useState(initialPlaceToUpdate?.address || '');
  const [latitude, setLatitude] = useState<string>(
    initialPlaceToUpdate?.latitude ? String(initialPlaceToUpdate.latitude) : String(RSCOE_LOCATION.latitude)
  );
  const [longitude, setLongitude] = useState<string>(
    initialPlaceToUpdate?.longitude ? String(initialPlaceToUpdate.longitude) : String(RSCOE_LOCATION.longitude)
  );
  const [phone, setPhone] = useState(initialPlaceToUpdate?.phone || '');
  const [openingHours, setOpeningHours] = useState(initialPlaceToUpdate?.openingHours || '9:00 AM - 10:00 PM');
  const [priceLevel, setPriceLevel] = useState<PriceLevel>(initialPlaceToUpdate?.priceLevel || 'budget');
  const [priceRange, setPriceRange] = useState(initialPlaceToUpdate?.priceRange || '₹60 - ₹150');
  const [description, setDescription] = useState(initialPlaceToUpdate?.description || '');
  const [studentPerks, setStudentPerks] = useState(initialPlaceToUpdate?.studentPerks || '');
  const [photoUrl, setPhotoUrl] = useState(
    initialPlaceToUpdate?.photos[0] || 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80'
  );
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [showCoordHelper, setShowCoordHelper] = useState(false);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setPhotoUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const calculateDistanceKm = (lat: number, lng: number) => {
    const dLat = (lat - RSCOE_LOCATION.latitude) * 111.32;
    const dLng = (lng - RSCOE_LOCATION.longitude) * (111.32 * Math.cos(RSCOE_LOCATION.latitude * (Math.PI / 180)));
    const dist = Math.sqrt(dLat * dLat + dLng * dLng);
    return Math.round(dist * 100) / 100;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const latNum = parseFloat(latitude) || RSCOE_LOCATION.latitude;
    const lngNum = parseFloat(longitude) || RSCOE_LOCATION.longitude;
    const distKm = calculateDistanceKm(latNum, lngNum);
    const distFormatted = distKm < 1 
      ? `${Math.max(30, Math.round(distKm * 1000))}m from RSCOE Campus` 
      : `${distKm.toFixed(1)} km from RSCOE Campus`;

    const newPlaceObj: Place = {
      id: initialPlaceToUpdate?.id || `user-place-${Date.now()}`,
      name: name.trim(),
      category,
      subcategory: subcategory.trim() || `${category.toUpperCase()} Spot`,
      latitude: latNum,
      longitude: lngNum,
      address: address.trim() || 'Ashok Nagar, Tathwade, Pune 411033',
      phone: phone.trim() || '+91 98000 00000',
      rating: initialPlaceToUpdate?.rating || 4.5,
      reviewCount: initialPlaceToUpdate?.reviewCount || 1,
      priceLevel,
      priceRange: priceRange.trim() || '₹60 - ₹150',
      openingHours: openingHours.trim() || '9:00 AM - 10:00 PM',
      isOpenNow: true,
      description: description.trim() || 'Student-recommended local business near JSPM RSCOE campus.',
      services: initialPlaceToUpdate?.services || [
        { name: 'Standard Service / Menu Item', price: 80, unit: 'per order', popular: true },
        { name: 'Student Special Combo', price: 120, unit: 'combo', popular: true },
      ],
      photos: [photoUrl.trim() || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80'],
      verified: initialPlaceToUpdate?.verified ?? false,
      lastVerified: initialPlaceToUpdate?.lastVerified || 'Pending Student Audit',
      distanceFromCollege: distFormatted,
      distanceKm: distKm,
      featured: initialPlaceToUpdate?.featured || false,
      studentPerks: studentPerks.trim() || undefined,
      reviews: initialPlaceToUpdate?.reviews || [
        {
          id: `rev-sub-${Date.now()}`,
          author: 'Student Contributor',
          role: 'RSCOE Community',
          rating: 5,
          date: 'Just now',
          comment: 'Submitted by student. Saved to local campus directory.',
        },
      ],
      isDemo: true,
    };

    onAddPlace(newPlaceObj);
    setSubmittedSuccess(true);
    setTimeout(() => {
      setSubmittedSuccess(false);
      onClose();
    }, 1600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 dark:bg-black/75 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div 
        className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-auto"
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
                {initialPlaceToUpdate ? 'Edit Spot Details' : 'Add Place Manually'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Add any shop, cafe, mess, or service around JSPM RSCOE Tathwade
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
              Place Successfully Saved!
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 max-w-sm mx-auto leading-relaxed">
              Saved to your browser storage and will appear immediately in the Explore list and Map.
            </p>
          </div>
        ) : (
          /* Form Content */
          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[78vh] overflow-y-auto">
            {/* Persistence & Guide Banner */}
            <div className="p-3 bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 rounded-2xl flex items-start gap-2.5 text-xs text-blue-900 dark:text-blue-200">
              <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <strong>Instant Local Saving:</strong> Places you add here are saved directly in your browser. To make places permanent for all RSCOE students worldwide on the live Vercel URL, you can also share the details with the assistant!
              </div>
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
                  placeholder="e.g. PK Dum Biryani, Chai Point"
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
                  placeholder="e.g. Dum Biryani, Study Cafe, Xerox & Print"
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
                  placeholder="e.g. Opposite RSCOE Gate 1, Ashok Nagar, Tathwade"
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
                  placeholder="e.g. ₹100 - ₹200 per person"
                  className="w-full text-xs sm:text-sm px-3 py-2 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Exact GPS Coordinates Section */}
            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span>Map Location (GPS Coordinates)</span>
                </span>
                <button
                  type="button"
                  onClick={() => setShowCoordHelper(!showCoordHelper)}
                  className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                >
                  <Info className="w-3 h-3" />
                  <span>How to get from Google Maps?</span>
                </button>
              </div>

              {showCoordHelper && (
                <div className="p-2.5 bg-blue-50/70 dark:bg-blue-950/50 rounded-xl text-[11px] text-blue-900 dark:text-blue-200 space-y-1">
                  <p><strong>Step 1:</strong> Open Google Maps on phone or browser and locate the shop.</p>
                  <p><strong>Step 2:</strong> Right-click (or long press on phone) the spot on the map.</p>
                  <p><strong>Step 3:</strong> Click the coordinate numbers at the top (e.g. <code>18.6198, 73.7542</code>) to copy them, and paste them into the fields below.</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-0.5">
                    Latitude (RSCOE is 18.6186)
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                    placeholder="18.6186"
                    className="w-full text-xs px-3 py-1.5 bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-0.5">
                    Longitude (RSCOE is 73.7554)
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                    placeholder="73.7554"
                    className="w-full text-xs px-3 py-1.5 bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                <span>Calculated distance: <strong>{calculateDistanceKm(parseFloat(latitude) || RSCOE_LOCATION.latitude, parseFloat(longitude) || RSCOE_LOCATION.longitude)} km from RSCOE</strong></span>
                <button
                  type="button"
                  onClick={() => {
                    setLatitude(String(RSCOE_LOCATION.latitude));
                    setLongitude(String(RSCOE_LOCATION.longitude));
                  }}
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Reset to RSCOE Main Pin
                </button>
              </div>
            </div>

            {/* Photo Selection & Upload */}
            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl space-y-2.5">
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>Place Photo / Image</span>
              </label>

              {/* Photo Preview & URL input */}
              <div className="flex gap-3 items-center">
                <div className="w-20 h-16 rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-700 shrink-0 border border-slate-300 dark:border-slate-600">
                  <img 
                    src={photoUrl} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80';
                    }}
                  />
                </div>
                <div className="flex-1 space-y-1.5">
                  <input
                    type="url"
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                    placeholder="Paste direct image link (Unsplash, Imgur, or direct URL)"
                    className="w-full text-xs px-3 py-1.5 bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <div className="flex items-center gap-2">
                    <label className="cursor-pointer inline-flex items-center gap-1.5 px-2.5 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-[11px] font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                      <Upload className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                      <span>Upload from device</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                    <span className="text-[10px] text-slate-400">or pick quick preset below</span>
                  </div>
                </div>
              </div>

              {/* Preset buttons */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {PHOTO_PRESETS.map((p) => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => setPhotoUrl(p.url)}
                    className="px-2 py-0.5 text-[10px] rounded-md font-medium bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-400 transition"
                  >
                    {p.label}
                  </button>
                ))}
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
                {initialPlaceToUpdate ? 'Save Changes' : 'Save Spot to Directory'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
