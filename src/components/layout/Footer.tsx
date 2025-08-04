import React from 'react';
import { Globe, MapPin, CreditCard } from 'lucide-react';

// Inline Chip component (since we haven't created the common Chip yet)
interface ChipProps {
  label: string;
  icon: React.ReactNode;
}

const FooterChip: React.FC<ChipProps> = ({ label, icon }) => {
  return (
    <div className="inline-flex items-center px-3 py-2 rounded-full border border-theme bg-theme-default hover:bg-gray-50 dark:hover:bg-gray-800 theme-transition">
      <span className="w-4 h-4 mr-2 text-theme-secondary">{icon}</span>
      <span className="text-sm text-theme-primary font-medium">{label}</span>
    </div>
  );
};

const Footer: React.FC = () => {
  const footerData = [
    {
      label: 'Language: English (United Kingdom)',
      icon: <Globe className="w-4 h-4" />,
    },
    { label: 'Location: United Kingdom', icon: <MapPin className="w-4 h-4" /> },
    { label: 'Currency: GBP', icon: <CreditCard className="w-4 h-4" /> },
  ];

  const mainLinks = [
    'About',
    'Privacy',
    'Terms',
    'Join user studies',
    'Feedback',
    'Help Centre',
  ];

  const bottomLinks = ['International sites', 'Explore flights'];

  return (
    <footer className="bg-theme-default border-t border-theme theme-transition">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-12 space-y-8">
          {/* Settings Chips Row */}
          <div className="flex flex-wrap justify-center gap-4">
            {footerData.map((item, index) => (
              <FooterChip key={index} label={item.label} icon={item.icon} />
            ))}
          </div>

          {/* Disclaimer Text */}
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-sm text-theme-secondary leading-relaxed">
              Current language and currency options applied: English (United
              States) - United States - USD. Displayed currencies may differ
              from the currencies used to purchase flights.{' '}
              <a
                href="#"
                className="text-google-blue hover:text-google-blue-hover underline transition-colors"
              >
                Learn more
              </a>
            </p>
          </div>

          {/* Legal Text */}
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-sm text-theme-secondary leading-relaxed">
              Prices are final and include all taxes and fees, including payment
              fees for the cheapest common payment method (which may differ
              depending on the provider). Additional charges may apply for other
              types of payment, luggage, meals, WLAN or other additional
              services. Prices, availability and travel details are provided
              based on the latest information received from our partners. This
              information is reflected in the results within a period of less
              than 24 hours.
              <br />
              <br />
              Additional conditions may also be applied by our partners. You
              should then check prices and conditions with the services
              providers before booking.
            </p>
          </div>

          {/* Main Links */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 flex-wrap">
            {mainLinks.map((text, idx) => (
              <a
                key={idx}
                href="#"
                className="text-google-blue hover:text-google-blue-hover hover:underline transition-colors text-sm font-medium"
              >
                {text}
              </a>
            ))}
          </div>

          {/* Divider */}
          <div className="border-t border-theme"></div>

          {/* Bottom Links */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            {bottomLinks.map((text, idx) => (
              <a
                key={idx}
                href="#"
                className="text-google-blue hover:text-google-blue-hover hover:underline transition-colors text-sm font-medium"
              >
                {text}
              </a>
            ))}
          </div>

          {/* Copyright or final spacing */}
          <div className="text-center">
            <p className="text-xs text-theme-secondary">
              © 2024 Google Flights Clone. Built with React & TypeScript.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
