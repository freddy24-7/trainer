import React from 'react';

import { InputField } from '@/components/helpers/pouleHelpers/FormFields';
import {
  pouleNamePlaceholder,
  mainTeamNamePlaceholder,
  opponentNamePlaceholder,
} from '@/strings/clientStrings';
import { PouleFormFieldsProps } from '@/types/poule-types';

export function PouleFormFields({
  control,
  errors,
  handleAddOpponent,
}: PouleFormFieldsProps): React.ReactElement {
  return (
    <>
      <InputField
        name="pouleName"
        control={control}
        placeholder={pouleNamePlaceholder}
        errors={errors}
      />
      <InputField
        name="mainTeamName"
        control={control}
        placeholder={mainTeamNamePlaceholder}
        errors={errors}
      />
      <InputField
        name="opponentName"
        control={control}
        placeholder={opponentNamePlaceholder}
        errors={errors}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            handleAddOpponent();
          }
        }}
      />
    </>
  );
}
