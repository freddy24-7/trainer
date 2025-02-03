'use client';

import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { toast } from 'react-toastify';

import CustomButton from '@/components/Button';
import DateField from '@/components/DateField';
import { DateFilterProps } from '@/types/shared-types';

const DateFilter: React.FC<DateFilterProps> = ({
  onFilter,
  label = 'Change Dates',
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const { getValues } = useFormContext();

  const applyFilter = (): void => {
    const startDate = getValues('startDate');
    const endDate = getValues('endDate');
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (startDate && new Date(startDate) > today) {
      toast.error('❌ Start date cannot be in the future.');
      return;
    }

    if (endDate && new Date(endDate) > today) {
      toast.error('❌ End date cannot be in the future.');
      return;
    }

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
