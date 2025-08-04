import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Loader2, MapPin, AlertTriangle, Globe } from 'lucide-react';
import { getNearByAirports } from '../../services';
import { flightToast } from '../../utils/toast';
import Chip from '../common/chip';
import { useTheme } from '../../contexts/ThemeContext';

// Fix for default markers in react-leaflet
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const customIcon = new L.Icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

interface NearbyAirport {
  presentation?: {
    suggestionTitle?: string;
    subtitle?: string;
  };
  name?: string;
  iata?: string;
}

interface NearbyAirportsData {
  data: {
    current?: {
      presentation?: {
        subtitle?: string;
      };
    };
    nearby?: NearbyAirport[];
  };
}

const NearByAirports: React.FC = () => {
  const { darkMode } = useTheme();
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [loading, setLoading] = useState(true);
  const [nearAirports, setNearAirports] = useState<NearbyAirportsData | null>(
    null
  );
  const [locationError, setLocationError] = useState(false);

  // Get user's geolocation
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setPosition([pos.coords.latitude, pos.coords.longitude]);
          setLoading(false);
        },
        (error) => {
          console.error('Geolocation error:', error);
          setLocationError(true);
          flightToast.showError(
            'Location access denied. Showing default location.'
          );

          // Fallback to Delhi coordinates
          setPosition([28.6139, 77.209]);
          setLoading(false);
        }
      );
    } else {
      setLocationError(true);
      flightToast.showError('Geolocation is not supported by this browser.');

      // Fallback to Delhi coordinates
      setPosition([28.6139, 77.209]);
      setLoading(false);
    }
  }, []);

  // Fetch nearby airports when position is available
  const fetchNearbyAirports = useCallback(async () => {
    if (!position) return;

    setLoading(true);
    try {
      const response = await getNearByAirports(position);
      setNearAirports(response?.data);
    } catch (error) {
      console.error('Failed to fetch nearby airports:', error);
      flightToast.searchError('Failed to load nearby airports');
    } finally {
      setLoading(false);
    }
  }, [position]);

  useEffect(() => {
    fetchNearbyAirports();
  }, [fetchNearbyAirports]);

  // Map tile layer URL based on theme
  const tileLayerUrl = useMemo(
    () =>
      darkMode
        ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
        : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    [darkMode]
  );

  // Generate airport chips
  const airportChips = useMemo(() => {
    if (!nearAirports?.data?.nearby) return [];

    return nearAirports.data.nearby.slice(0, 4).map((airport, index) => (
      <Chip
        key={index}
        index={index}
        label={
          airport.presentation?.suggestionTitle ||
          airport.name ||
          'Unknown Airport'
        }
        icon={<Globe className="w-4 h-4" />}
        variant="filled"
        onClick={() => {
          // TODO: Handle airport chip click - could trigger search
          console.log('Airport clicked:', airport);
        }}
      />
    ));
  }, [nearAirports]);

  // Show loading state
  if (loading) {
    return (
      <div className="my-8 w-full">
        <div className="flex justify-center items-center min-h-[250px]">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-theme-secondary">Loading nearby airports...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state (but still show map with fallback location)
  if (locationError && !position) {
    return (
      <div className="my-8 w-full">
        <div className="flex justify-center items-center min-h-[250px]">
          <div className="text-center max-w-md">
            <AlertTriangle className="w-12 h-12 text-orange-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-theme-primary mb-2">
              Location Access Required
            </h3>
            <p className="text-theme-secondary mb-4">
              Please enable location access to find nearby airports and get
              personalized flight recommendations.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="my-8 w-full">
      <div className="w-full">
        {/* Section Title */}
        <h2 className="text-xl font-bold text-theme-primary mb-4">
          Find cheap flights from{' '}
          <span className="text-blue-600">
            {nearAirports?.data?.current?.presentation?.subtitle ||
              'your location'}
          </span>{' '}
          to anywhere
        </h2>

        {/* Airport Chips */}
        {airportChips.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-2 justify-start">
            {airportChips}
          </div>
        )}

        {/* Map Container */}
        {position && (
          <div className="w-full h-[250px] rounded-lg overflow-hidden shadow-lg border border-theme">
            <MapContainer
              center={position}
              zoom={6}
              style={{ height: '100%', width: '100%' }}
              zoomControl={true}
              scrollWheelZoom={false}
            >
              <TileLayer
                url={tileLayerUrl}
                attribution={
                  darkMode
                    ? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                }
              />

              {/* User Location Marker */}
              <Marker position={position} icon={customIcon}>
                <Popup>
                  <div className="text-center p-2">
                    <MapPin className="w-5 h-5 text-blue-600 mx-auto mb-2" />
                    <p className="font-medium">Your Location</p>
                    <p className="text-sm text-gray-600">
                      Lat: {position[0].toFixed(4)}
                      <br />
                      Lng: {position[1].toFixed(4)}
                    </p>
                    {locationError && (
                      <p className="text-xs text-orange-600 mt-1">
                        (Approximate location)
                      </p>
                    )}
                  </div>
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        )}

        {/* Additional Info */}
        <div className="mt-4 text-center">
          <p className="text-sm text-theme-secondary">
            {nearAirports?.data?.nearby?.length || 0} nearby airports found
            {locationError && (
              <span className="text-orange-600 ml-2">
                • Using approximate location
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default NearByAirports;
