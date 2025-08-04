import axios from 'axios';

// Types for Sky Scrapper API (matching bzceval's exact structure)
export interface SkyAirport {
  skyId?: string;
  entityId?: string;
  name?: string;
  city?: string;
  country?: string;
  iata?: string;
  presentation?: {
    suggestionTitle?: string;
    subtitle?: string;
  };
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface FlightSearchParams {
  originSky: SkyAirport[];
  destinationSky: SkyAirport[];
  cabinClass: string;
  passenger: {
    adults: number;
  };
  oneDate: string; // YYYY-MM-DD format
}

// Default configuration (exact copy of bzceval's setup)
const defaultLocale = 'en-US';
const defaultCurrency = 'USD';
const defaultCountryCode = 'US';

// API instance (exact copy of bzceval's configuration)
export const Api = axios.create({
  method: 'GET',
  baseURL: 'https://sky-scrapper.p.rapidapi.com/',
  headers: {
    'x-rapidapi-key': import.meta.env.VITE_RAPIDAPI_KEY, // Updated for Vite
    'x-rapidapi-host': 'sky-scrapper.p.rapidapi.com',
  },
});

// Flight service functions (exact copies of bzceval's functions with TypeScript)
export const getNearByAirports = async (position: [number, number]) => {
  return await Api.get(
    `api/v1/flights/getNearByAirports?lat=${position[0]}&lng=${position[1]}&locale=${defaultLocale}`
  );
};

export const getSearchAirports = async (query: string) => {
  return await Api.get(
    `api/v1/flights/searchAirport?query=${query}&locale=${defaultLocale}`
  );
};

export const getSearchFlights = async (params: FlightSearchParams) => {
  console.log(params);
  return await Api.get(
    `api/v2/flights/searchFlights?originSkyId=${params.originSky[0].skyId}&destinationSkyId=${params.destinationSky[0].skyId}&originEntityId=${params.originSky[0].entityId}&destinationEntityId=${params.destinationSky[0].entityId}&cabinClass=${params.cabinClass}&adults=${params.passenger.adults}&sortBy=best&currency=${defaultCurrency}&market=${defaultLocale}&countryCode=${defaultCountryCode}&date=${params.oneDate}`
  );
};
