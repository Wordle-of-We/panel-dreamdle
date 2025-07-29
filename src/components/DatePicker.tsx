'use client';

import React from 'react';

interface DatePickerProps {
  value: string;
  onChange: (newDate: string) => void;
}

export const DatePicker: React.FC<DatePickerProps> = ({ value, onChange }) => {
  return (
    <input
      type="date"
      value={value}
      onChange={e => onChange(e.target.value)}
      className="
        px-3 py-2
        border border-gray-300 rounded
        text-gray-900
        focus:outline-none focus:ring-2 focus:ring-blue-500
      "
    />
  );
};
