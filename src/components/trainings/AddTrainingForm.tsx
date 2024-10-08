'use client';

import { Card, CardHeader, CardBody } from '@nextui-org/react';
import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { useAddTrainingForm } from '@/hooks/useAddTrainingForm';
import { TrainingFormValues, Player, TrainingActionError } from '@/types/types';

import AbsentPlayersList from './AbsentPlayersList';
import DateField from './DateField';

interface Props {
  action: (
    params: FormData
  ) => Promise<{ success?: boolean; errors?: TrainingActionError[] }>;
  players: Player[];
}

const AddTrainingForm: React.FC<Props> = ({
  action,
  players,
}): React.ReactElement => {
  const methods = useForm<TrainingFormValues>({
    defaultValues: {
      date: null,
      players: players.map((player) => ({ userId: player.id, absent: false })),
    },
  });

  const { handleSubmit } = methods;

  const { onSubmit } = useAddTrainingForm({ action });

  return (
    <div className="w-full max-w-md mx-auto mt-10">
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold mx-auto text-center">
            Add a New Training Session
          </h3>
        </CardHeader>
        <CardBody>
          <FormProvider {...methods}>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4 text-center"
            >
              <DateField />
              <AbsentPlayersList players={players} />
              <Button
                type="submit"
                className="mt-4 w-full p-2 bg-black text-white rounded hover:bg-gray-800"
              >
                Add Training
              </Button>
            </form>
          </FormProvider>
        </CardBody>
      </Card>
    </div>
  );
};

export default AddTrainingForm;
