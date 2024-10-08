import React from 'react';

import DateSelector from '@/components/DateSelector';
import {
  FormItem,
  FormField,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { DateFieldProps } from '@/types/types';

const DateField: React.FC<DateFieldProps> = ({ control, errors }) => {
  return (
    <FormItem>
      <FormField
        name="date"
        control={control}
        render={({ field }) => (
          <>
            <FormControl>
              <DateSelector
                matchDate={field.value}
                onDateChange={field.onChange}
              />
            </FormControl>
            <FormMessage>{errors.date?.message}</FormMessage>
          </>
        )}
      />
    </FormItem>
  );
};

export default DateField;
