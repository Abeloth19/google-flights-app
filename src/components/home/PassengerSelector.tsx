import React, { useState, useMemo, useCallback } from 'react';
import { Users, Minus, Plus } from 'lucide-react';

interface PassengerSelectorProps {
  onSelectAdults: (adults: number) => void;
}

interface PassengerCounts {
  adults: number;
  children: number;
  infantsSeat: number;
  infantsLap: number;
}

interface PassengerType {
  label: string;
  subLabel: string;
  type: keyof PassengerCounts;
  enabled: boolean;
}

const PassengerSelector: React.FC<PassengerSelectorProps> = ({
  onSelectAdults,
}) => {
  const [anchorEl, setAnchorEl] = useState<boolean>(false);
  const [passengers, setPassengers] = useState<PassengerCounts>({
    adults: 1,
    children: 0,
    infantsSeat: 0,
    infantsLap: 0,
  });

  const passengerTypes = useMemo<PassengerType[]>(
    () => [
      { label: 'Adults', subLabel: '', type: 'adults', enabled: true },
      {
        label: 'Children',
        subLabel: 'Aged 2–11',
        type: 'children',
        enabled: false,
      },
      {
        label: 'Infants',
        subLabel: 'In seat',
        type: 'infantsSeat',
        enabled: false,
      },
      {
        label: 'Infants',
        subLabel: 'On lap',
        type: 'infantsLap',
        enabled: false,
      },
    ],
    []
  );

  const handleOpen = useCallback(() => {
    setAnchorEl(true);
  }, []);

  const handleClose = useCallback(() => {
    setAnchorEl(false);
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
        className="flex items-center gap-2 text-white hover:bg-gray-700 hover:bg-opacity-50 px-3 py-2 rounded-md transition-colors"
      >
        <Users className="w-4 h-4" />
        <span className="text-sm font-medium">{totalPassengers}</span>
      </button>

      {/* Dropdown Menu */}
      {anchorEl && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-10" onClick={handleClose} />

          {/* Menu Container - Dark theme matching original */}
          <div className="absolute top-full left-0 mt-1 bg-gray-900 border border-gray-600 rounded-md shadow-lg z-20 p-3 min-w-[275px]">
            {/* Passenger Type Options */}
            <div className="space-y-0">
              {passengerTypes.map((item) => (
                <div
                  key={item.type}
                  className="flex items-center justify-between py-2 px-0"
                >
                  {/* Label Section */}
                  <div>
                    <div
                      className={`font-normal ${
                        item.enabled ? 'text-white' : 'text-gray-400'
                      }`}
                    >
                      {item.label}
                    </div>
                    {item.subLabel && (
                      <div className="text-sm text-gray-400">
                        {item.subLabel}
                      </div>
                    )}
                  </div>

                  {/* Counter Section */}
                  <div className="flex items-center gap-4">
                    {/* Decrease Button */}
                    <button
                      onClick={() => handleChange(item.type, 'decrease')}
                      disabled={!item.enabled || passengers[item.type] === 0}
                      className={`
                        w-6 h-6 rounded flex items-center justify-center border-0
                        ${
                          item.enabled && passengers[item.type] > 0
                            ? 'text-white hover:bg-gray-700 cursor-pointer'
                            : 'text-gray-500 cursor-not-allowed'
                        }
                        transition-colors
                      `}
                    >
                      <Minus className="w-4 h-4" />
                    </button>

                    {/* Count Display */}
                    <span
                      className={`w-4 text-center ${
                        item.enabled ? 'text-white' : 'text-gray-400'
                      }`}
                    >
                      {passengers[item.type]}
                    </span>

                    {/* Increase Button */}
                    <button
                      onClick={() => handleChange(item.type, 'increase')}
                      disabled={!item.enabled}
                      className={`
                        w-6 h-6 rounded flex items-center justify-center border-0
                        ${
                          item.enabled
                            ? 'text-white hover:bg-gray-700 cursor-pointer'
                            : 'text-gray-500 cursor-not-allowed'
                        }
                        transition-colors
                      `}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-2 mt-2 pt-2">
              <button
                onClick={handleClose}
                className="px-3 py-1 text-blue-400 hover:bg-gray-800 rounded text-sm font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDone}
                className="px-3 py-1 text-blue-400 hover:bg-gray-800 rounded text-sm font-medium transition-colors"
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

export default PassengerSelector;
