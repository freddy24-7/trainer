import React from 'react';
import { FormProvider } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import type { PouleFormProps } from '@/types/types';

import MainTeamNameInput from './MainTeamNameInput';
import OpponentInput from './OpponentInput';
import OpponentsList from './OpponentsList';
import PouleNameInput from './PouleNameInput';

const PouleForm: React.FC<PouleFormProps> = ({
  methods,
  opponents,
  addOpponent,
  removeOpponent,
  onSubmit,
}) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = methods;

  return (
    <div className="space-y-4 max-w-md mx-auto mt-10">
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <h3 className="text-lg font-semibold">Poule Management</h3>
          <PouleNameInput control={control} errors={errors} />
          <MainTeamNameInput control={control} errors={errors} />
          <OpponentInput
            control={control}
            errors={errors}
            addOpponent={addOpponent}
          />
          <OpponentsList
            opponents={opponents}
            removeOpponent={removeOpponent}
          />
          <Button
            type="submit"
            className="mt-4 w-full p-2 bg-black text-white rounded hover:bg-gray-800"
          >
            Add Poule
          </Button>
        </form>
      </FormProvider>
    </div>
  );
};

export default PouleForm;
