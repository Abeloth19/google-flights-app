import React, { useState, useCallback, useMemo } from 'react';
import { format, parseISO, startOfToday } from 'date-fns';
import { Calendar } from 'lucide-react';

interface DatePickerProps {
  onSelectDate: (date: string) => void;
}

const DatePicker: React.FC<DatePickerProps> = ({ onSelectDate }) => {
  const [selectedDate, setSelectedDate] = useState<string>('');

  // Get today's date in YYYY-MM-DD format for min attribute
  const todayString = useMemo(() => {
    return format(startOfToday(), 'yyyy-MM-dd');
  }, []);

  const handleDateChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.value;
      setSelectedDate(newValue);

      if (newValue) {
        // Format as YYYY-MM-DD for API (same as original dayjs format)
        onSelectDate(newValue);
      }
    },
    [onSelectDate]
  );

  // Format the display text to match original "ddd, MMM DD" format
  const displayText = useMemo(() => {
    if (!selectedDate) return '';
    try {
      return format(parseISO(selectedDate), 'EEE, MMM dd');
    } catch  {
      return selectedDate;
    }
  }, [selectedDate]);

  return (
    <div className="relative">
      {/* Custom styled date input container */}
      <div className="relative border border-theme rounded-md hover:border-google-blue focus-within:border-google-blue theme-transition">
        {/* Calendar Icon */}
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Calendar className="w-5 h-5 text-theme-secondary" />
        </div>

        {/* Date Input */}
        <input
          type="date"
          min={todayString}
          value={selectedDate}
          onChange={handleDateChange}
          className="w-full pl-10 pr-3 py-3 bg-theme-default text-theme-primary rounded-md focus:outline-none appearance-none theme-transition"
          style={{
            // Hide the default date picker icon
            colorScheme: 'dark',
          }}
        />

        {/* Custom Display Overlay (shows formatted date) */}
        {displayText && (
          <div className="absolute inset-0 left-10 right-3 flex items-center pointer-events-none">
            <span className="text-theme-primary bg-theme-default">
              {displayText}
            </span>
          </div>
        )}

        {/* Placeholder when no date selected */}
        {!selectedDate && (
          <div className="absolute inset-0 left-10 right-3 flex items-center pointer-events-none">
            <span className="text-theme-secondary">Departure</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(DatePicker);
