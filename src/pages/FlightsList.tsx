import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Filter,
  SortAsc,
  Calendar,
  Users,
  Plane,
  Star,
} from 'lucide-react';
import type {
  FlightSearchResult,
  FlightFilters,
  FlightSortOption,
} from '../types/flightTypes';
import FlightCard from '../components/flight/FlightCard';
import FlightFiltersComponent from '../components/flight/FlightFilters';

const FlightsList: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Get flight data from navigation state
  const flightData = location.state?.flightData as
    | FlightSearchResult
    | undefined;

  // State management
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<FlightSortOption>({
    key: 'best',
    label: 'Best',
    direction: 'asc',
  });
  const [filters, setFilters] = useState<FlightFilters>({
    priceRange: [0, 10000],
    maxStops: 3,
    airlines: [],
    departureTimeRange: [0, 24],
    arrivalTimeRange: [0, 24],
    maxDuration: 1440, // 24 hours
  });

  // Redirect if no flight data
  useEffect(() => {
    if (!flightData) {
      navigate('/', { replace: true });
    }
  }, [flightData, navigate]);

  // Sort options
  const sortOptions: FlightSortOption[] = useMemo(
    () => [
      { key: 'best', label: 'Best', direction: 'asc' },
      { key: 'price', label: 'Price (Low to High)', direction: 'asc' },
      { key: 'duration', label: 'Duration (Shortest)', direction: 'asc' },
      { key: 'departure', label: 'Departure (Earliest)', direction: 'asc' },
      { key: 'arrival', label: 'Arrival (Earliest)', direction: 'asc' },
    ],
    []
  );

  // Process and filter flights
  const { filteredFlights, flightStats } = useMemo(() => {
    if (!flightData?.data?.itineraries) {
      return { filteredFlights: [], flightStats: null };
    }

    const flights = flightData.data.itineraries;

    // Calculate stats for filters
    const prices = flights.map((f) => f.price.raw);
    const durations = flights.map((f) =>
      f.legs.reduce((total, leg) => total + leg.duration, 0)
    );

    const stats = {
      priceRange: [Math.min(...prices), Math.max(...prices)] as [
        number,
        number,
      ],
      durationRange: [Math.min(...durations), Math.max(...durations)] as [
        number,
        number,
      ],
      airlines: Array.from(
        new Set(
          flights.flatMap((f) =>
            f.legs.flatMap((l) => l.carriers.map((c) => c.name))
          )
        )
      ),
      totalFlights: flights.length,
    };

    // Apply filters
    const filtered = flights.filter((flight) => {
      const price = flight.price.raw;
      const totalDuration = flight.legs.reduce(
        (total, leg) => total + leg.duration,
        0
      );
      const maxStops = Math.max(...flight.legs.map((leg) => leg.stops || 0));

      // Price filter
      if (price < filters.priceRange[0] || price > filters.priceRange[1])
        return false;

      // Duration filter
      if (totalDuration > filters.maxDuration) return false;

      // Stops filter
      if (maxStops > filters.maxStops) return false;

      // Airlines filter
      if (filters.airlines.length > 0) {
        const flightAirlines = flight.legs.flatMap((leg) =>
          leg.carriers.map((c) => c.name)
        );
        if (
          !filters.airlines.some((airline) => flightAirlines.includes(airline))
        )
          return false;
      }

      return true;
    });

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy.key) {
        case 'price':
          return sortBy.direction === 'asc'
            ? a.price.raw - b.price.raw
            : b.price.raw - a.price.raw;
        case 'duration':
          { const aDuration = a.legs.reduce(
            (total, leg) => total + leg.duration,
            0
          );
          const bDuration = b.legs.reduce(
            (total, leg) => total + leg.duration,
            0
          );
          return sortBy.direction === 'asc'
            ? aDuration - bDuration
            : bDuration - aDuration; }
        case 'departure':
          { const aDepTime = new Date(a.legs[0].departure).getTime();
          const bDepTime = new Date(b.legs[0].departure).getTime();
          return sortBy.direction === 'asc'
            ? aDepTime - bDepTime
            : bDepTime - aDepTime; }
        case 'arrival':
          { const aArrTime = new Date(
            a.legs[a.legs.length - 1].arrival
          ).getTime();
          const bArrTime = new Date(
            b.legs[b.legs.length - 1].arrival
          ).getTime();
          return sortBy.direction === 'asc'
            ? aArrTime - bArrTime
            : bArrTime - aArrTime; }
        case 'best':
        default:
          // Sort by score if available, otherwise by price
          { const aScore = a.score || 1000 - a.price.raw / 100;
          const bScore = b.score || 1000 - b.price.raw / 100;
          return bScore - aScore; }
      }
    });

    return { filteredFlights: sorted, flightStats: stats };
  }, [flightData, filters, sortBy]);

  const handleSortChange = useCallback((newSort: FlightSortOption) => {
    setSortBy(newSort);
  }, []);

  const handleFilterChange = useCallback((newFilters: FlightFilters) => {
    setFilters(newFilters);
  }, []);

  // Early return if no data
  if (!flightData) {
    return null; // Component will redirect in useEffect
  }

  const searchParams = flightData.data.searchParams;

  return (
    <div className="min-h-screen bg-theme-default">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header Section */}
        <div className="mb-6">
          {/* Back Button */}
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-theme-secondary hover:text-theme-primary mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to search</span>
          </button>

          {/* Search Summary */}
          <div className="bg-theme-secondary rounded-lg p-4 mb-4">
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Plane className="w-4 h-4 text-theme-secondary" />
                <span className="font-medium text-theme-primary">
                  {searchParams?.origin?.displayCode || 'DEL'} →{' '}
                  {searchParams?.destination?.displayCode || 'BOM'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-theme-secondary" />
                <span className="text-theme-secondary">
                  {searchParams?.date
                    ? new Date(searchParams.date).toLocaleDateString()
                    : 'Today'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-theme-secondary" />
                <span className="text-theme-secondary">
                  {searchParams?.passengers || 1} passenger
                  {(searchParams?.passengers || 1) > 1 ? 's' : ''}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-theme-secondary" />
                <span className="text-theme-secondary capitalize">
                  {searchParams?.cabinClass || 'Economy'}
                </span>
              </div>
            </div>
          </div>

          {/* Results Summary & Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-theme-primary">
                {filteredFlights.length} flights found
              </h1>
              {flightStats && (
                <p className="text-theme-secondary text-sm mt-1">
                  Prices from{' '}
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  }).format(flightStats.priceRange[0] / 100)}
                </p>
              )}
            </div>

            <div className="flex items-center gap-3">
              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={`${sortBy.key}-${sortBy.direction}`}
                  onChange={(e) => {
                    const [key, direction] = e.target.value.split('-') as [
                      FlightSortOption['key'],
                      'asc' | 'desc',
                    ];
                    const option = sortOptions.find((opt) => opt.key === key);
                    if (option) {
                      handleSortChange({ ...option, direction });
                    }
                  }}
                  className="appearance-none bg-theme-secondary border border-theme rounded-md px-3 py-2 pr-8 text-sm text-theme-primary focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {sortOptions.map((option) => (
                    <option
                      key={`${option.key}-${option.direction}`}
                      value={`${option.key}-${option.direction}`}
                    >
                      {option.label}
                    </option>
                  ))}
                </select>
                <SortAsc className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-theme-secondary pointer-events-none" />
              </div>

              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-3 py-2 rounded-md border transition-colors ${
                  showFilters
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-theme-secondary border-theme text-theme-primary hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Filter className="w-4 h-4" />
                <span className="text-sm">Filters</span>
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Sidebar Filters */}
          {showFilters && (
            <div className="hidden lg:block w-64 flex-shrink-0">
              <FlightFiltersComponent
                filters={filters}
                flightStats={flightStats}
                onFilterChange={handleFilterChange}
              />
            </div>
          )}

          {/* Mobile Filters Modal */}
          {showFilters && (
            <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
              <div className="bg-theme-default w-full max-h-[80vh] rounded-t-lg overflow-y-auto">
                <div className="sticky top-0 bg-theme-default border-b border-theme p-4 flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-theme-primary">
                    Filters
                  </h3>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="text-theme-secondary hover:text-theme-primary"
                  >
                    ✕
                  </button>
                </div>
                <div className="p-4">
                  <FlightFiltersComponent
                    filters={filters}
                    flightStats={flightStats}
                    onFilterChange={handleFilterChange}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Flight Results */}
          <div className="flex-1 min-w-0">
            {filteredFlights.length === 0 ? (
              <div className="text-center py-12">
                <Plane className="w-16 h-16 text-theme-secondary mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-theme-primary mb-2">
                  No flights found
                </h3>
                <p className="text-theme-secondary mb-4">
                  Try adjusting your filters or search criteria
                </p>
                <button
                  onClick={() =>
                    setFilters({
                      priceRange: [0, 10000],
                      maxStops: 3,
                      airlines: [],
                      departureTimeRange: [0, 24],
                      arrivalTimeRange: [0, 24],
                      maxDuration: 1440,
                    })
                  }
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredFlights.map((flight, index) => (
                  <FlightCard
                    key={flight.id || index}
                    flight={flight}
                    isTopResult={index === 0}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightsList;
