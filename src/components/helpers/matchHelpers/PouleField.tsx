import React from 'react';

import PouleSelector from '@/components/helpers/playerHelpers/PouleSelector';
import { PouleFieldProps } from '@/types/poule-types';

const PouleField = ({
  poules,
  selectedPoule,
  errors,
  onChange,
}: PouleFieldProps): React.ReactElement => (
  <div className="space-y-4">
    <div className="relative">
      <PouleSelector
        poules={poules}
        selectedPoule={selectedPoule}
        onPouleChange={onChange}
      />
    </div>
    {errors.poule?.message && (
      <span className="text-danger text-sm mt-1">{errors.poule.message}</span>
    )}
  </div>
);

export default PouleField;
