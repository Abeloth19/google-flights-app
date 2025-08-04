// Flight result types for displaying search results

export interface FlightCarrier {
  id: string;
  name: string;
  displayCode?: string;
  logoUrl?: string;
}

export interface FlightLocation {
  id: string;
  name: string;
  displayCode: string;
  city?: string;
  country?: string;
}

export interface FlightLeg {
  id: string;
  origin: FlightLocation;
  destination: FlightLocation;
  departure: string; // ISO date string
  arrival: string; // ISO date string
  duration: number; // minutes
  carriers: FlightCarrier[];
  operatingCarrier?: FlightCarrier;
  flightNumber?: string;
  aircraft?: string;
  stops?: number;
  stopLocations?: FlightLocation[];
}

export interface FlightPrice {
  raw: number;
  formatted: string;
  currency?: string;
}

export interface FlightItinerary {
  id: string;
  price: FlightPrice;
  legs: FlightLeg[];
  score?: number;
  isBestValue?: boolean;
  tags?: string[];
  deeplink?: string;
  bookingOptions?: {
    bookingUrl: string;
    agentName: string;
    price: FlightPrice;
  }[];
}

export interface FlightSearchResult {
  data: {
    itineraries: FlightItinerary[];
    filterStats?: {
      duration: { min: number; max: number };
      price: { min: number; max: number };
      carriers: FlightCarrier[];
      airports: FlightLocation[];
    };
    searchParams?: {
      origin: FlightLocation;
      destination: FlightLocation;
      date: string;
      passengers: number;
      cabinClass: string;
    };
  };
  status: string;
  message?: string;
}

export interface FlightFilters {
  priceRange: [number, number];
  maxStops: number;
  airlines: string[];
  departureTimeRange: [number, number]; // hours in 24h format
  arrivalTimeRange: [number, number];
  maxDuration: number; // minutes
}

export interface FlightSortOption {
  key: 'price' | 'duration' | 'departure' | 'arrival' | 'best';
  label: string;
  direction: 'asc' | 'desc';
}
