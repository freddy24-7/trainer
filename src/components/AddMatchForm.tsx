// This component is used to add a match to the database.

'use client';

import React, { useEffect, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import PouleSelector from './PouleSelector';
import OpponentSelector from './OpponentSelector';
import DateSelector from './DateSelector';
import PlayerList from './PlayerList';
import { Button } from '@/components/ui/button';
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Poule, Player, PouleOpponent } from '@/lib/types';
import { CalendarDate } from '@nextui-org/react';
import type { ZodIssue } from 'zod';
import { Card, CardHeader, CardBody } from '@nextui-org/react';

type FormValues = {
  poule: number | undefined;
  opponent: number | undefined;
  date: CalendarDate | null;
  players: { id: number; minutes: number | ''; available: boolean }[];
};

type Props = {
  poules: Poule[];
  players: Player[];
  action: (
    _prevState: any,
    params: FormData
  ) => Promise<{ errors: ZodIssue[] }>;
};

function AddMatchForm({ action, poules, players }: Props) {
  const [selectedPoule, setSelectedPoule] = useState<Poule | null>(null);
  const [selectedOpponent, setSelectedOpponent] =
    useState<PouleOpponent | null>(null);
  const router = useRouter();

  const methods = useForm<FormValues>({
    defaultValues: {
      poule: poules.length > 0 ? poules[0].id : undefined,
      opponent:
        poules.length > 0 && poules[0].opponents.length > 0
          ? poules[0].opponents[0].id
          : undefined,
      date: null,
      players: players.map((player) => ({
        id: player.id,
        minutes: '',
        available: true,
      })),
    },
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    watch,
  } = methods;

  const selectedPouleId = watch('poule');
  const playerValues = watch('players');

  useEffect(() => {
    const poule = poules.find((p) => p.id === selectedPouleId) || null;
    setSelectedPoule(poule);
    setSelectedOpponent(poule?.opponents[0] || null);
    if (poule) {
      setValue('opponent', poule.opponents[0]?.id || undefined);
    }
  }, [selectedPouleId, poules, setValue]);

  const validatePlayers = () => {
    return playerValues.every(
      (player) =>
        !player.available ||
        (typeof player.minutes === 'number' && player.minutes > 0)
    );
  };

  const onSubmit = async (data: FormValues) => {
    console.log('Submitting data:', data.players);
    if (!validatePlayers()) {
      toast.error('Please enter valid minutes or mark as not available.');
      return;
    }

    const formData = new FormData();
    if (data.opponent !== undefined) {
      formData.append('pouleOpponentId', data.opponent.toString());
    }
    if (data.date) {
      formData.append('date', data.date.toString());
    }
    formData.append('players', JSON.stringify(data.players));

    try {
      const response = await action(null, formData);
      if (response.errors.length === 0) {
        toast.success('Match added successfully!');
        router.push('/');
      } else {
        toast.error('Error adding match.');
        console.error('Error details:', response.errors);
      }
    } catch (error) {
      console.error('Error during form submission:', error);
      toast.error('An error occurred during submission.');
    }
  };

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
              <FormItem>
                <FormField
                  name="poule"
                  control={control}
                  render={({ field }) => (
                    <>
                      <FormControl>
                        <PouleSelector
                          poules={poules}
                          selectedPoule={selectedPoule}
                          onPouleChange={(pouleId) => field.onChange(pouleId)}
                        />
                      </FormControl>
                      <FormMessage>{errors.poule?.message}</FormMessage>
                    </>
                  )}
                />
              </FormItem>

              {selectedPoule && selectedPoule.opponents.length > 0 && (
                <FormItem>
                  <FormField
                    name="opponent"
                    control={control}
                    render={({ field }) => (
                      <>
                        <FormControl>
                          <OpponentSelector
                            opponents={selectedPoule.opponents}
                            selectedOpponent={selectedOpponent}
                            onOpponentChange={(opponentId) =>
                              field.onChange(opponentId)
                            }
                          />
                        </FormControl>
                        <FormMessage>{errors.opponent?.message}</FormMessage>
                      </>
                    )}
                  />
                </FormItem>
              )}

              <FormItem>
                <FormField
                  name="date"
                  control={control}
                  render={({ field }) => (
                    <>
                      <FormControl>
                        <DateSelector
                          matchDate={field.value}
                          onDateChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage>{errors.date?.message}</FormMessage>
                    </>
                  )}
                />
              </FormItem>

              {players.length > 0 && (
                <PlayerList
                  players={players}
                  playerMinutes={playerValues.reduce(
                    (acc, player) => ({ ...acc, [player.id]: player.minutes }),
                    {}
                  )}
                  playerAvailability={playerValues.reduce(
                    (acc, player) => ({
                      ...acc,
                      [player.id]: player.available,
                    }),
                    {}
                  )}
                  onMinutesChange={(playerId, minutes) =>
                    setValue(
                      'players',
                      playerValues.map((player) =>
                        player.id === playerId
                          ? {
                              ...player,
                              minutes: parseInt(minutes, 10) || '',
                            }
                          : player
                      )
                    )
                  }
                  onAvailabilityChange={(playerId, available) =>
                    setValue(
                      'players',
                      playerValues.map((player) =>
                        player.id === playerId
                          ? { ...player, available }
                          : player
                      )
                    )
                  }
                />
              )}

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
