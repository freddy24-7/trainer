'use client';

import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardHeader, CardBody } from '@nextui-org/react';
import DateSelector from './DateSelector';
import { CalendarDate } from '@nextui-org/react';
import { TrainingFormValues, Player } from '@/types/type-list';

type Props = {
  action: (params: FormData) => Promise<{ success?: boolean; errors?: any[] }>;
  players: Player[];
};

const AddTrainingForm = ({ action, players }: Props) => {
  const router = useRouter();
  const methods = useForm<TrainingFormValues>({
    defaultValues: {
      date: null,
      players: players.map((player) => ({ userId: player.id, absent: false })),
    },
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    watch,
  } = methods;

  const playerData = watch('players');

  const toggleAbsence = (index: number) => {
    setValue(`players.${index}.absent`, !playerData[index].absent);
  };

  const convertCalendarDateToDate = (calendarDate: CalendarDate): Date => {
    return new Date(
      calendarDate.year,
      calendarDate.month - 1,
      calendarDate.day
    );
  };

  const onSubmit = async (data: TrainingFormValues) => {
    const formData = new FormData();
    if (data.date) {
      const dateObj = convertCalendarDateToDate(data.date);
      formData.append('date', dateObj.toISOString());
    }
    formData.append('players', JSON.stringify(data.players));

    try {
      const response = await action(formData);
      if (response.success) {
        toast.success('Training added successfully!');
        router.push('/');
      } else {
        toast.error('Error adding training.');
      }
    } catch (error) {
      toast.error('An error occurred during submission.');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto mt-10">
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold mx-auto text-center">
            Add a New Training Session
          </h3>
        </CardHeader>
        <CardBody>
          <FormProvider {...methods}>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4 text-center"
            >
              {' '}
              <FormItem>
                <FormField
                  name="date"
                  control={control}
                  render={({ field }) => (
                    <>
                      <FormControl>
                        <div className="flex justify-center">
                          <DateSelector
                            matchDate={field.value}
                            onDateChange={field.onChange}
                          />
                        </div>
                      </FormControl>
                      <FormMessage>{errors.date?.message}</FormMessage>
                    </>
                  )}
                />
              </FormItem>
              <h3 className="text-lg font-semibold mb-2">Absent Players</h3>
              <div className="space-y-2">
                {playerData.map((player, index) => (
                  <FormItem key={player.userId}>
                    <FormField
                      name={`players.${index}.absent`}
                      control={control}
                      render={() => (
                        <>
                          <FormControl>
                            <div className="flex justify-start items-center ml-40 space-x-2">
                              {' '}
                              <input
                                type="checkbox"
                                checked={player.absent}
                                onChange={() => toggleAbsence(index)}
                                className="checkbox"
                              />
                              <span>
                                {
                                  players.find((p) => p.id === player.userId)
                                    ?.username
                                }
                              </span>
                            </div>
                          </FormControl>
                        </>
                      )}
                    />
                  </FormItem>
                ))}
              </div>
              <Button
                type="submit"
                className="mt-4 w-full p-2 bg-black text-white rounded hover:bg-gray-800"
              >
                Add Training
              </Button>
            </form>
          </FormProvider>
        </CardBody>
      </Card>
    </div>
  );
};

export default AddTrainingForm;
