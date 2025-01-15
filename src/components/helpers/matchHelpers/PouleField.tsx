import React from 'react';

import PouleSelector from '@/components/helpers/PouleSelector';
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { PouleFieldProps } from '@/types/poule-types';

const PouleField = ({
  poules,
  selectedPoule,
  errors,
  onChange,
}: PouleFieldProps): React.ReactElement => (
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
