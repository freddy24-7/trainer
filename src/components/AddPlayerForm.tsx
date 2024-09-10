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
import { addPlayer } from '@/app/actions/addPlayer';

// Defining the types based on the form data
interface PlayerFormData {
  username: string;
  password: string;
}

export default function AddPlayerForm() {
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  // Setting up form with React Hook Form and Zod validation using createPlayerSchema
  const methods = useForm<PlayerFormData>({
    resolver: zodResolver(createPlayerSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
    trigger,
  } = methods;

  // Form submission handler
  const onSubmit = async (data: PlayerFormData) => {
    setSubmissionError(null);

    // Calling the server action to add the player
    const response = await addPlayer(data);

    if (response.success) {
      alert('Player added and registered successfully!');
    } else {
      setSubmissionError(response.error || 'An error occurred.');
    }
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
                    placeholder="enter a username"
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
                    placeholder="enter a password"
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
          <div className="text-red-500">{submissionError}</div>
        )}

        <Button type="button" onClick={checkValidationBeforeSubmit}>
          Add Player
        </Button>
      </form>
    </FormProvider>
  );
}
