'use client';

import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { toast } from 'react-toastify';

import DateField from '@/components/DateField';

interface DateFilterProps {
  onFilter: (startDate: Date | null, endDate: Date | null) => void;
  label?: string;
}

const DateFilter: React.FC<DateFilterProps> = ({
  onFilter,
  label = 'Change Dates',
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const { getValues } = useFormContext();

  const applyFilter = () => {
    const startDate = getValues('startDate');
    const endDate = getValues('endDate');

    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      toast.error('❌ Start date cannot be after the end date.');
      return;
    }

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
        <div className="flex flex-col items-center space-y-4 mb-6">
          <DateField name="startDate" label="Start Date" />
          <DateField name="endDate" label="End Date" />
          <button
            className="bg-green-500 text-white px-4 py-2 rounded"
            onClick={applyFilter}
          >
            Apply Filter
          </button>
        </div>
      )}
    </div>
  );
};

export default DateFilter;
