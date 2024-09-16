// This component is a form editing a player.

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
import { PlayerFormData, PlayerFormProps } from '@/lib/types';

export default function PlayerForm({
  initialData = { username: '', password: '' },
  onSubmit,
  onSubmissionStart,
  onAbort,
  submitButtonText,
}: PlayerFormProps) {
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const methods = useForm<PlayerFormData>({
    resolver: zodResolver(createPlayerSchema),
    defaultValues: initialData,
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
    trigger,
    reset,
  } = methods;

  const handleFormSubmit = async (data: PlayerFormData) => {
    setSubmissionError(null);
    setIsSubmitting(true);
    onSubmissionStart();

    try {
      await onSubmit(data);
      reset();
    } catch (error) {
      setSubmissionError(
        (error as Error).message || 'An error occurred during submission.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const checkValidationBeforeSubmit = async () => {
    const isValid = await trigger();
    if (isValid) {
      await handleSubmit(handleFormSubmit)();
    } else {
      console.log('Validation failed, please correct the errors.');
      console.log(errors);
    }
  };

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
                    placeholder="Enter a password"
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
          {isSubmitting ? 'Submitting...' : submitButtonText}
        </Button>
      </form>
    </FormProvider>
  );
}
