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
import { Card, CardHeader, CardBody } from '@nextui-org/react';
import { PouleFormValues } from '@/types/type-list';

type Props = {
  action: (
    _prevState: any,
    params: FormData
  ) => Promise<{ errors: ZodIssue[] } | void>;
};

function AddPouleFormValidation({ action }: Props) {
  const [opponents, setOpponents] = useState<string[]>([]);
  const [showForm, setShowForm] = useState(false);
  const methods = useForm<PouleFormValues>({
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

  const onSubmit = async (data: PouleFormValues) => {
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
        <div className="space-y-4 max-w-md mx-auto mt-10">
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <h3 className="text-lg font-semibold">Poule Management</h3>

              <FormItem>
                <FormField
                  name="pouleName"
                  control={control}
                  render={({ field }) => (
                    <>
                      <FormControl>
                        <input
                          {...field}
                          className="w-full p-2 border rounded mt-1 bg-white text-black"
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
                          className="w-full p-2 border rounded mt-1 bg-white text-black"
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
                          className="w-full p-2 border rounded mt-1 bg-white text-black"
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
              {opponents.length > 0 && (
                <Card className="mt-4">
                  <CardHeader>
                    <h4 className="text-md font-semibold">Opponents</h4>
                  </CardHeader>
                  <CardBody>
                    <ul>
                      {opponents.map((opponent, index) => (
                        <li
                          key={index}
                          className="flex justify-between items-center py-2"
                        >
                          <span>{opponent}</span>
                          <Button
                            type="button"
                            onClick={() => removeOpponent(index)}
                            className="text-red-500 ml-2"
                            variant="ghost"
                            size="sm"
                          >
                            Remove
                          </Button>
                        </li>
                      ))}
                    </ul>
                  </CardBody>
                </Card>
              )}

              <Button
                type="submit"
                className="mt-4 w-full p-2 bg-black text-white rounded hover:bg-gray-800"
              >
                Add Poule
              </Button>
            </form>
          </FormProvider>
        </div>
      )}
    </div>
  );
}

export { AddPouleFormValidation };
