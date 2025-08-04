import React, { useState, useCallback, useMemo } from 'react';
import { Calendar } from 'lucide-react';

interface SelectDateProps {
  onSelectDate: (date: string) => void;
}

const SelectDate: React.FC<SelectDateProps> = ({ onSelectDate }) => {
  const [departureDate, setDepartureDate] = useState<string>('');

  // Get today's date in YYYY-MM-DD format for min attribute
  const todayString = useMemo(() => {
    return new Date().toISOString().split('T')[0];
  }, []);

  const handleDateChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.value;
      setDepartureDate(newValue);

      if (newValue) {
        // Format as YYYY-MM-DD for API (same as original dayjs format)
        onSelectDate(newValue);
      }
    },
    [onSelectDate]
  );

  // Format the display text to match original "ddd, MMM DD" format
  const displayText = useMemo(() => {
    if (!departureDate) return '';
    try {
      const date = new Date(departureDate);
      const options: Intl.DateTimeFormatOptions = {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      };
      return date.toLocaleDateString('en-US', options);
    } catch (error) {
        console.error(error)
      return departureDate;
    }
  }, [departureDate]);

  return (
    <div className="relative">
      {/* Container with hover border effect matching original */}
      <div
        className={`
          flex border rounded-md transition-all duration-300 ease-in-out
          ${
            departureDate
              ? 'border-blue-500'
              : 'border-gray-600 hover:border-gray-400'
          }
        `}
      >
        {/* Calendar Icon */}
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
          <Calendar className="w-5 h-5 text-gray-400" />
        </div>

        {/* Hidden Date Input for functionality */}
        <input
          type="date"
          min={todayString}
          value={departureDate}
          onChange={handleDateChange}
          className="absolute inset-0 w-full opacity-0 cursor-pointer z-20"
        />

        {/* Visible Display Input */}
        <input
          type="text"
          readOnly
          value={displayText}
          placeholder="Departure"
          className={`
            w-full pl-10 pr-3 py-3 bg-gray-700 bg-opacity-50 text-white placeholder-gray-400 
            rounded-md focus:outline-none cursor-pointer
            ${displayText ? 'text-white' : 'text-gray-400'}
          `}
        />
      </div>
    </div>
  );
};

export default React.memo(SelectDate);
