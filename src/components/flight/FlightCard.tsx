import React, { useState, useCallback } from 'react';
import {
  Plane,
  ExternalLink,
  Star,
  Wifi,
  Coffee,
  Monitor,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import type { FlightItinerary } from '../../types/flightTypes';

interface FlightCardProps {
  flight: FlightItinerary;
  isTopResult?: boolean;
}

const FlightCard: React.FC<FlightCardProps> = ({
  flight,
  isTopResult = false,
}) => {
  const [showDetails, setShowDetails] = useState(false);

  // Calculate total duration and stops
  const totalDuration = flight.legs.reduce(
    (total, leg) => total + leg.duration,
    0
  );
  const maxStops = Math.max(...flight.legs.map((leg) => leg.stops || 0));
  const mainLeg = flight.legs[0]; // Primary leg for display

  // Format time
  const formatTime = useCallback((dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  }, []);

  // Format duration
  const formatDuration = useCallback((minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  }, []);

  // Format date
  const formatDate = useCallback((dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  }, []);

  // Get stop text
  const getStopText = useCallback((stops: number) => {
    if (stops === 0) return 'Direct';
    if (stops === 1) return '1 stop';
    return `${stops} stops`;
  }, []);

  // Handle booking
  const handleBook = useCallback(() => {
    if (flight.deeplink) {
      window.open(flight.deeplink, '_blank');
    } else {
      // Fallback to a booking search URL
      const bookingUrl = `https://www.google.com/flights#search;f=${mainLeg.origin.displayCode};t=${mainLeg.destination.displayCode}`;
      window.open(bookingUrl, '_blank');
    }
  }, [flight.deeplink, mainLeg]);

  return (
    <div
      className={`bg-theme-secondary rounded-lg border ${
        isTopResult
          ? 'border-blue-500 shadow-lg ring-2 ring-blue-500 ring-opacity-20'
          : 'border-theme hover:border-blue-400'
      } transition-all duration-200 hover:shadow-md`}
    >
      {/* Top Result Badge */}
      {isTopResult && (
        <div className="bg-blue-600 text-white text-xs px-3 py-1 rounded-t-lg font-medium flex items-center gap-1">
          <Star className="w-3 h-3" />
          <span>Best Value</span>
        </div>
      )}

      {/* Main Flight Info */}
      <div className="p-4">
        <div className="flex items-center justify-between">
          {/* Left Side - Flight Details */}
          <div className="flex-1 min-w-0">
            {/* Airline Info */}
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <Plane className="w-4 h-4 text-theme-secondary" />
              </div>
              <div>
                <p className="font-medium text-theme-primary">
                  {mainLeg.carriers[0]?.name || 'Unknown Airline'}
                </p>
                {mainLeg.flightNumber && (
                  <p className="text-sm text-theme-secondary">
                    Flight {mainLeg.flightNumber}
                  </p>
                )}
              </div>
              {flight.tags && flight.tags.length > 0 && (
                <div className="flex gap-1">
                  {flight.tags.slice(0, 2).map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Route Info */}
            <div className="flex items-center gap-4">
              {/* Departure */}
              <div className="text-center">
                <p className="text-xl font-bold text-theme-primary">
                  {formatTime(mainLeg.departure)}
                </p>
                <p className="text-sm text-theme-secondary">
                  {mainLeg.origin.displayCode}
                </p>
                <p className="text-xs text-theme-secondary">
                  {formatDate(mainLeg.departure)}
                </p>
              </div>

              {/* Flight Path */}
              <div className="flex-1 px-4">
                <div className="flex items-center justify-center">
                  <div className="flex-1 border-t border-theme-secondary border-dashed"></div>
                  <div className="px-3 text-center">
                    <p className="text-sm font-medium text-theme-secondary">
                      {formatDuration(totalDuration)}
                    </p>
                    <p className="text-xs text-theme-secondary">
                      {getStopText(maxStops)}
                    </p>
                  </div>
                  <div className="flex-1 border-t border-theme-secondary border-dashed"></div>
                </div>
              </div>

              {/* Arrival */}
              <div className="text-center">
                <p className="text-xl font-bold text-theme-primary">
                  {formatTime(mainLeg.arrival)}
                </p>
                <p className="text-sm text-theme-secondary">
                  {mainLeg.destination.displayCode}
                </p>
                <p className="text-xs text-theme-secondary">
                  {formatDate(mainLeg.arrival)}
                </p>
              </div>
            </div>
          </div>

          {/* Right Side - Price & Action */}
          <div className="ml-6 text-right">
            <div className="mb-3">
              <p className="text-2xl font-bold text-theme-primary">
                {flight.price.formatted}
              </p>
              <p className="text-sm text-theme-secondary">per person</p>
            </div>

            <div className="space-y-2">
              <button
                onClick={handleBook}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors flex items-center justify-center gap-2"
              >
                <span>Book</span>
                <ExternalLink className="w-4 h-4" />
              </button>

              <button
                onClick={() => setShowDetails(!showDetails)}
                className="w-full text-blue-600 hover:text-blue-700 px-4 py-2 text-sm font-medium transition-colors flex items-center justify-center gap-1"
              >
                <span>Flight details</span>
                {showDetails ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Expandable Details */}
      {showDetails && (
        <div className="border-t border-theme p-4 bg-gray-50 dark:bg-gray-800">
          {/* Flight Legs Details */}
          <div className="space-y-4">
            {flight.legs.map((leg, index) => (
              <div key={index} className="border border-theme rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-theme-primary">
                    {leg.origin.displayCode} → {leg.destination.displayCode}
                  </h4>
                  <span className="text-sm text-theme-secondary">
                    {formatDuration(leg.duration)}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-theme-secondary">Departure</p>
                    <p className="font-medium text-theme-primary">
                      {formatTime(leg.departure)} - {leg.origin.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-theme-secondary">Arrival</p>
                    <p className="font-medium text-theme-primary">
                      {formatTime(leg.arrival)} - {leg.destination.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-theme-secondary">Airline</p>
                    <p className="font-medium text-theme-primary">
                      {leg.carriers[0]?.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-theme-secondary">Aircraft</p>
                    <p className="font-medium text-theme-primary">
                      {leg.aircraft || 'Not specified'}
                    </p>
                  </div>
                </div>

                {/* Stops Information */}
                {leg.stops && leg.stops > 0 && leg.stopLocations && (
                  <div className="mt-3 pt-3 border-t border-theme">
                    <p className="text-sm text-theme-secondary mb-2">
                      Stops ({leg.stops})
                    </p>
                    <div className="flex gap-2">
                      {leg.stopLocations.map((stop, stopIndex) => (
                        <span
                          key={stopIndex}
                          className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-xs rounded"
                        >
                          {stop.displayCode}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Amenities */}
          <div className="mt-4 pt-4 border-t border-theme">
            <p className="text-sm font-medium text-theme-primary mb-2">
              Amenities
            </p>
            <div className="flex gap-4 text-sm text-theme-secondary">
              <div className="flex items-center gap-1">
                <Wifi className="w-4 h-4" />
                <span>WiFi available</span>
              </div>
              <div className="flex items-center gap-1">
                <Monitor className="w-4 h-4" />
                <span>In-seat entertainment</span>
              </div>
              <div className="flex items-center gap-1">
                <Coffee className="w-4 h-4" />
                <span>Meal service</span>
              </div>
            </div>
          </div>

          {/* Booking Options */}
          {flight.bookingOptions && flight.bookingOptions.length > 0 && (
            <div className="mt-4 pt-4 border-t border-theme">
              <p className="text-sm font-medium text-theme-primary mb-2">
                Booking Options
              </p>
              <div className="space-y-2">
                {flight.bookingOptions.slice(0, 3).map((option, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-700 rounded"
                  >
                    <span className="text-sm text-theme-primary">
                      {option.agentName}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-theme-primary">
                        {option.price.formatted}
                      </span>
                      <button
                        onClick={() => window.open(option.bookingUrl, '_blank')}
                        className="text-blue-600 hover:text-blue-700 text-xs"
                      >
                        Book
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FlightCard;
