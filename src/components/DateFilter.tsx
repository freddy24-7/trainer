'use client';

import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { toast } from 'react-toastify';

import CustomButton from '@/components/Button';
import DateField from '@/components/DateField';
import {
  startDateFutureError,
  endDateFutureError,
  startDateAfterEndDateError,
  hideFiltersText,
  applyFilterText,
} from '@/strings/clientStrings';
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
      toast.error(startDateFutureError);
      return;
    }

    if (endDate && new Date(endDate) > today) {
      toast.error(endDateFutureError);
      return;
    }

    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      toast.error(startDateAfterEndDateError);
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
          {showFilters ? hideFiltersText : label}
        </CustomButton>
      </div>

      {showFilters && (
        <div className={containerClass}>
          <DateField name="startDate" label="Start Date" />
          <DateField name="endDate" label="End Date" />
          <CustomButton onPress={applyFilter}>{applyFilterText}</CustomButton>
        </div>
      )}
    </div>
  );
};

export default DateFilter;
