// This component is used to add a new poule to the system.

'use client';

import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { toast } from 'react-toastify';
import { zodResolver } from '@hookform/resolvers/zod';
import { createPouleSchema } from '@/schemas/createPouleSchema';
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import type { ZodIssue } from 'zod';

type FormValues = {
  pouleName: string;
  mainTeamName: string;
  opponents: string[];
  opponentName: string;
};

type Props = {
  action: (
    _prevState: any,
    params: FormData
  ) => Promise<{ errors: ZodIssue[] } | void>;
};

function AddPouleFormValidation({ action }: Props) {
  const [opponents, setOpponents] = useState<string[]>([]);
  const [showForm, setShowForm] = useState(false);
  const methods = useForm<FormValues>({
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

  const addOpponent = () => {
    if (opponentName.trim()) {
      setOpponents((prev) => [...prev, opponentName.trim()]);
      setValue('opponents', [...opponents, opponentName.trim()]);
      setValue('opponentName', '');
    } else {
      toast.error('Opponent name cannot be empty');
    }
  };

  const removeOpponent = (index: number) => {
    const updatedOpponents = opponents.filter((_, i) => i !== index);
    setOpponents(updatedOpponents);
    setValue('opponents', updatedOpponents);
  };

  const onSubmit = async (data: FormValues) => {
    const formData = new FormData();
    formData.append('pouleName', data.pouleName);
    formData.append('mainTeamName', data.mainTeamName);
    data.opponents.forEach((opponent) => {
      formData.append('opponents', opponent);
    });

    try {
      const result = await action(null, formData);
      if (result && 'errors' in result) {
        toast.error('Failed to add poule. Please check your inputs.');
        console.error('Submission errors:', result.errors);
      } else {
        toast.success('Poule added successfully!');
        reset();
        setOpponents([]);
        setShowForm(false);
      }
    } catch (error) {
      console.error('Error during form submission:', error);
      toast.error('An error occurred during submission.');
    }
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
        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 max-w-md mx-auto mt-10 p-6 bg-zinc-300 text-black shadow-md rounded dark:bg-black dark:text-white"
          >
            <h3 className="text-lg font-semibold mt-8 mb-4">
              Poule Management
            </h3>

            <FormItem>
              <FormField
                name="pouleName"
                control={control}
                render={({ field }) => (
                  <>
                    <FormControl>
                      <input
                        {...field}
                        className="input-class w-full p-2 border rounded mt-1 bg-white text-black dark:bg-white dark:text-black"
                        placeholder="Poule Name"
                      />
                    </FormControl>
                    <FormMessage>{errors.pouleName?.message}</FormMessage>
                  </>
                )}
              />
            </FormItem>

            <FormItem>
              <FormField
                name="mainTeamName"
                control={control}
                render={({ field }) => (
                  <>
                    <FormControl>
                      <input
                        {...field}
                        className="input-class w-full p-2 border rounded mt-1 bg-white text-black dark:bg-white dark:text-black"
                        placeholder="Main Team Name"
                      />
                    </FormControl>
                    <FormMessage>{errors.mainTeamName?.message}</FormMessage>
                  </>
                )}
              />
            </FormItem>

            <FormItem>
              <FormField
                name="opponentName"
                control={control}
                render={({ field }) => (
                  <>
                    <FormControl>
                      <input
                        {...field}
                        placeholder="Enter opponent name"
                        className="input-class w-full p-2 border rounded mt-1 bg-white text-black dark:bg-white dark:text-black"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addOpponent();
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage>{errors.opponents?.message}</FormMessage>
                  </>
                )}
              />
            </FormItem>

            <Button
              type="button"
              onClick={addOpponent}
              className="mt-2 bg-blue-500 text-white p-1 rounded"
            >
              Add Opponent
            </Button>

            <ul className="mt-4">
              {opponents.map((opponent, index) => (
                <li key={index} className="flex justify-between items-center">
                  <span>{opponent}</span>
                  <Button
                    type="button"
                    onClick={() => removeOpponent(index)}
                    className="text-red-500 ml-2"
                  >
                    Remove
                  </Button>
                </li>
              ))}
            </ul>

            <Button
              type="submit"
              className="mt-4 w-full p-2 bg-black text-white rounded hover:bg-gray-800 dark:bg-black dark:text-white"
            >
              Add Poule
            </Button>
          </form>
        </FormProvider>
      )}
    </div>
  );
}

export { AddPouleFormValidation };
