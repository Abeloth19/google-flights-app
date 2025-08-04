import React, { useState, useMemo, useCallback } from 'react';
import { Users, Minus, Plus } from 'lucide-react';

interface PassengerDropdownProps {
  onSelectAdults: (adults: number) => void;
}

interface PassengerCounts {
  adults: number;
  children: number;
  infantsSeat: number;
  infantsLap: number;
}

const PassengerDropdown: React.FC<PassengerDropdownProps> = ({
  onSelectAdults,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [passengers, setPassengers] = useState<PassengerCounts>({
    adults: 1,
    children: 0,
    infantsSeat: 0,
    infantsLap: 0,
  });

  const passengerTypes = useMemo(
    () => [
      {
        label: 'Adults',
        subLabel: '',
        type: 'adults' as keyof PassengerCounts,
        enabled: true,
      },
      {
        label: 'Children',
        subLabel: 'Aged 2–11',
        type: 'children' as keyof PassengerCounts,
        enabled: false,
      },
      {
        label: 'Infants',
        subLabel: 'In seat',
        type: 'infantsSeat' as keyof PassengerCounts,
        enabled: false,
      },
      {
        label: 'Infants',
        subLabel: 'On lap',
        type: 'infantsLap' as keyof PassengerCounts,
        enabled: false,
      },
    ],
    []
  );

  const handleOpen = useCallback(() => {
    setIsOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleChange = useCallback(
    (type: keyof PassengerCounts, operation: 'increase' | 'decrease') => {
      setPassengers((prev) => {
        const newValue =
          operation === 'increase'
            ? prev[type] + 1
            : Math.max(0, prev[type] - 1);

        if (newValue !== prev[type]) {
          const updatedPassengers = { ...prev, [type]: newValue };
          if (type === 'adults') onSelectAdults(updatedPassengers.adults);
          return updatedPassengers;
        }
        return prev;
      });
    },
    [onSelectAdults]
  );

  const handleDone = useCallback(() => {
    onSelectAdults(passengers.adults);
    handleClose();
  }, [onSelectAdults, passengers.adults, handleClose]);

  const totalPassengers =
    passengers.adults +
    passengers.children +
    passengers.infantsSeat +
    passengers.infantsLap;

  return (
    <div className="relative">
      {/* Trigger Button */}
      <button
        onClick={handleOpen}
        className="flex items-center gap-2 px-3 py-2 text-theme-primary hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md theme-transition"
      >
        <Users className="w-4 h-4" />
        <span className="text-sm font-medium">{totalPassengers}</span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-10" onClick={handleClose} />

          {/* Dropdown Content */}
          <div className="absolute top-full left-0 mt-1 bg-theme-secondary border border-theme rounded-md shadow-lg z-20 p-4 min-w-[280px]">
            {/* Passenger Type Options */}
            <div className="space-y-4">
              {passengerTypes.map((item) => (
                <div
                  key={item.type}
                  className="flex items-center justify-between"
                >
                  {/* Label Section */}
                  <div>
                    <div
                      className={`font-medium ${
                        item.enabled
                          ? 'text-theme-primary'
                          : 'text-theme-secondary'
                      }`}
                    >
                      {item.label}
                    </div>
                    {item.subLabel && (
                      <div className="text-sm text-theme-secondary">
                        {item.subLabel}
                      </div>
                    )}
                  </div>

                  {/* Counter Section */}
                  <div className="flex items-center gap-3">
                    {/* Decrease Button */}
                    <button
                      onClick={() => handleChange(item.type, 'decrease')}
                      disabled={!item.enabled || passengers[item.type] === 0}
                      className={`w-8 h-8 rounded-md border flex items-center justify-center ${
                        item.enabled && passengers[item.type] > 0
                          ? 'border-theme hover:bg-gray-100 dark:hover:bg-gray-700 text-theme-primary'
                          : 'border-gray-300 dark:border-gray-600 text-theme-secondary cursor-not-allowed'
                      } theme-transition`}
                    >
                      <Minus className="w-4 h-4" />
                    </button>

                    {/* Count Display */}
                    <span
                      className={`w-4 text-center ${
                        item.enabled
                          ? 'text-theme-primary'
                          : 'text-theme-secondary'
                      }`}
                    >
                      {passengers[item.type]}
                    </span>

                    {/* Increase Button */}
                    <button
                      onClick={() => handleChange(item.type, 'increase')}
                      disabled={!item.enabled}
                      className={`w-8 h-8 rounded-md border flex items-center justify-center ${
                        item.enabled
                          ? 'border-theme hover:bg-gray-100 dark:hover:bg-gray-700 text-theme-primary'
                          : 'border-gray-300 dark:border-gray-600 text-theme-secondary cursor-not-allowed'
                      } theme-transition`}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-theme">
              <button
                onClick={handleClose}
                className="px-4 py-2 text-theme-button hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md theme-transition font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDone}
                className="px-4 py-2 text-theme-button hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md theme-transition font-medium"
              >
                Done
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PassengerDropdown;
