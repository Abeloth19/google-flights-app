import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import FlightSearchForm from '../components/home/FlightSearchForm';
import NearByAirports from '../components/home/NearByAirports';
import flightsDark from '../assets/images/flights_dark.svg';
import flightsLight from '../assets/images/flights_light.svg';

const Home: React.FC = () => {
  const { darkMode } = useTheme();

  return (
    <div className="min-h-screen bg-theme-default theme-transition">
      {/* Hero Section with Google Flights styling */}
      <div className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12">
          {/* Google Flights Hero Image & Text */}
          <div className="text-center relative mb-16">
            <div className="relative mb-8">
              {/* Use actual Google Flights illustration */}
              <img
                src={darkMode ? flightsDark : flightsLight}
                alt="Google Flights"
                className="w-full max-w-4xl mx-auto h-auto"
                style={{ maxHeight: '400px' }}
              />

              {/* "Flights" Text Overlay - positioned like original */}
              <div className="absolute inset-0 flex items-center justify-center">
                <h1
                  className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-theme-primary"
                  style={{
                    marginTop: '20%', // Adjust based on where text should appear on the SVG
                    lineHeight: '1.2',
                  }}
                >
                  Flights
                </h1>
              </div>
            </div>
          </div>

          {/* Search Form Container */}
          <div className="max-w-4xl mx-auto mb-16">
            <FlightSearchForm />
          </div>

          {/* "Find cheap flights from India to anywhere" Section */}
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-xl sm:text-2xl font-normal text-theme-primary mb-6">
                Find cheap flights from India to anywhere
              </h2>

              {/* Airport Chips */}
              <div className="flex flex-wrap justify-center gap-3 mb-12">
                {[
                  { code: 'DEL', name: 'Indira Gandhi International' },
                  { code: 'HYD', name: 'Hyderabad' },
                  { code: 'BLR', name: 'Bengaluru' },
                  { code: 'PNQ', name: 'Pune' },
                  { code: 'BOM', name: 'Mumbai' },
                  { code: 'CCU', name: 'Kolkata' },
                ].map((airport) => (
                  <button
                    key={airport.code}
                    className="inline-flex items-center px-4 py-2 bg-theme-secondary border border-theme rounded-full text-theme-primary hover:bg-gray-100 dark:hover:bg-gray-700 theme-transition text-sm font-medium"
                  >
                    {airport.name} ({airport.code})
                  </button>
                ))}
              </div>
            </div>

            {/* ADD: NearBy Airports Component */}
            <div className="max-w-4xl mx-auto mb-16">
             
              <NearByAirports />
            </div>
          </div>

          {/* Additional Features Section (Optional) */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-google-blue"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-theme-primary mb-2">
                Find cheap flights
              </h3>
              <p className="text-theme-secondary text-sm">
                Search and compare billions of flight deals for free
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-theme-primary mb-2">
                No hidden fees
              </h3>
              <p className="text-theme-secondary text-sm">
                The price you see is the price you pay
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-theme-primary mb-2">
                Filter your deals
              </h3>
              <p className="text-theme-secondary text-sm">
                Choose your cabin class, times, and more
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
