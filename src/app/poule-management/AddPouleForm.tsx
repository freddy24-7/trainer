'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';

import { PouleFormContent } from '@/components/helpers/PouleFormContent';
import { Button } from '@/components/ui/button';
import { useOpponentManagement } from '@/hooks/useOpponentManagement';
import { createPouleSchema } from '@/schemas/createPouleSchema';
import { PouleFormValues, PouleProps } from '@/types/poule-types';
import { handleSubmitPouleForm } from '@/utils/pouleUtils';

function AddPouleForm({ action }: PouleProps): React.ReactElement {
  const [showForm, setShowForm] = useState(false);

  const methods = useForm<PouleFormValues>({
    resolver: zodResolver(createPouleSchema),
    defaultValues: {
      pouleName: '',
      mainTeamName: '',
      opponents: [],
      opponentName: '',
    },
  });

  const {
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = methods;

  const opponentName = watch('opponentName');

  const { opponents, handleAddOpponent, handleRemoveOpponent, setOpponents } =
    useOpponentManagement(opponentName, setValue);

  const onSubmit = async (data: PouleFormValues): Promise<void> => {
    const formControls = {
      reset,
      setOpponents,
      setShowForm,
    };

    await handleSubmitPouleForm(data, action, formControls);

    setOpponents([]);
    setShowForm(false);
  };

  return (
    <div className="mt-4">
      <Button
        onClick={() => setShowForm((prev) => !prev)}
        className="mt-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        {showForm ? 'Cancel' : 'Add Another Poule'}
      </Button>

      {showForm && (
        <div className="space-y-4 max-w-md mx-auto mt-10">
          <FormProvider {...methods}>
            <PouleFormContent
              handleSubmit={handleSubmit}
              onSubmit={onSubmit}
              control={control}
              errors={errors}
              handleAddOpponent={handleAddOpponent}
              opponents={opponents}
              handleRemoveOpponent={handleRemoveOpponent}
            />
          </FormProvider>
        </div>
      )}
    </div>
  );
}

export { AddPouleForm };
