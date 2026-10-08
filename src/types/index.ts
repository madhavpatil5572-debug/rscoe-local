export type CategoryId =
  | 'all'
  | 'food'
  | 'mess'
  | 'salon'
  | 'pg'
  | 'medical'
  | 'stationery'
  | 'grocery'
  | 'street-food'
  | 'laundry'
  | 'printing'
  | 'shops';

export type PriceLevel = 'budget' | 'moderate' | 'premium';

export interface ServiceItem {
  name: string;
  price: number;
  unit?: string; // e.g. "per month", "per page", "per cut", "per thali"
  popular?: boolean;
}

export interface Review {
  id: string;
  author: string;
  role: string; // e.g. "BE Comp '25", "FE Mechanical '27"
  rating: number;
  date: string;
  comment: string;
  helpfulCount?: number;
}

export interface Place {
  id: string;
  name: string;
  category: CategoryId;
  subcategory: string;
  latitude: number;
  longitude: number;
  address: string;
  phone: string;
  rating: number;
  reviewCount: number;
  priceLevel: PriceLevel;
  priceRange: string;
  openingHours: string;
  isOpenNow: boolean;
  description: string;
  services: ServiceItem[];
  photos: string[];
  verified: boolean;
  lastVerified: string;
  distanceFromCollege: string; // e.g. "180m from RSCOE Main Gate"
  distanceKm: number;
  featured?: boolean;
  studentPerks?: string;
  reviews: Review[];
  isDemo: boolean;
}

export interface CategoryMeta {
  id: CategoryId;
  label: string;
  iconName: string;
  description: string;
  count?: number;
  color: string;
}

export interface FilterState {
  searchQuery: string;
  category: CategoryId;
  priceLevel: 'all' | PriceLevel;
  maxDistanceKm: number;
  minRating: number;
  openNowOnly: boolean;
  verifiedOnly: boolean;
  quickAffordabilityFilter?: string; // e.g. 'food_under_50', 'mess_under_3000', 'salon_under_150'
  sortBy: 'distance' | 'rating' | 'price' | 'featured';
}

export type ActiveView = 'home' | 'explore' | 'categories' | 'admin' | 'about';
