'use client';

import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@heroui/react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useForm, FormProvider, FieldErrors } from 'react-hook-form';

import DateField from '@/components/DateField';
import TrainingPlayersField from '@/components/helpers/trainingHelpers/TrainingPlayersField';
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
  const [isConfirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [formData, setFormData] = useState<TrainingFormValues | null>(null);

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

  const date = watch('date');
  const playerData = watch('players');

  const handleFormSubmit = (data: TrainingFormValues): void => {
    if (!date) {
      console.error('Validation Error: Date is required.');
      return;
    }
    setFormData(data);
    setConfirmationModalOpen(true);
  };

  const handleConfirmSubmission = async (): Promise<void> => {
    setConfirmationModalOpen(false);
    if (!formData) return;
    setIsSubmitting(true);
    try {
      await submitTrainingForm(formData, action, setIsSubmitting, router);
      console.log('Training added successfully!');
    } catch (error) {
      console.error('Error submitting training:', error);
    } finally {
      setIsSubmitting(false);
    }
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
              onSubmit={handleSubmit(handleFormSubmit)}
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
                isDisabled={!date || isSubmitting}
                isLoading={isSubmitting}
              >
                {isSubmitting ? submittingButtonText : addTrainingButtonText}
              </Button>
            </form>
          </FormProvider>
        </CardBody>
      </Card>

      <Modal isOpen={isConfirmationModalOpen} backdrop="transparent">
        <ModalContent>
          <ModalHeader>Submit Training?</ModalHeader>
          <ModalBody>
            <p>Are you sure you want to submit this training data?</p>
          </ModalBody>
          <ModalFooter>
            <Button
              color="danger"
              onPress={() => setConfirmationModalOpen(false)}
            >
              No
            </Button>
            <Button color="primary" onPress={handleConfirmSubmission}>
              Yes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default AddTrainingForm;
