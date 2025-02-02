'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';

import CustomButton from '@/components/Button';
import { PouleFormContent } from '@/components/helpers/pouleHelpers/PouleFormContent';
import { useOpponentManagement } from '@/hooks/useOpponentManagement';
import { createPouleSchema } from '@/schemas/createPouleSchema';
import { cancelButtonText, addPouleButtonText } from '@/strings/clientStrings';
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
      <div className="flex justify-center w-full">
        <CustomButton onPress={() => setShowForm((prev) => !prev)}>
          {showForm ? cancelButtonText : addPouleButtonText}
        </CustomButton>
      </div>

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
