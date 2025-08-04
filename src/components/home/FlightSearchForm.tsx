import React, { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronDown,
  Search,
  RefreshCw,
  ArrowRight,
  MapPin,
  Loader2,
} from 'lucide-react';
import { getSearchAirports, getSearchFlights } from '../../services';
import type { SkyAirport, FlightSearchParams } from '../../services';
import { flightToast } from '../../utils/toast';
import SearchInputFields, { type AirportData } from './SearchInputFields';
import PassengerDropdown from './PassengerDropdown';

// Types for component state
interface SearchState {
  originSky: SkyAirport[];
  destinationSky: SkyAirport[];
  cabinClass: string;
  oneDate: string | null;
  passenger: {
    adults: number;
  };
}

interface SearchAirportsState {
  whereFrom: AirportData[];
  whereTo: AirportData[];
}

interface MenuOption {
  label: string;
  icon: React.ReactNode;
}

const FlightSearchForm: React.FC = () => {
  // Menu options matching bzceval exactly
  const menuOptions = useMemo<MenuOption[]>(
    () => [
      { label: 'One way', icon: <ArrowRight className="w-4 h-4" /> },
      { label: 'Round trip', icon: <RefreshCw className="w-4 h-4" /> },
      { label: 'Multi City', icon: <MapPin className="w-4 h-4" /> },
    ],
    []
  );

  const classOptions = useMemo(
    () => ['Economy', 'Premium Economy', 'Business', 'First'],
    []
  );

  // State management
  const [tripMenuOpen, setTripMenuOpen] = useState(false);
  const [classMenuOpen, setClassMenuOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(menuOptions[0]);
  const [loading, setLoading] = useState(false);
  const [selectedClass, setSelectedClass] = useState('Economy');
  const [searchAirports, setSearchAirports] = useState<SearchAirportsState>({
    whereTo: [],
    whereFrom: [],
  });
  const [selectFlight, setSelectFlight] = useState<SearchState>({
    originSky: [],
    destinationSky: [],
    cabinClass: 'economy',
    oneDate: null,
    passenger: {
      adults: 1,
    },
  });
  const [openAutocomplete, setOpenAutocomplete] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleMenuClose = useCallback(
    (option?: MenuOption | string, type?: string) => {
      if (type === 'trip' && option && typeof option === 'object') {
        setSelectedOption(option as MenuOption);
      } else if (type === 'class' && option && typeof option === 'string') {
        const formattedClass = option.toLowerCase().replace(/\s+/g, '_');
        setSelectedClass(option);
        setSelectFlight((prevState) => ({
          ...prevState,
          cabinClass: formattedClass,
        }));
      }
      setTripMenuOpen(false);
      setClassMenuOpen(false);
    },
    []
  );

  const handleSelectFlight = useCallback((params: SkyAirport, type: string) => {
    setSelectFlight((prevState) => {
      const newState = { ...prevState };
      if (type === 'whereFrom') {
        newState.originSky = [params];
      } else if (type === 'whereTo') {
        newState.destinationSky = [params];
      }
      return newState;
    });
  }, []);

  const handleWhereChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>, where: string) => {
      const value = e.target.value;
      if (typeof value === 'string') {
        const normalizedValue = value
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .toLowerCase();

        if (normalizedValue.length >= 1) {
          setOpenAutocomplete(where);
          try {
            const response = await getSearchAirports(normalizedValue);
            const airports = response?.data?.data || [];
            setSearchAirports((prev) => ({
              ...prev,
              [where]: airports,
            }));
          } catch (error: unknown) {
            const errorMessage =
              error instanceof Error
                ? error.message
                : 'Failed to search airports';
            flightToast.searchError(errorMessage);
          }
        } else {
          setOpenAutocomplete(null);
          setSearchAirports((prev) => ({
            ...prev,
            [where]: [],
          }));
        }
      }
    },
    []
  );

  const handleSelectAdults = useCallback((adults: number) => {
    setSelectFlight((prevState) => ({
      ...prevState,
      passenger: { adults: adults },
    }));
  }, []);

  const handleSelectDate = useCallback((date: string) => {
    setSelectFlight((prevState) => ({
      ...prevState,
      oneDate: date,
    }));
  }, []);

  const isFormValid = useCallback(() => {
    return (
      selectFlight.originSky.length > 0 &&
      selectFlight.destinationSky.length > 0 &&
      selectFlight.originSky[0]?.skyId &&
      selectFlight.destinationSky[0]?.skyId &&
      selectFlight.oneDate !== null &&
      selectFlight.passenger.adults > 0
    );
  }, [selectFlight]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    if (!isFormValid()) {
      flightToast.formIncomplete();
      setLoading(false);
      return;
    }
    try {
      const response = await getSearchFlights(
        selectFlight as FlightSearchParams
      );
      navigate('/flights', { state: { flightData: response.data } });
      setLoading(false);
    } catch (error: unknown) {
      setLoading(false);
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to search flights';
      flightToast.searchError(errorMessage);
    }
  }, [navigate, selectFlight, isFormValid]);

  return (
    <div className="relative">
      {/* Main Search Container */}
      <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg p-4 sm:p-6 shadow-lg">
        {/* Header Row - Trip Type, Passengers, Class */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
          {/* Trip Type Selector */}
          <div className="relative">
            <button
              onClick={() => setTripMenuOpen(!tripMenuOpen)}
              className="flex items-center gap-2 px-3 py-2 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
            >
              <span className="flex items-center gap-1">
                {selectedOption.icon}
                <span className="text-sm font-medium">
                  {selectedOption.label}
                </span>
              </span>
              <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>

            {/* Trip Type Dropdown */}
            {tripMenuOpen && (
              <div className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg z-10 min-w-[150px]">
                {menuOptions.map((option, index) => (
                  <button
                    key={index}
                    onClick={() =>
                      option.label === 'One way' &&
                      handleMenuClose(option, 'trip')
                    }
                    disabled={option.label !== 'One way'}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 first:rounded-t-md last:rounded-b-md ${
                      option.label === 'One way'
                        ? 'text-gray-900 dark:text-white'
                        : 'text-gray-500 dark:text-gray-400 opacity-50 cursor-not-allowed'
                    }`}
                  >
                    {option.icon}
                    <span className="text-sm">{option.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Passenger Selector */}
          <PassengerDropdown onSelectAdults={handleSelectAdults} />

          {/* Class Selector */}
          <div className="relative">
            <button
              onClick={() => setClassMenuOpen(!classMenuOpen)}
              className="flex items-center gap-2 px-3 py-2 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
            >
              <span className="text-sm font-medium">{selectedClass}</span>
              <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>

            {/* Class Dropdown */}
            {classMenuOpen && (
              <div className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg z-10 min-w-[160px]">
                {classOptions.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleMenuClose(option, 'class')}
                    className="w-full px-3 py-2 text-left text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 first:rounded-t-md last:rounded-b-md"
                  >
                    <span className="text-sm">{option}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Search Inputs */}
        <SearchInputFields
          openAutocomplete={openAutocomplete}
          searchAirports={searchAirports}
          handleWhereChange={handleWhereChange}
          onSelectFlight={handleSelectFlight}
          onSelectDate={handleSelectDate}
          onCloseAutocomplete={() => setOpenAutocomplete(null)}
        />
      </div>

      {/* Search Button - Positioned absolutely like original */}
      <div className="flex justify-center">
        <button
          onClick={fetchData}
          disabled={loading}
          className="absolute top-full transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-70"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Search className="w-5 h-5" />
          )}
          <span>Explore</span>
        </button>
      </div>
    </div>
  );
};

export default FlightSearchForm;
