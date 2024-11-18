import { CalendarDate } from '@nextui-org/react';
import React from 'react';

import DateSelector from '@/components/DateSelector';
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { DateProps } from '@/types/shared-types';

const DateField = ({ errors, onChange }: DateProps): React.ReactElement => (
  <FormItem>
    <FormField
      name="date"
      render={({ field }) => (
        <>
          <FormControl>
            <DateSelector
              matchDate={field.value as CalendarDate | null}
              onDateChange={onChange}
            />
          </FormControl>
          <FormMessage>{errors.date?.message}</FormMessage>{' '}
        </>
      )}
    />
  </FormItem>
);

export default DateField;
