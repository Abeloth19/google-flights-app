import React, { useCallback, useMemo } from 'react';
import { ArrowLeftRight, Plane, MapPin } from 'lucide-react';
import type { SkyAirport } from '../../services';

// Updated interface to match SkyAirport structure
export interface AirportData {
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
  [key: string]: unknown;
}

interface SearchInputFieldsProps {
  openAutocomplete: string | null;
  searchAirports: {
    whereFrom: AirportData[];
    whereTo: AirportData[];
  };
  handleWhereChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    where: string
  ) => void;
  onSelectFlight: (airport: SkyAirport, type: string) => void;
  onSelectDate: (date: string) => void;
  onCloseAutocomplete: () => void;
}

// Simple DatePicker component (temporary until we create the full one)
const DatePicker: React.FC<{ onSelectDate: (date: string) => void }> = ({
  onSelectDate,
}) => {
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSelectDate(e.target.value);
  };

  return (
    <div className="relative">
      <input
        type="date"
        onChange={handleDateChange}
        className="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
};

// Airport Input Autocomplete Component
const AirportInputAutocomplete: React.FC<{
  type: string;
  openAutocomplete: string | null;
  searchAirports: AirportData[];
  handleWhereChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    where: string
  ) => void;
  onSelectFlight: (airport: SkyAirport, type: string) => void;
  onCloseAutocomplete: () => void;
}> = ({
  type,
  openAutocomplete,
  searchAirports,
  handleWhereChange,
  onSelectFlight,
  onCloseAutocomplete,
}) => {
  const placeholder = type === 'whereFrom' ? 'Where from?' : 'Where to?';
  const Icon = type === 'whereFrom' ? Plane : MapPin;

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) =>
      handleWhereChange(event, type),
    [handleWhereChange, type]
  );

  const handleSelect = useCallback(
    (airport: AirportData) => {
      // Convert AirportData to SkyAirport format
      const skyAirport: SkyAirport = {
        skyId: airport.skyId || '',
        entityId: airport.entityId || '',
        name: airport.name || airport.presentation?.suggestionTitle || '',
        city: airport.city || '',
        country: airport.country || '',
        iata: airport.iata || '',
        coordinates: airport.coordinates,
      };

      onSelectFlight(skyAirport, type);
      onCloseAutocomplete();
    },
    [onSelectFlight, onCloseAutocomplete, type]
  );

  return (
    <div className="relative flex-1">
      {/* Input Field */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </div>
        <input
          type="text"
          placeholder={placeholder}
          onChange={handleInputChange}
          className="w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        />
      </div>

      {/* Autocomplete Dropdown */}
      {openAutocomplete === type && searchAirports.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg z-20 max-h-60 overflow-y-auto">
          {searchAirports.map((airport, index) => (
            <button
              key={index}
              onClick={() => handleSelect(airport)}
              className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors first:rounded-t-md last:rounded-b-md"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <Plane className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {airport.presentation?.suggestionTitle ||
                      airport.name ||
                      'Unknown Airport'}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {airport.presentation?.subtitle || airport.iata || ''}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const SearchInputFields: React.FC<SearchInputFieldsProps> = ({
  openAutocomplete,
  searchAirports,
  handleWhereChange,
  onSelectFlight,
  onSelectDate,
  onCloseAutocomplete,
}) => {
  const whereFromOptions = useMemo(
    () => searchAirports?.whereFrom || [],
    [searchAirports]
  );
  const whereToOptions = useMemo(
    () => searchAirports?.whereTo || [],
    [searchAirports]
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
      {/* Airport Inputs - Desktop: 7 cols, Mobile: full width */}
      <div className="lg:col-span-7">
        <div className="flex items-center gap-2">
          {/* From Input */}
          <AirportInputAutocomplete
            type="whereFrom"
            openAutocomplete={openAutocomplete}
            searchAirports={whereFromOptions}
            handleWhereChange={handleWhereChange}
            onSelectFlight={onSelectFlight}
            onCloseAutocomplete={onCloseAutocomplete}
          />

          {/* Swap Button - Hidden on mobile like original */}
          <button className="hidden sm:flex p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
            <ArrowLeftRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>

          {/* To Input */}
          <AirportInputAutocomplete
            type="whereTo"
            openAutocomplete={openAutocomplete}
            searchAirports={whereToOptions}
            handleWhereChange={handleWhereChange}
            onSelectFlight={onSelectFlight}
            onCloseAutocomplete={onCloseAutocomplete}
          />
        </div>
      </div>

      {/* Date Picker - Desktop: 5 cols, Mobile: full width */}
      <div className="lg:col-span-5">
        <DatePicker onSelectDate={onSelectDate} />
      </div>
    </div>
  );
};

export default SearchInputFields;
