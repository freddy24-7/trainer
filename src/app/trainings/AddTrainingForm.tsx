'use client';

import { Card, CardHeader, CardBody } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useForm, FormProvider, FieldErrors } from 'react-hook-form';

import DateField from '@/components/helpers/DateField';
import TrainingPlayersField from '@/components/helpers/TrainingPlayersField';
import { Button } from '@/components/ui/button';
import {
  submittingButtonText,
  addTrainingButtonText,
  addTrainingHeader,
} from '@/strings/clientStrings';
import {
  TrainingFormValues,
  TrainingFrontEndProps,
} from '@/types/training-types';
import { submitTrainingForm } from '@/utils/trainingFormUtils';

const AddTrainingForm = ({
  action,
  players,
}: TrainingFrontEndProps): React.ReactElement => {
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

  const onSubmit = async (data: TrainingFormValues): Promise<void> => {
    setIsSubmitting(true);
    await submitTrainingForm(data, action, setIsSubmitting, router);
  };

  return (
    <div className="w-full max-w-md mx-auto mt-10">
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold mx-auto text-center">
            {addTrainingHeader}
          </h3>
        </CardHeader>
        <CardBody>
          <FormProvider {...methods}>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4 text-center"
            >
              <DateField
                errors={errors as FieldErrors<TrainingFormValues>}
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
                {isSubmitting ? submittingButtonText : addTrainingButtonText}
              </Button>
            </form>
          </FormProvider>
        </CardBody>
      </Card>
    </div>
  );
};

export default AddTrainingForm;
