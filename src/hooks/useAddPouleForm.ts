import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';

import { createPouleSchema } from '@/schemas/createPouleSchema';
import {
  HandleAddOpponentProps,
  UseAddPouleFormProps,
  UseAddPouleFormReturn,
  PouleFormValues,
} from '@/types/types';
import {
  addOpponent,
  removeOpponent,
  handleFormSubmit,
} from '@/utils/formUtils';

const handleAddOpponent = ({
  opponentName,
  opponents,
  setOpponents,
  setValue,
}: HandleAddOpponentProps): void => {
  addOpponent({
    opponentName,
    opponents,
    setOpponents,
    setValue,
  });
};

interface HandleRemoveOpponentProps {
  index: number;
  opponents: string[];
  setOpponents: React.Dispatch<React.SetStateAction<string[]>>;
  setValue: UseFormReturn<PouleFormValues>['setValue'];
}

const handleRemoveOpponent = ({
  index,
  opponents,
  setOpponents,
  setValue,
}: HandleRemoveOpponentProps): void => {
  removeOpponent({
    index,
    opponents,
    setOpponents,
    setValue,
  });
};

export function useAddPouleForm({
  action,
}: UseAddPouleFormProps): UseAddPouleFormReturn {
  const [opponents, setOpponents] = useState<string[]>([]);
  const [showForm, setShowForm] = useState(false);
  const toggleForm = (): void => setShowForm((prev) => !prev);
  const methods = useForm<PouleFormValues>({
    resolver: zodResolver(createPouleSchema),
    defaultValues: {
      pouleName: '',
      mainTeamName: '',
      opponents: [],
      opponentName: '',
    },
  });

  const { watch, setValue, reset } = methods;
  const opponentName = watch('opponentName');
  const onSubmit = async (data: PouleFormValues): Promise<void> => {
    await handleFormSubmit({
      data,
      action,
      reset,
      setOpponents,
      setShowForm,
    });
  };

  return {
    opponents,
    showForm,
    toggleForm,
    methods,
    addOpponent: (): void =>
      handleAddOpponent({
        opponentName,
        opponents,
        setOpponents,
        setValue,
      }),
    removeOpponent: (index: number): void =>
      handleRemoveOpponent({
        index,
        opponents,
        setOpponents,
        setValue,
      }),
    onSubmit,
  };
}
