'use client';

import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { toast } from 'react-toastify';

import CustomButton from '@/components/Button';
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

  const containerClass = 'flex flex-col items-center space-y-4 mb-6';

  return (
    <div>
      <div className={containerClass}>
        <CustomButton onPress={() => setShowFilters(!showFilters)}>
          {showFilters ? 'Hide Filters' : label}
        </CustomButton>
      </div>

      {showFilters && (
        <div className={containerClass}>
          <DateField name="startDate" label="Start Date" />
          <DateField name="endDate" label="End Date" />
          <CustomButton onPress={applyFilter}>Apply Filter</CustomButton>
        </div>
      )}
    </div>
  );
};

export default DateFilter;
