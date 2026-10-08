import React, { useState, useMemo } from 'react';
import { 
  Header 
} from './components/Header';
import { 
  Footer 
} from './components/Footer';
import { 
  SearchBar 
} from './components/SearchBar';
import { 
  CategoryGrid 
} from './components/CategoryGrid';
import { 
  MapView 
} from './components/MapView';
import { 
  PlaceCard 
} from './components/PlaceCard';
import { 
  PlaceDetailsModal 
} from './components/PlaceDetailsModal';
import { 
  FilterPanel 
} from './components/FilterPanel';
import { 
  AddPlaceModal 
} from './components/AddPlaceModal';
import { 
  AdminDashboard 
} from './components/AdminDashboard';
import { 
  ChatAssistant 
} from './components/ChatAssistant';
import { 
  DirectionsModal 
} from './components/DirectionsModal';
import { 
  AboutModal 
} from './components/AboutModal';


import { 
  INITIAL_PLACES, 
  CATEGORIES 
} from './data/placesData';
import type { 
  ActiveView, 
  CategoryId, 
  FilterState, 
  Place 
} from './types';

import { 
  MapPin, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  SlidersHorizontal, 
  RotateCcw,
  Compass,
  ChevronRight
} from 'lucide-react';

export function App() {
  const [activeView, setActiveView] = useState<ActiveView>('home');
  const [places, setPlaces] = useState<Place[]>(INITIAL_PLACES);
  
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [hoveredPlace, setHoveredPlace] = useState<Place | null>(null);
  const [directionsPlace, setDirectionsPlace] = useState<Place | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [placeToEdit, setPlaceToEdit] = useState<Place | null>(null);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    category: 'all',
    priceLevel: 'all',
    maxDistanceKm: 3.0,
    minRating: 0,
    openNowOnly: false,
    verifiedOnly: false,
    sortBy: 'featured',
  });

  const placesCountByCategory = useMemo(() => {
    const counts: Record<CategoryId, number> = {} as Record<CategoryId, number>;
    CATEGORIES.forEach(c => { counts[c.id] = 0; });
    places.forEach(p => {
      counts[p.category] = (counts[p.category] || 0) + 1;
      counts['all'] = (counts['all'] || 0) + 1;
    });
    return counts;
  }, [places]);

  const filteredPlaces = useMemo(() => {
    return places.filter((place) => {
      if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase().trim();

        if (query.includes('cheap food')) {
          const isFoodRelated = place.category === 'food' || place.category === 'mess' || place.category === 'street-food';
          const isBudget = place.priceLevel === 'budget';
          if (!isFoodRelated || !isBudget) return false;
        } else {
          const inName = place.name.toLowerCase().includes(query);
          const inCategory = place.category.toLowerCase().includes(query);
          const inSubcategory = place.subcategory.toLowerCase().includes(query);
          const inDesc = place.description.toLowerCase().includes(query);
          const inAddress = place.address.toLowerCase().includes(query);
          const inServices = place.services.some(s => s.name.toLowerCase().includes(query));

          if (!inName && !inCategory && !inSubcategory && !inDesc && !inAddress && !inServices) {
            return false;
          }
        }
      }

      if (filters.category !== 'all' && place.category !== filters.category) {
        return false;
      }

      if (filters.priceLevel !== 'all' && place.priceLevel !== filters.priceLevel) {
        return false;
      }

      if (place.distanceKm > filters.maxDistanceKm) {
        return false;
      }

      if (filters.minRating > 0 && place.rating < filters.minRating) {
        return false;
      }

      if (filters.openNowOnly && !place.isOpenNow) {
        return false;
      }

      if (filters.verifiedOnly && !place.verified) {
        return false;
      }

      if (filters.quickAffordabilityFilter === 'food_under_50') {
        const hasLowItem = place.services.some(s => s.price <= 50);
        if (!hasLowItem && place.priceLevel !== 'budget') return false;
      }
      if (filters.quickAffordabilityFilter === 'mess_under_3000') {
        if (place.category !== 'mess') return false;
        const affordableMess = place.services.some(s => s.price <= 3000 || s.price <= 70);
        if (!affordableMess) return false;
      }
      if (filters.quickAffordabilityFilter === 'salon_under_150') {
        if (place.category !== 'salon') return false;
        const affordableCut = place.services.some(s => s.price <= 150);
        if (!affordableCut) return false;
      }

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'distance') {
        return a.distanceKm - b.distanceKm;
      }
      if (filters.sortBy === 'rating') {
        return b.rating - a.rating;
      }
      if (filters.sortBy === 'price') {
        const priceOrder = { budget: 1, moderate: 2, premium: 3 };
        return priceOrder[a.priceLevel] - priceOrder[b.priceLevel];
      }
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return a.distanceKm - b.distanceKm;
    });
  }, [places, filters]);

  const popularNearbyPlaces = useMemo(() => {
    return places.filter(p => p.featured || p.rating >= 4.6).slice(0, 6);
  }, [places]);

  const handleResetFilters = () => {
    setFilters({
      searchQuery: '',
      category: 'all',
      priceLevel: 'all',
      maxDistanceKm: 3.0,
      minRating: 0,
      openNowOnly: false,
      verifiedOnly: false,
      quickAffordabilityFilter: undefined,
      sortBy: 'featured',
    });
  };

  const handleHomeCategorySelect = (catId: CategoryId) => {
    setFilters(prev => ({ ...prev, category: catId }));
    setActiveView('explore');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddOrUpdatePlace = (newPlace: Place) => {
    setPlaces(prev => {
      const exists = prev.some(p => p.id === newPlace.id);
      if (exists) {
        return prev.map(p => p.id === newPlace.id ? newPlace : p);
      }
      return [newPlace, ...prev];
    });
    setPlaceToEdit(null);
  };

  const handleToggleVerified = (placeId: string) => {
    setPlaces(prev => prev.map(p => {
      if (p.id === placeId) {
        const nextVerified = !p.verified;
        return {
          ...p,
          verified: nextVerified,
          lastVerified: nextVerified ? 'October 2026' : 'Pending Verification',
        };
      }
      return p;
    }));
  };

  const handleDeletePlace = (placeId: string) => {
    setPlaces(prev => prev.filter(p => p.id !== placeId));
  };

  const handleEditPlace = (place: Place) => {
    setPlaceToEdit(place);
    setIsAddModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100 transition-colors duration-200">
      
      {/* Header */}
      <Header
        activeView={activeView}
        setActiveView={setActiveView}
        onOpenAddPlace={() => {
          setPlaceToEdit(null);
          setIsAddModalOpen(true);
        }}
        searchQuery={filters.searchQuery}
        setSearchQuery={(q) => setFilters(prev => ({ ...prev, searchQuery: q }))}
      />

      {/* Main Views */}
      <main className="flex-1">
        
        {/* VIEW 1: HOME PAGE */}
        {activeView === 'home' && (
          <div className="space-y-12 sm:space-y-16 animate-fadeIn">
            
            {/* HERO SECTION */}
            <section className="relative overflow-hidden bg-white dark:bg-slate-950 border-b border-slate-200/80 dark:border-slate-850 pt-10 pb-16 sm:pt-14 sm:pb-20 transition-colors duration-200">
              <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

              <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
                
                {/* Location Pill */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200/90 dark:border-blue-900 text-blue-700 dark:text-blue-300 text-xs font-bold shadow-2xs">
                  <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping"></span>
                  <MapPin className="w-3.5 h-3.5 text-rose-500" />
                  <span>JSPM RSCOE Tathwade, Pune</span>
                </div>

                {/* Hero Title */}
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-950 dark:text-white tracking-tight leading-[1.15]">
                  Everything you need <br className="hidden sm:inline" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                    around RSCOE.
                  </span>
                </h1>

                {/* Hero Subtitle */}
                <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
                  Discover affordable food, PGs, salons, shops and everyday services around JSPM RSCOE, Tathwade.
                </p>

                {/* Large Search Bar */}
                <div className="max-w-2xl mx-auto pt-2">
                  <SearchBar
                    value={filters.searchQuery}
                    onChange={(q) => setFilters(prev => ({ ...prev, searchQuery: q }))}
                    onSubmit={() => {
                      setActiveView('explore');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    placeholder="Search for a salon, mess, PG, medical store..."
                  />
                </div>

                {/* Pillars highlight */}
                <div className="pt-4 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Physically Student Verified</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>Hostel & Engineering Budget Focus</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-rose-500" />
                    <span>Exact Campus Walking Distances</span>
                  </span>
                </div>

              </div>
            </section>

            {/* POPULAR CATEGORIES SECTION */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                    Explore by Category
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                    Daily student services within 5 to 10 minutes walking from RSCOE
                  </p>
                </div>

                <button
                  onClick={() => {
                    setActiveView('categories');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1 transition cursor-pointer"
                >
                  <span>All Categories</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <CategoryGrid
                selectedCategory={filters.category}
                onSelectCategory={handleHomeCategorySelect}
                placesCountByCategory={placesCountByCategory}
              />
            </section>

            {/* MAP PREVIEW TEASER */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 sm:p-7 shadow-xs space-y-5 transition-colors duration-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                      Interactive Campus Map
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-0.5">
                      Visual Map around Tathwade
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                      Explore places around RSCOE Main Gate, Back Gate, Ashok Nagar & Highway underpass.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setActiveView('explore');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-blue-500/20 transition cursor-pointer self-start sm:self-auto"
                  >
                    <Compass className="w-4 h-4" />
                    <span>Open Fullscreen Map View</span>
                  </button>
                </div>

                {/* Map Preview Box */}
                <div className="h-80 sm:h-96 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
                  <MapView
                    places={places}
                    selectedPlace={selectedPlace}
                    onSelectPlace={(p) => setSelectedPlace(p)}
                    onGetDirections={(p) => setDirectionsPlace(p)}
                    className="h-full w-full"
                  />
                </div>
              </div>
            </section>

            {/* POPULAR NEARBY SECTION */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                      Student Verified Picks
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-0.5">
                    Popular Nearby RSCOE
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                    Highest rated mess thalis, print centers, salons and student hangouts
                  </p>
                </div>

                <button
                  onClick={() => {
                    setActiveView('explore');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1 transition cursor-pointer"
                >
                  <span>View All {places.length}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {popularNearbyPlaces.map((place) => (
                  <PlaceCard
                    key={place.id}
                    place={place}
                    onSelect={(p) => setSelectedPlace(p)}
                    onGetDirections={(p) => setDirectionsPlace(p)}
                  />
                ))}
              </div>
            </section>

          </div>
        )}

        {/* VIEW 2: EXPLORE PAGE */}
        {activeView === 'explore' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-fadeIn">
            
            {/* Top Bar with Filter Chips and Controls */}
            <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3 transition-colors duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    Explore Near RSCOE
                  </h1>
                  <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold px-2.5 py-0.5 rounded-full">
                    {filteredPlaces.length} places
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                    className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold cursor-pointer transition"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    <span>Filters</span>
                  </button>

                  <div className="flex items-center gap-1 text-xs font-semibold text-slate-600 dark:text-slate-400">
                    <span className="hidden sm:inline">Sort:</span>
                    <select
                      value={filters.sortBy}
                      onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
                      className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-none rounded-xl px-2.5 py-1.5 text-xs font-bold focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    >
                      <option value="featured" className="dark:bg-slate-900">Recommended</option>
                      <option value="distance" className="dark:bg-slate-900">Distance (Closest)</option>
                      <option value="rating" className="dark:bg-slate-900">Rating (Highest)</option>
                      <option value="price" className="dark:bg-slate-900">Price (Budget First)</option>
                    </select>
                  </div>

                  {(filters.category !== 'all' || filters.priceLevel !== 'all' || filters.searchQuery || filters.verifiedOnly) && (
                    <button
                      onClick={handleResetFilters}
                      className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg transition cursor-pointer"
                      title="Reset all filters"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              <CategoryGrid
                compact
                selectedCategory={filters.category}
                onSelectCategory={(catId) => setFilters(prev => ({ ...prev, category: catId }))}
                placesCountByCategory={placesCountByCategory}
              />
            </div>

            {/* Mobile Filter Drawer */}
            {mobileFilterOpen && (
              <div className="lg:hidden animate-fadeIn">
                <FilterPanel
                  filters={filters}
                  onFilterChange={setFilters}
                  onResetFilters={handleResetFilters}
                  totalResultsCount={filteredPlaces.length}
                />
              </div>
            )}

            {/* Main Split Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Column (Filters & Place Cards) */}
              <div className="lg:col-span-7 xl:col-span-7 space-y-5">
                
                <div className="hidden lg:block">
                  <FilterPanel
                    filters={filters}
                    onFilterChange={setFilters}
                    onResetFilters={handleResetFilters}
                    totalResultsCount={filteredPlaces.length}
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 px-1">
                    <span>MATCHING RESULTS ({filteredPlaces.length})</span>
                    <span>Tathwade, Pune</span>
                  </div>

                  {filteredPlaces.length === 0 ? (
                    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 text-center space-y-4 transition-colors duration-200">
                      <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                        <Compass className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                          No places found matching your filters
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1">
                          Try searching for a different term like "salon", "mess", or reset your budget filters.
                        </p>
                      </div>
                      <button
                        onClick={handleResetFilters}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition cursor-pointer shadow-xs"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Reset All Filters</span>
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {filteredPlaces.map((place) => (
                        <PlaceCard
                          key={place.id}
                          place={place}
                          isSelected={selectedPlace?.id === place.id}
                          onSelect={(p) => setSelectedPlace(p)}
                          onGetDirections={(p) => setDirectionsPlace(p)}
                          onHover={(p) => setHoveredPlace(p)}
                        />
                      ))}
                    </div>
                  )}
                </div>

              </div>

              {/* Right Column: Sticky Map */}
              <div className="lg:col-span-5 xl:col-span-5 sticky top-20">
                <div className="bg-white dark:bg-slate-900 p-3 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3 transition-colors duration-200">
                  <div className="flex items-center justify-between px-2 pt-1 text-xs">
                    <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-rose-500" />
                      <span>Live Campus Map</span>
                    </span>
                    <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-md">
                      Interactive Leaflet
                    </span>
                  </div>

                  <MapView
                    places={filteredPlaces}
                    selectedPlace={selectedPlace}
                    hoveredPlace={hoveredPlace}
                    onSelectPlace={(p) => setSelectedPlace(p)}
                    onGetDirections={(p) => setDirectionsPlace(p)}
                    className="h-[520px] w-full"
                  />
                </div>
              </div>

            </div>

          </div>
        )}

        {/* VIEW 3: CATEGORIES VIEW */}
        {activeView === 'categories' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Comprehensive Campus Directory
              </span>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                All Local Categories
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Browse student verified services surrounding JSPM RSCOE campus by exact service type.
              </p>
            </div>

            <CategoryGrid
              selectedCategory={filters.category}
              onSelectCategory={handleHomeCategorySelect}
              placesCountByCategory={placesCountByCategory}
            />

            <div className="bg-slate-900 dark:bg-slate-950 text-white p-6 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 border border-slate-800">
              <div>
                <h3 className="text-base font-bold">Know a missing student spot?</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Help fellow engineering students find great budget food, tea stalls, and printing shops.
                </p>
              </div>
              <button
                onClick={() => {
                  setPlaceToEdit(null);
                  setIsAddModalOpen(true);
                }}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shrink-0 cursor-pointer shadow-md"
              >
                + Suggest a Place
              </button>
            </div>
          </div>
        )}

        {/* VIEW 4: ADMIN DASHBOARD */}
        {activeView === 'admin' && (
          <AdminDashboard
            places={places}
            onToggleVerified={handleToggleVerified}
            onDeletePlace={handleDeletePlace}
            onEditPlace={handleEditPlace}
            onAddNewPlace={() => {
              setPlaceToEdit(null);
              setIsAddModalOpen(true);
            }}
          />
        )}

        {/* VIEW 5: ABOUT PAGE */}
        {activeView === 'about' && (
          <AboutModal />
        )}

      </main>

      {/* Modals & Overlays */}
      {selectedPlace && (
        <PlaceDetailsModal
          place={selectedPlace}
          onClose={() => setSelectedPlace(null)}
          onGetDirections={(p) => {
            setSelectedPlace(null);
            setDirectionsPlace(p);
          }}
          onSuggestUpdate={(p) => {
            setSelectedPlace(null);
            handleEditPlace(p);
          }}
        />
      )}

      {directionsPlace && (
        <DirectionsModal
          place={directionsPlace}
          onClose={() => setDirectionsPlace(null)}
        />
      )}

      <AddPlaceModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setPlaceToEdit(null);
        }}
        onAddPlace={handleAddOrUpdatePlace}
        initialPlaceToUpdate={placeToEdit}
      />

      <ChatAssistant
        places={places}
        onSelectPlace={(p) => setSelectedPlace(p)}
      />

      <Footer
        setActiveView={setActiveView}
        onOpenAddPlace={() => {
          setPlaceToEdit(null);
          setIsAddModalOpen(true);
        }}
      />

    </div>
  );
}

export default App;
