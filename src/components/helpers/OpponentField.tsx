import React from 'react';
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import OpponentSelector from '@/components/OpponentSelector';
import { Poule, PouleOpponent } from '@/types/type-list';

type Props = {
  selectedPoule: Poule | null;
  selectedOpponent: PouleOpponent | null;
  errors: any;
  onChange: (opponentId: number) => void;
};

const OpponentField = ({
  selectedPoule,
  selectedOpponent,
  errors,
  onChange,
}: Props) =>
  selectedPoule &&
  selectedPoule.opponents.length > 0 && (
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
            <FormMessage>{errors.opponent?.message}</FormMessage>
          </>
        )}
      />
    </FormItem>
  );

export default OpponentField;
