'use client';

import { Card, CardHeader, CardBody } from '@nextui-org/react';
import React from 'react';
import { FormProvider } from 'react-hook-form';
import type { ZodIssue } from 'zod';

import { Button } from '@/components/ui/button';
import useAddMatchForm from '@/hooks/useAddMatchForm';
import { Poule, Player } from '@/types/types';

import AddMatchFormFields from './AddMatchFormFields';

interface Props {
  poules: Poule[];
  players: Player[];
  action: (
    _prevState: unknown,
    params: FormData
  ) => Promise<{ errors: ZodIssue[] }>;
}

function AddMatchForm({ action, poules, players }: Props): React.ReactElement {
  const {
    methods,
    handleSubmit,
    errors,
    setValue,
    selectedPoule,
    selectedOpponent,
    onSubmit,
  } = useAddMatchForm(poules, players, action);

  return (
    <div className="w-full max-w-md mx-auto mt-10">
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold mx-auto text-center">
            Add a New Match
          </h3>
        </CardHeader>
        <CardBody>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <AddMatchFormFields
                poules={poules}
                players={players}
                selectedPoule={selectedPoule}
                selectedOpponent={selectedOpponent}
                errors={errors}
                setValue={setValue}
              />
              <Button
                type="submit"
                className="mt-4 w-full p-2 bg-black text-white rounded hover:bg-gray-800"
              >
                Add Match
              </Button>
            </form>
          </FormProvider>
        </CardBody>
      </Card>
    </div>
  );
}

export { AddMatchForm };
