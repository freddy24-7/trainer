import { CalendarDate } from '@nextui-org/react';
import React from 'react';
import { FieldErrors } from 'react-hook-form';

import DateSelector from '@/components/DateSelector';
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';

interface DateFieldValues {
  date: CalendarDate | null;
}

interface Props {
  errors: FieldErrors<DateFieldValues>;
  onChange: (date: CalendarDate | null) => void;
}

const DateField = ({ errors, onChange }: Props): React.ReactElement => (
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
