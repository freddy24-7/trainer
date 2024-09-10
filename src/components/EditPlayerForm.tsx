// This component is responsible for rendering a form to edit a player.

'use client';

import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createPlayerSchema } from '@/schemas/createPlayerSchema';
import { useState } from 'react';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { editPlayer } from '@/app/actions/editPlayer';

// Defining the types based on the form data
interface PlayerFormData {
  username: string;
  password: string;
}

// Defining the props for EditPlayerForm
interface EditPlayerFormProps {
  playerId: number;
  initialUsername: string;
  onPlayerEdited: (updatedPlayer: { id: number; username: string }) => void;
  onSubmissionStart: () => void;
  onAbort: () => void;
}

export default function EditPlayerForm({
  playerId,
  initialUsername,
  onPlayerEdited,
  onSubmissionStart,
  onAbort,
}: EditPlayerFormProps) {
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Setting up the form with initial values and Zod validation
  const methods = useForm<PlayerFormData>({
    resolver: zodResolver(createPlayerSchema),
    defaultValues: {
      username: initialUsername,
      password: '',
    },
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
    trigger,
    reset,
  } = methods;

  // Handling form submission
  const onSubmit = async (data: PlayerFormData) => {
    setSubmissionError(null);
    setIsSubmitting(true);
    onSubmissionStart();

    // Calling the server action to edit the player
    const response = await editPlayer(playerId, data);

    if (response.success) {
      reset();
      onPlayerEdited({ id: playerId, username: data.username });
    } else {
      setSubmissionError(response.error || 'Error updating the player.');
    }

    setIsSubmitting(false);
  };

  // Function to check validation before submission
  const checkValidationBeforeSubmit = async () => {
    const isValid = await trigger();
    if (isValid) {
      handleSubmit(onSubmit)();
    } else {
      console.log('Validation failed, please correct the errors.');
      console.log(errors);
    }
  };

  // Handling abort action
  const handleAbort = () => {
    setSubmissionError(null);
    setIsSubmitting(false);
    onAbort();
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={(e) => e.preventDefault()}
        className="space-y-4 max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded"
      >
        <FormItem>
          <FormField
            name="username"
            control={control}
            render={({ field }) => (
              <>
                <FormLabel className="text-black">Username</FormLabel>
                <FormControl>
                  <input
                    {...field}
                    value={field.value || ''}
                    placeholder="Enter a username"
                    className="input-class w-full p-2 border rounded"
                    autoComplete="username"
                  />
                </FormControl>
                <FormMessage>{errors.username?.message}</FormMessage>
              </>
            )}
          />
        </FormItem>

        <FormItem>
          <FormField
            name="password"
            control={control}
            render={({ field }) => (
              <>
                <FormLabel className="text-black">Password</FormLabel>
                <FormControl>
                  <input
                    type="password"
                    {...field}
                    value={field.value || ''}
                    placeholder="Enter a new password"
                    className="input-class w-full p-2 border rounded"
                    autoComplete="current-password"
                  />
                </FormControl>
                <FormMessage>{errors.password?.message}</FormMessage>
              </>
            )}
          />
        </FormItem>

        {submissionError && (
          <div className="text-red-500 mb-4">
            {submissionError}
            <Button
              onClick={handleAbort}
              className="ml-4"
              variant="destructive"
            >
              Abort
            </Button>
          </div>
        )}

        <Button
          type="button"
          onClick={checkValidationBeforeSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Update Player'}
        </Button>
      </form>
    </FormProvider>
  );
}
