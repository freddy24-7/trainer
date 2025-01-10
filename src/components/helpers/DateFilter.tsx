'use client';

import React, { useState } from 'react';

import DateField from '@/components/helpers/DateField';

interface DateFilterProps {
  onFilter: (startDate: Date | null, endDate: Date | null) => void;
  label?: string;
}

const DateFilter: React.FC<DateFilterProps> = ({
  onFilter,
  label = 'Change Dates',
}) => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const handleFilter = (): void => {
    onFilter(startDate, endDate);
    setShowFilters(false);
  };

  return (
    <div>
      <div className="text-right mb-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => setShowFilters(!showFilters)}
        >
          {showFilters ? 'Hide Filters' : label}
        </button>
      </div>

      {showFilters && (
        <div className="flex justify-center space-x-4 mb-6">
          <DateField
            onChange={(date) =>
              setStartDate(date ? new Date(date.toString()) : null)
            }
            errors={{}}
            label="Start Date"
          />
          <DateField
            onChange={(date) =>
              setEndDate(date ? new Date(date.toString()) : null)
            }
            errors={{}}
            label="End Date"
          />
          <button
            className="bg-green-500 text-white px-4 py-2 rounded"
            onClick={handleFilter}
          >
            Apply Filter
          </button>
        </div>
      )}
    </div>
  );
};

export default DateFilter;
