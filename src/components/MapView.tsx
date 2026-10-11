import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Layers, Globe, Compass } from 'lucide-react';
import type { Place } from '../types';
import { RSCOE_LOCATION } from '../data/placesData';
import { useTheme } from '../context/ThemeContext';

interface MapViewProps {
  places: Place[];
  selectedPlace: Place | null;
  onSelectPlace: (place: Place) => void;
  hoveredPlace?: Place | null;
  onGetDirections?: (place: Place) => void;
  className?: string;
  zoomLevel?: number;
}

export const MapView: React.FC<MapViewProps> = ({
  places,
  selectedPlace,
  onSelectPlace,
  hoveredPlace,
  className = "h-[450px] w-full",
  zoomLevel = 16,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const markerMapRef = useRef<Map<string, L.Marker>>(new Map());
  const { theme } = useTheme();
  const [mapType, setMapType] = useState<'osm' | 'google-roadmap' | 'google-satellite'>('osm');
  const googleMapsKey = (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY || '';

  // Helper to get category SVG icon string
  const getCategoryIconSvg = (category: string) => {
    switch (category) {
      case 'mess':
      case 'food':
        return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m16 2-2.3 2.3a3 3 0 0 0 0 4.2l1.8 1.8a3 3 0 0 0 4.2 0L22 8Z"/><path d="M15 15 3.3 3.3a4.2 4.2 0 0 0 0 6l7.3 7.3c.7.7 2 .7 2.8 0L15 15Zm0 0 7 7"/><path d="m2.1 21.8 6.4-6.3"/><path d="m19 5-7 7"/></svg>`;
      case 'cafes':
        return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 2v2"/><path d="M14 2v2"/><path d="M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h12Z"/><path d="M6 2v2"/><line x1="17" x2="19" y1="11" y2="11"/><path d="M19 11a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-2"/></svg>`;
      case 'repairs':
        return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>`;
      case 'clothing':
        return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/></svg>`;
      case 'fitness':
        return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m6.5 6.5 11 11"/><path d="m21 21-1-1"/><path d="m3 3 1 1"/><path d="m18 22 4-4"/><path d="m2 6 4-4"/><path d="m3 10 7-7"/><path d="m14 21 7-7"/></svg>`;
      case 'transport':
        return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 6v6"/><path d="M15 6v6"/><path d="M2 12h19.6"/><path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.6 19 6 17.7 6H4a2 2 0 0 0-2 2v10h3"/><circle cx="7" cy="18" r="2"/><circle cx="15" cy="18" r="2"/></svg>`;
      case 'banking':
        return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>`;
      case 'college-essentials':
        return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m16.5 9.4-9-5.19M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.29 7 12 12 20.71 7"/><line x1="12" x2="12" y1="22" y2="12"/></svg>`;
      case 'salon':
        return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="6" r="3"/><path d="M8.12 8.12 12 12"/><circle cx="6" cy="18" r="3"/><path d="M14.8 14.8 20 20"/><path d="M8.12 15.88 16 8"/><path d="M14.8 9.2 20 4"/></svg>`;
      case 'pg':
        return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`;
      case 'medical':
        return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><path d="m8.5 8.5 7 7"/></svg>`;
      case 'stationery':
        return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/></svg>`;
      case 'grocery':
        return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-2Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>`;
      case 'printing':
        return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/></svg>`;
      case 'street-food':
        return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>`;
      case 'laundry':
        return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>`;
      default:
        return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>`;
    }
  };

  const getMarkerColor = (category: string) => {
    switch (category) {
      case 'mess': return '#f97316';
      case 'cafes': return '#d97706';
      case 'repairs': return '#7c3aed';
      case 'clothing': return '#db2777';
      case 'fitness': return '#059669';
      case 'transport': return '#f59e0b';
      case 'banking': return '#0d9488';
      case 'college-essentials': return '#0891b2';
      case 'salon': return '#6366f1';
      case 'pg': return '#2563eb';
      case 'printing': return '#0284c7';
      case 'stationery': return '#10b981';
      case 'medical': return '#e11d48';
      case 'grocery': return '#16a34a';
      case 'laundry': return '#0ea5e9';
      default: return '#475569';
    }
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [RSCOE_LOCATION.latitude, RSCOE_LOCATION.longitude],
      zoom: zoomLevel,
      zoomControl: false,
      attributionControl: true,
    });

    L.control.zoom({ position: 'topright' }).addTo(map);

    const markersLayer = L.layerGroup().addTo(map);
    markersLayerRef.current = markersLayer;
    mapInstanceRef.current = map;

    // Landmark marker for JSPM RSCOE Campus Gate
    const collegeIcon = L.divIcon({
      className: 'rscoe-landmark-marker',
      html: `
        <div style="
          display: flex;
          align-items: center;
          gap: 6px;
          background: #1e3a8a;
          color: white;
          padding: 6px 12px;
          border-radius: 9999px;
          font-weight: 800;
          font-size: 11px;
          letter-spacing: -0.2px;
          box-shadow: 0 4px 14px rgba(30, 58, 138, 0.4), 0 0 0 3px rgba(255, 255, 255, 0.95);
          white-space: nowrap;
          transform: translate(-50%, -50%);
        ">
          <div style="
            width: 8px;
            height: 8px;
            background: #60a5fa;
            border-radius: 50%;
            box-shadow: 0 0 8px #60a5fa;
          "></div>
          <span>🎓 JSPM RSCOE Campus</span>
        </div>
      `,
      iconSize: [160, 36],
      iconAnchor: [80, 18],
    });

    const collegeMarker = L.marker([RSCOE_LOCATION.latitude, RSCOE_LOCATION.longitude], {
      icon: collegeIcon,
      zIndexOffset: 1000,
    }).addTo(map);

    collegeMarker.bindPopup(`
      <div style="padding: 14px; font-family: system-ui, sans-serif;">
        <div style="font-size: 11px; font-weight: 700; color: #2563eb; text-transform: uppercase; margin-bottom: 2px;">Campus Centerpoint</div>
        <div style="font-size: 14px; font-weight: 800; color: #0f172a; margin-bottom: 4px;">JSPM Rajarshi Shahu College of Engineering</div>
        <div style="font-size: 12px; color: #64748b; line-height: 1.4;">Ashok Nagar, Tathwade, Pune 411033</div>
        <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #059669; font-weight: 600;">
          All walking distances measured from here
        </div>
      </div>
    `);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Tile Layer when theme or map layer changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    let tileUrl = '';
    let attribution = '';

    if (mapType === 'google-satellite') {
      tileUrl = `https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}${googleMapsKey ? `&key=${googleMapsKey}` : ''}`;
      attribution = '&copy; Google Maps';
    } else if (mapType === 'google-roadmap') {
      tileUrl = `https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}${googleMapsKey ? `&key=${googleMapsKey}` : ''}`;
      attribution = '&copy; Google Maps';
    } else {
      tileUrl = theme === 'dark'
        ? 'https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}{r}.png'
        : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
      attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>';
    }

    const newTileLayer = L.tileLayer(tileUrl, {
      attribution,
      maxZoom: 20,
      subdomains: mapType === 'osm' ? 'abcd' : '',
    }).addTo(map);

    tileLayerRef.current = newTileLayer;
  }, [theme, mapType, googleMapsKey]);

  // Update Markers when places or theme change
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;
    if (!map || !markersLayer) return;

    markersLayer.clearLayers();
    markerMapRef.current.clear();

    const isDark = theme === 'dark';

    places.forEach((place) => {
      const isSelected = selectedPlace?.id === place.id;
      const isHovered = hoveredPlace?.id === place.id;
      const markerColor = getMarkerColor(place.category);
      const iconSvg = getCategoryIconSvg(place.category);

      const markerHtml = `
        <div style="
          width: ${isSelected || isHovered ? '42px' : '36px'};
          height: ${isSelected || isHovered ? '42px' : '36px'};
          background-color: ${isSelected ? (isDark ? '#60a5fa' : '#0f172a') : markerColor};
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(0,0,0,0.35), 0 0 0 ${isSelected ? '3px #3b82f6' : (isDark ? '2px #1e293b' : '2px white')};
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
          transform: translate(-50%, -50%) scale(${isSelected || isHovered ? '1.15' : '1'});
        ">
          ${iconSvg}
        </div>
      `;

      const customIcon = L.divIcon({
        className: `rscoe-place-marker-${place.id}`,
        html: markerHtml,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });

      const marker = L.marker([place.latitude, place.longitude], {
        icon: customIcon,
        zIndexOffset: isSelected ? 900 : 100,
      }).addTo(markersLayer);

      // Popup preview with dark/light adaptive styling
      const popupContent = document.createElement('div');
      popupContent.className = 'p-3 w-64 text-left';
      popupContent.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 8px;">
          <div style="position: relative; height: 90px; width: 100%; border-radius: 8px; overflow: hidden; background: ${isDark ? '#1e293b' : '#f1f5f9'};">
            <img src="${place.photos[0]}" alt="${place.name}" style="width: 100%; height: 100%; object-fit: cover;" />
            <div style="position: absolute; top: 6px; left: 6px; background: ${isDark ? 'rgba(15,23,42,0.92)' : 'rgba(255,255,255,0.92)'}; backdrop-filter: blur(4px); padding: 2px 6px; border-radius: 999px; font-size: 10px; font-weight: 700; color: #10b981; display: flex; align-items: center; gap: 3px;">
              <span>✓</span> Verified
            </div>
          </div>
          <div>
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 4px;">
              <span style="font-size: 10px; font-weight: 700; color: ${isDark ? '#60a5fa' : '#2563eb'}; text-transform: uppercase;">${place.subcategory}</span>
              <span style="font-size: 11px; font-weight: 800; color: #f59e0b; display: flex; align-items: center; gap: 2px;">
                ★ ${place.rating.toFixed(1)}
              </span>
            </div>
            <div style="font-size: 14px; font-weight: 800; color: ${isDark ? '#f8fafc' : '#0f172a'}; margin-top: 2px; line-height: 1.2;">
              ${place.name}
            </div>
            <div style="font-size: 11px; font-weight: 700; color: ${isDark ? '#cbd5e1' : '#334155'}; margin-top: 3px;">
              ${place.priceRange}
            </div>
            <div style="font-size: 10px; color: ${isDark ? '#94a3b8' : '#64748b'}; margin-top: 2px;">
              📍 ${place.distanceFromCollege}
            </div>
          </div>
          <div style="display: flex; gap: 6px; margin-top: 2px;">
            <button id="view-details-btn-${place.id}" style="
              flex: 1;
              background: #2563eb;
              color: white;
              font-size: 11px;
              font-weight: 700;
              padding: 6px 10px;
              border-radius: 6px;
              border: none;
              cursor: pointer;
            ">View Details</button>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent, {
        maxWidth: 280,
        className: 'custom-place-popup',
        offset: [0, -12],
      });

      marker.on('click', () => {
        onSelectPlace(place);
      });

      marker.on('popupopen', () => {
        const btn = document.getElementById(`view-details-btn-${place.id}`);
        if (btn) {
          btn.onclick = (e) => {
            e.stopPropagation();
            onSelectPlace(place);
          };
        }
      });

      markerMapRef.current.set(place.id, marker);
    });
  }, [places, selectedPlace, hoveredPlace, theme]);

  // Programmatic pan
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !selectedPlace) return;

    const marker = markerMapRef.current.get(selectedPlace.id);
    if (marker) {
      map.flyTo([selectedPlace.latitude, selectedPlace.longitude], 17, {
        duration: 0.8,
      });
      marker.openPopup();
    }
  }, [selectedPlace]);

  const handleResetToCollege = () => {
    const map = mapInstanceRef.current;
    if (!map) return;
    map.flyTo([RSCOE_LOCATION.latitude, RSCOE_LOCATION.longitude], zoomLevel, {
      duration: 0.6,
    });
  };

  return (
    <div className={`relative rounded-2xl overflow-hidden border border-slate-200/90 dark:border-slate-800 shadow-sm bg-slate-100 dark:bg-slate-900 ${className}`}>
      {/* Map container DOM */}
      <div ref={mapContainerRef} className="w-full h-full z-10" />

      {/* Floating Map Controls & Overlays */}
      <div className="absolute top-3 left-3 z-20 flex flex-wrap items-center gap-2">
        <button
          onClick={handleResetToCollege}
          className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md hover:bg-white dark:hover:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200/90 dark:border-slate-700 px-3 py-2 rounded-xl text-xs font-bold shadow-md flex items-center gap-2 transition hover:shadow-lg cursor-pointer"
        >
          <div className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse"></div>
          <span>Center on RSCOE Gate</span>
        </button>
      </div>

      {/* Layer Switcher (Top Right) */}
      <div className="absolute top-3 right-12 z-20 flex items-center bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/90 dark:border-slate-700 rounded-xl p-1 shadow-md gap-1">
        <button
          onClick={() => setMapType('osm')}
          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
            mapType === 'osm'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
          title="OpenStreetMap / Carto Vector Tiles"
        >
          Standard
        </button>
        <button
          onClick={() => setMapType('google-roadmap')}
          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
            mapType === 'google-roadmap'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
          title="Google Maps Street View"
        >
          Google Maps
        </button>
        <button
          onClick={() => setMapType('google-satellite')}
          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
            mapType === 'google-satellite'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
          title="Google Satellite Hybrid View"
        >
          Satellite
        </button>
      </div>

      {/* Bottom Map Status Legend */}
      <div className="absolute bottom-3 left-3 right-3 sm:right-auto z-20 pointer-events-none">
        <div className="bg-slate-900/90 dark:bg-slate-950/90 backdrop-blur-md text-white text-[11px] px-3.5 py-2 rounded-xl border border-slate-700/80 dark:border-slate-800 shadow-lg flex items-center justify-between gap-3 pointer-events-auto">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="font-semibold">{places.length} Student Spots Loaded</span>
          </div>
          <div className="flex items-center gap-2">
            {googleMapsKey ? (
              <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded-full font-bold">
                Google Maps Key Active
              </span>
            ) : null}
            <span className="text-slate-400 hidden sm:inline">
              {mapType === 'google-satellite' 
                ? 'Google Satellite' 
                : mapType === 'google-roadmap' 
                ? 'Google Roadmap' 
                : theme === 'dark' ? 'Dark Mode' : 'Voyager'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
