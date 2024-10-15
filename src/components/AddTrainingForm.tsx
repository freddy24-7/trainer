'use client';

import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardBody } from '@nextui-org/react';
import DateField from '@/components/helpers/DateField';
import TrainingPlayersField from '@/components/helpers/TrainingPlayersField';
import { TrainingFormValues, Player } from '@/types/type-list';
import { submitTrainingForm } from '@/utils/trainingFormUtils';

type Props = {
  action: (params: FormData) => Promise<{ success?: boolean; errors?: any[] }>;
  players: Player[];
};

const AddTrainingForm = ({ action, players }: Props) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const methods = useForm<TrainingFormValues>({
    defaultValues: {
      date: null,
      players: players.map((player) => ({ userId: player.id, absent: false })),
    },
  });

  const {
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = methods;

  const playerData = watch('players');

  const onSubmit = async (data: TrainingFormValues) => {
    setIsSubmitting(true);
    await submitTrainingForm(data, action, setIsSubmitting, router);
  };

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
              <DateField
                errors={errors}
                onChange={(date) => setValue('date', date)}
              />

              <TrainingPlayersField
                players={players}
                playerValues={playerData}
                setValue={setValue}
              />

              <Button
                type="submit"
                className="mt-4 w-full p-2 bg-black text-white rounded hover:bg-gray-800"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Add Training'}
              </Button>
            </form>
          </FormProvider>
        </CardBody>
      </Card>
    </div>
  );
};

export default AddTrainingForm;
