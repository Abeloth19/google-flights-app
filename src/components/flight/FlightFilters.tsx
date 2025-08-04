import React, { useState, useCallback } from 'react';
import { DollarSign, Clock, Plane, MapPin, RotateCcw } from 'lucide-react';
import type { FlightFilters } from '../../types/flightTypes';

interface FlightFiltersProps {
  filters: FlightFilters;
  flightStats: {
    priceRange: [number, number];
    durationRange: [number, number];
    airlines: string[];
    totalFlights: number;
  } | null;
  onFilterChange: (filters: FlightFilters) => void;
}

const FlightFiltersComponent: React.FC<FlightFiltersProps> = ({
  filters,
  flightStats,
  onFilterChange,
}) => {
  const [localFilters, setLocalFilters] = useState<FlightFilters>(filters);

  // Apply filters
  const applyFilters = useCallback(() => {
    onFilterChange(localFilters);
  }, [localFilters, onFilterChange]);

  // Reset filters
  const resetFilters = useCallback(() => {
    const defaultFilters: FlightFilters = {
      priceRange: flightStats ? flightStats.priceRange : [0, 10000],
      maxStops: 3,
      airlines: [],
      departureTimeRange: [0, 24],
      arrivalTimeRange: [0, 24],
      maxDuration: 1440,
    };
    setLocalFilters(defaultFilters);
    onFilterChange(defaultFilters);
  }, [flightStats, onFilterChange]);

  // Update local filter
  const updateFilter = useCallback(
    <K extends keyof FlightFilters>(key: K, value: FlightFilters[K]) => {
      setLocalFilters((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  // Format price
  const formatPrice = useCallback((price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price / 100);
  }, []);

  // Format duration
  const formatDuration = useCallback((minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  }, []);

  // Format time
  const formatTime = useCallback((hour: number) => {
    return `${hour.toString().padStart(2, '0')}:00`;
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-theme-primary">Filters</h3>
        <button
          onClick={resetFilters}
          className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset</span>
        </button>
      </div>

      {/* Price Range */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-theme-secondary" />
          <h4 className="font-medium text-theme-primary">Price</h4>
        </div>

        {flightStats && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-theme-secondary">
              <span>{formatPrice(flightStats.priceRange[0])}</span>
              <span>{formatPrice(flightStats.priceRange[1])}</span>
            </div>

            <div className="space-y-2">
              <input
                type="range"
                min={flightStats.priceRange[0]}
                max={flightStats.priceRange[1]}
                value={localFilters.priceRange[0]}
                onChange={(e) =>
                  updateFilter('priceRange', [
                    +e.target.value,
                    localFilters.priceRange[1],
                  ])
                }
                onMouseUp={applyFilters}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 slider"
              />
              <input
                type="range"
                min={flightStats.priceRange[0]}
                max={flightStats.priceRange[1]}
                value={localFilters.priceRange[1]}
                onChange={(e) =>
                  updateFilter('priceRange', [
                    localFilters.priceRange[0],
                    +e.target.value,
                  ])
                }
                onMouseUp={applyFilters}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 slider"
              />
            </div>

            <div className="flex justify-between text-sm font-medium text-theme-primary">
              <span>{formatPrice(localFilters.priceRange[0])}</span>
              <span>{formatPrice(localFilters.priceRange[1])}</span>
            </div>
          </div>
        )}
      </div>

      {/* Stops */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-theme-secondary" />
          <h4 className="font-medium text-theme-primary">Stops</h4>
        </div>

        <div className="space-y-2">
          {[
            { value: 0, label: 'Direct only' },
            { value: 1, label: 'Up to 1 stop' },
            { value: 2, label: 'Up to 2 stops' },
            { value: 3, label: 'Any number of stops' },
          ].map((option) => (
            <label
              key={option.value}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                type="radio"
                name="stops"
                value={option.value}
                checked={localFilters.maxStops === option.value}
                onChange={() => {
                  updateFilter('maxStops', option.value);
                  applyFilters();
                }}
                className="text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-theme-primary">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Airlines */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Plane className="w-5 h-5 text-theme-secondary" />
          <h4 className="font-medium text-theme-primary">Airlines</h4>
        </div>

        {flightStats && flightStats.airlines.length > 0 && (
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {flightStats.airlines.slice(0, 10).map((airline) => (
              <label
                key={airline}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={localFilters.airlines.includes(airline)}
                  onChange={(e) => {
                    const newAirlines = e.target.checked
                      ? [...localFilters.airlines, airline]
                      : localFilters.airlines.filter((a) => a !== airline);
                    updateFilter('airlines', newAirlines);
                    applyFilters();
                  }}
                  className="text-blue-600 focus:ring-blue-500 rounded"
                />
                <span className="text-sm text-theme-primary">{airline}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Duration */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-theme-secondary" />
          <h4 className="font-medium text-theme-primary">Max Duration</h4>
        </div>

        <div className="space-y-2">
          <input
            type="range"
            min={60}
            max={1440}
            step={30}
            value={localFilters.maxDuration}
            onChange={(e) => updateFilter('maxDuration', +e.target.value)}
            onMouseUp={applyFilters}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
          />
          <div className="flex justify-between text-sm">
            <span className="text-theme-secondary">1h</span>
            <span className="font-medium text-theme-primary">
              {formatDuration(localFilters.maxDuration)}
            </span>
            <span className="text-theme-secondary">24h</span>
          </div>
        </div>
      </div>

      {/* Departure Time */}
      <div className="space-y-3">
        <h4 className="font-medium text-theme-primary">Departure Time</h4>

        <div className="grid grid-cols-4 gap-1">
          {[
            { range: [0, 6], label: 'Early\nmorning', icon: '🌅' },
            { range: [6, 12], label: 'Morning', icon: '🌞' },
            { range: [12, 18], label: 'Afternoon', icon: '☀️' },
            { range: [18, 24], label: 'Evening', icon: '🌙' },
          ].map((timeSlot, index) => {
            const isSelected =
              localFilters.departureTimeRange[0] <= timeSlot.range[0] &&
              localFilters.departureTimeRange[1] >= timeSlot.range[1];

            return (
              <button
                key={index}
                onClick={() => {
                  updateFilter(
                    'departureTimeRange',
                    timeSlot.range as [number, number]
                  );
                  applyFilters();
                }}
                className={`p-2 text-xs text-center rounded border transition-colors ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-theme-secondary border-theme text-theme-primary hover:border-blue-400'
                }`}
              >
                <div className="text-lg mb-1">{timeSlot.icon}</div>
                <div className="whitespace-pre-line leading-tight">
                  {timeSlot.label}
                </div>
                <div className="text-xs opacity-75 mt-1">
                  {formatTime(timeSlot.range[0])}-
                  {formatTime(timeSlot.range[1])}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Count */}
      {flightStats && (
        <div className="pt-4 border-t border-theme">
          <p className="text-sm text-theme-secondary text-center">
            Showing results from {flightStats.totalFlights} total flights
          </p>
        </div>
      )}
    </div>
  );
};

export default FlightFiltersComponent;
