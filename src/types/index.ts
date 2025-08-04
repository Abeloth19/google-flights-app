// Flight search related types
export interface Airport {
  id: string;
  name: string;
  city: string;
  country: string;
  iata: string;
  latitude: number;
  longitude: number;
}

// Sky Scrapper API specific types (matching bzceval's API structure)
export interface SkyAirportPresentation {
  suggestionTitle: string;
  subtitle?: string;
}

export interface SkyAirportResult {
  presentation: SkyAirportPresentation;
  name?: string;
  iata?: string;
  skyId?: string;
  entityId?: string;
}

// Component prop types
export interface FlightSearchFormProps {
  className?: string;
}

export interface SearchInputFieldsProps {
  openAutocomplete: string | null;
  searchAirports: {
    whereFrom: SkyAirportResult[];
    whereTo: SkyAirportResult[];
  };
  handleWhereChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    where: string
  ) => void;
  onSelectFlight: (airport: unknown, type: string) => void;
  onSelectDate: (date: string) => void;
  onCloseAutocomplete: () => void;
}

export interface PassengerDropdownProps {
  onSelectAdults: (adults: number) => void;
}

export interface DatePickerProps {
  onSelectDate: (date: string) => void;
}

// Legacy types for compatibility
export interface FlightSearchParams {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  passengers: number;
  tripType: 'oneway' | 'roundtrip';
}

export interface Flight {
  id: string;
  airline: string;
  flightNumber: string;
  origin: Airport;
  destination: Airport;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  currency: string;
  stops: number;
}

export interface FlightSearchResponse {
  flights: Flight[];
  total: number;
  searchId: string;
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

// Map related types
export interface MapPosition {
  latitude: number;
  longitude: number;
  zoom?: number;
}

// Component props types
export interface SearchFormProps {
  onSearch: (params: FlightSearchParams) => void;
  loading?: boolean;
}

export interface FlightListProps {
  flights: Flight[];
  loading?: boolean;
}

export interface MapComponentProps {
  airports: Airport[];
  center?: MapPosition;
  zoom?: number;
}

// Re-export flight result types
export * from './flightTypes';
