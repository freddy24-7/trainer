import React from 'react';

import OpponentSelector from '@/components/matches/OpponentSelector';
import {
  FormItem,
  FormField,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { OpponentFieldProps } from '@/types/types';

const OpponentField: React.FC<OpponentFieldProps> = ({
  control,
  opponents,
  selectedOpponent,
  errors,
}) => {
  return (
    <FormItem>
      <FormField
        name="opponent"
        control={control}
        render={({ field }) => (
          <>
            <FormControl>
              <OpponentSelector
                opponents={opponents}
                selectedOpponent={selectedOpponent}
                onOpponentChange={(opponentId) => field.onChange(opponentId)}
              />
            </FormControl>
            <FormMessage>{errors.opponent?.message}</FormMessage>
          </>
        )}
      />
    </FormItem>
  );
};

export default OpponentField;
