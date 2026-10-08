import React, { useState } from 'react';
import { 
  ShieldCheck, 
  CheckCircle, 
  XCircle, 
  Edit3, 
  Trash2, 
  Plus, 
  Search, 
  Sparkles, 
  Tag,
  AlertCircle
} from 'lucide-react';
import type { Place } from '../types';

interface AdminDashboardProps {
  places: Place[];
  onToggleVerified: (placeId: string) => void;
  onDeletePlace: (placeId: string) => void;
  onEditPlace: (place: Place) => void;
  onAddNewPlace: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  places,
  onToggleVerified,
  onDeletePlace,
  onEditPlace,
  onAddNewPlace,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'verified' | 'pending'>('all');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const totalSpots = places.length;
  const verifiedCount = places.filter((p) => p.verified).length;
  const pendingCount = places.filter((p) => !p.verified).length;
  const budgetCount = places.filter((p) => p.priceLevel === 'budget').length;

  const filteredPlaces = places.filter((place) => {
    const matchesSearch = 
      place.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      place.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      place.address.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = 
      statusFilter === 'all' 
        ? true 
        : statusFilter === 'verified' 
        ? place.verified 
        : !place.verified;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* Top Banner & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Student Team Audit Portal
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">JSPM RSCOE Campus Cell</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Place Verification & Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Audit local shop prices, verify student discounts, and maintain accurate campus data.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onAddNewPlace}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm shadow-md shadow-blue-500/20 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Spot</span>
          </button>
        </div>
      </div>

      {/* Metric Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Listings</div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">{totalSpots}</div>
          <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">Tathwade campus radius</div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-emerald-100 dark:border-emerald-900/60 shadow-2xs bg-gradient-to-br from-emerald-50/40 dark:from-emerald-950/20 to-white dark:to-slate-900">
          <div className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Physically Verified
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-800 dark:text-emerald-300 mt-1">{verifiedCount}</div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1">Audited in October 2026</div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-amber-100 dark:border-amber-900/60 shadow-2xs bg-gradient-to-br from-amber-50/40 dark:from-amber-950/20 to-white dark:to-slate-900">
          <div className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" /> Pending Review
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-800 dark:text-amber-300 mt-1">{pendingCount}</div>
          <div className="text-[11px] text-amber-600 dark:text-amber-400 mt-1">Student submissions queue</div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Tag className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" /> Budget Friendly
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">{budgetCount}</div>
          <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">{Math.round((budgetCount/totalSpots)*100)}% under student budget</div>
        </div>
      </div>

      {/* Architecture note */}
      <div className="bg-slate-900 dark:bg-slate-950 text-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs border border-slate-800">
        <div className="space-y-1">
          <div className="font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Developer Note: Future Supabase / Backend Hookup</span>
          </div>
          <p className="text-slate-400 leading-relaxed max-w-3xl text-[11px]">
            In production, this desk connects to PostgreSQL / Supabase via RLS (Row Level Security). Student coordinators log in via college email to execute audit updates.
          </p>
        </div>
        <span className="px-3 py-1 bg-slate-800 text-emerald-400 font-mono text-[11px] rounded-lg shrink-0 border border-slate-700">
          Role: student_admin (Local Demo)
        </span>
      </div>

      {/* Filter and Search Bar for Places */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter places by name, category, or address..."
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-1.5 self-start sm:self-auto text-xs font-semibold">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-xl border transition cursor-pointer ${
                statusFilter === 'all'
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 border-slate-900 dark:border-white'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750'
              }`}
            >
              All ({totalSpots})
            </button>
            <button
              onClick={() => setStatusFilter('verified')}
              className={`px-3 py-1.5 rounded-xl border transition cursor-pointer ${
                statusFilter === 'verified'
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750'
              }`}
            >
              Verified ({verifiedCount})
            </button>
            <button
              onClick={() => setStatusFilter('pending')}
              className={`px-3 py-1.5 rounded-xl border transition cursor-pointer ${
                statusFilter === 'pending'
                  ? 'bg-amber-600 text-white border-amber-600'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750'
              }`}
            >
              Pending ({pendingCount})
            </button>
          </div>
        </div>

        {/* Places Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-850 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Place / Category</th>
                <th className="py-3 px-4">Price Range & Timings</th>
                <th className="py-3 px-4">Distance</th>
                <th className="py-3 px-4">Verification Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
              {filteredPlaces.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400 dark:text-slate-500">
                    No places found matching current admin filter.
                  </td>
                </tr>
              ) : (
                filteredPlaces.map((place) => (
                  <tr key={place.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-850 transition">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={place.photos[0]}
                          alt={place.name}
                          className="w-10 h-10 rounded-lg object-cover bg-slate-100 dark:bg-slate-800 shrink-0"
                        />
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white text-sm">{place.name}</div>
                          <div className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                            {place.subcategory} • {place.address}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800 dark:text-slate-200">{place.priceRange}</div>
                      <div className="text-[11px] text-slate-400 dark:text-slate-500">{place.openingHours}</div>
                    </td>

                    <td className="py-3 px-4 font-medium text-slate-600 dark:text-slate-300">
                      {place.distanceFromCollege}
                    </td>

                    <td className="py-3 px-4">
                      <button
                        onClick={() => onToggleVerified(place.id)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border transition cursor-pointer ${
                          place.verified
                            ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100'
                            : 'bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800 hover:bg-amber-100'
                        }`}
                        title="Click to toggle verification status"
                      >
                        {place.verified ? (
                          <>
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                            <span>Verified</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                            <span>Pending</span>
                          </>
                        )}
                      </button>
                      <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">{place.lastVerified}</div>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onEditPlace(place)}
                          className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800 rounded-lg transition"
                          title="Edit details / price"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        {confirmDeleteId === place.id ? (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => {
                                onDeletePlace(place.id);
                                setConfirmDeleteId(null);
                              }}
                              className="px-2 py-1 bg-rose-600 text-white rounded text-[10px] font-bold cursor-pointer"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => setConfirmDeleteId(null)}
                              className="px-1.5 py-1 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded text-[10px] cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setConfirmDeleteId(place.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-slate-800 rounded-lg transition cursor-pointer"
                            title="Remove place"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
