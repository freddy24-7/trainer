'use client';

import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createPouleSchema } from '@/schemas/createPouleSchema';
import { ZodIssue } from 'zod';
import { InputField } from '@/components/helpers/FormFields';
import { OpponentsList } from '@/components/helpers/OpponentsList';
import { Button } from '@/components/ui/button';
import { PouleFormValues } from '@/types/poule-types';
import { submitPouleForm } from '@/utils/pouleUtils';
import { addOpponent, removeOpponent } from '@/utils/pouleFormUtils';

type Props = {
  action: (
    _prevState: any,
    params: FormData
  ) => Promise<{ errors: ZodIssue[] } | void>;
};

function AddPouleForm({ action }: Props) {
  const [opponents, setOpponents] = useState<string[]>([]);
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

  const handleAddOpponent = () => {
    addOpponent(opponentName, opponents, setOpponents, setValue);
  };

  const handleRemoveOpponent = (index: number) => {
    removeOpponent(index, opponents, setOpponents, setValue);
  };

  const onSubmit = async (data: PouleFormValues) => {
    await submitPouleForm(data, action, reset, setOpponents, setShowForm);
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
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <h3 className="text-lg font-semibold">Poule Management</h3>

              <InputField
                name="pouleName"
                control={control}
                placeholder="Poule Name"
                errors={errors}
              />

              <InputField
                name="mainTeamName"
                control={control}
                placeholder="Main Team Name"
                errors={errors}
              />

              <InputField
                name="opponentName"
                control={control}
                placeholder="Enter opponent name"
                errors={errors}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddOpponent();
                  }
                }}
              />

              <Button
                type="button"
                onClick={handleAddOpponent}
                className="mt-2 bg-blue-500 text-white p-1 rounded"
              >
                Add Opponent
              </Button>

              {opponents.length > 0 && (
                <OpponentsList
                  opponents={opponents}
                  onRemove={handleRemoveOpponent}
                />
              )}

              <Button
                type="submit"
                className="mt-4 w-full p-2 bg-black text-white rounded hover:bg-gray-800"
              >
                Add Poule
              </Button>
            </form>
          </FormProvider>
        </div>
      )}
    </div>
  );
}

export { AddPouleForm };
