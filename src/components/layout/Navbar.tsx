import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { Menu, Sun, Moon, Grid3X3, User } from 'lucide-react';
import googleDark from '../../assets/images/googlelogo_dark.svg'
import googleLight from '../../assets/images/googlelogo_light.svg'

const Navbar: React.FC = () => {
  const { darkMode, toggleTheme } = useTheme();

  return (
    <nav className="bg-theme-default shadow-sm border-b border-theme theme-transition">
      <div className="w-full px-4">
        <div className="flex items-center justify-between h-16">
          {/* Left section - Menu + Logo */}
          <div className="flex items-center space-x-2">
            {/* Menu Button */}
            <button
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 theme-transition"
              aria-label="Menu"
            >
              <Menu className="w-6 h-6 text-theme-secondary" />
            </button>

            {/* Google Logo - Use actual SVG assets */}
            <Link
              to="/"
              className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 theme-transition"
              aria-label="Google Flights Home"
            >
              <img
                src={darkMode ? googleDark : googleLight}
                alt="Google"
                className="h-8 w-auto"
              />
              <span className="ml-1 text-lg font-normal text-theme-secondary">
                Flights
              </span>
            </Link>
          </div>

          {/* Right section - Theme toggle + Apps + Sign in */}
          <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-3">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 theme-transition"
              aria-label="Change appearance"
              title="Change appearance"
            >
              {darkMode ? (
                <Sun className="w-5 h-5 text-theme-secondary hover:text-yellow-400 theme-transition" />
              ) : (
                <Moon className="w-5 h-5 text-theme-secondary hover:text-blue-400 theme-transition" />
              )}
            </button>

            {/* Google Apps Button - Hidden on mobile */}
            <button
              className="hidden sm:flex p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 theme-transition"
              aria-label="Google apps"
              title="Google apps"
            >
              <Grid3X3 className="w-5 h-5 text-theme-secondary hover:text-theme-primary theme-transition" />
            </button>

            {/* Sign In Button */}
            <button className="inline-flex items-center px-4 py-2 bg-google-blue text-white text-sm font-medium rounded-google hover:bg-google-blue-hover theme-transition focus:outline-none focus:ring-2 focus:ring-google-blue focus:ring-opacity-50 shadow-sm">
              <User className="w-4 h-4 mr-2 sm:mr-0 sm:hidden" />
              <span className="font-medium">Sign in</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom border/divider matching bzceval */}
      <div className="h-px bg-gray-200 dark:bg-gray-700"></div>
    </nav>
  );
};

export default Navbar;
