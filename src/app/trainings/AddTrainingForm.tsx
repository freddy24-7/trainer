'use client';

import {
  Card,
  CardHeader,
  CardBody,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@heroui/react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';

import CustomButton from '@/components/Button';
import TrainingFormBody from '@/components/helpers/trainingHelpers/TrainingFormBody';
import { addTrainingHeader } from '@/strings/clientStrings';
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
            <TrainingFormBody
              players={players}
              playerValues={playerData}
              setValue={setValue}
              errors={errors}
              date={date}
              isSubmitting={isSubmitting}
              onSubmit={handleSubmit(handleFormSubmit)}
            />
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
            <CustomButton
              color="danger"
              onPress={() => setConfirmationModalOpen(false)}
            >
              No
            </CustomButton>
            <CustomButton color="primary" onPress={handleConfirmSubmission}>
              Yes
            </CustomButton>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default AddTrainingForm;
