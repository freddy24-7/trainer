'use client';

import { Card, CardHeader, CardBody, Button } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useForm, FormProvider, FieldErrors } from 'react-hook-form';

import DateField from '@/components/DateField';
import TrainingPlayersField from '@/components/helpers/TrainingPlayersField';
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
                label="Training Date"
                onChange={(date) => setValue('date', date)}
              />

              <TrainingPlayersField
                players={players}
                playerValues={playerData}
                setValue={setValue}
              />

              <Button
                type="submit"
                color="primary"
                size="lg"
                className="w-full"
                isDisabled={isSubmitting}
                isLoading={isSubmitting}
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
