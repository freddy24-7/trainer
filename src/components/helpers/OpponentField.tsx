import React from 'react';

import OpponentSelector from '@/components/helpers/OpponentSelector';
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Poule, PouleOpponent } from '@/types/poule-types';

interface FieldError {
  message?: string;
}

interface Props {
  selectedPoule: Poule | null;
  selectedOpponent: PouleOpponent | null;
  errors: { opponent?: FieldError };
  onChange: (opponentId: number) => void;
}

const OpponentField = ({
  selectedPoule,
  selectedOpponent,
  errors,
  onChange,
}: Props): React.ReactElement | null =>
  selectedPoule && selectedPoule.opponents.length > 0 ? (
    <FormItem>
      <FormField
        name="opponent"
        render={() => (
          <>
            <FormControl>
              <OpponentSelector
                opponents={selectedPoule.opponents}
                selectedOpponent={selectedOpponent}
                onOpponentChange={onChange}
              />
            </FormControl>
            <FormMessage>{errors.opponent?.message}</FormMessage>{' '}
          </>
        )}
      />
    </FormItem>
  ) : null;

export default OpponentField;
