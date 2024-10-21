import React from 'react';

import PouleSelector from '@/components/helpers/PouleSelector';
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Poule } from '@/types/poule-types';

interface FieldError {
  message?: string;
}

interface Props {
  poules: Poule[];
  selectedPoule: Poule | null;
  errors: { poule?: FieldError };
  onChange: (pouleId: number) => void;
}

const PouleField = ({
  poules,
  selectedPoule,
  errors,
  onChange,
}: Props): React.ReactElement => (
  <FormItem>
    <FormField
      name="poule"
      render={() => (
        <>
          <FormControl>
            <PouleSelector
              poules={poules}
              selectedPoule={selectedPoule}
              onPouleChange={onChange}
            />
          </FormControl>
          <FormMessage>{errors.poule?.message}</FormMessage>{' '}
        </>
      )}
    />
  </FormItem>
);

export default PouleField;
