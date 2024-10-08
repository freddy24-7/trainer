import {
  useForm,
  UseFormReturn,
  Control,
  FieldErrors,
  UseFormSetValue,
  UseFormWatch,
  UseFormHandleSubmit,
} from 'react-hook-form';
import type { ZodIssue } from 'zod';

import useMatchFormSubmit from '@/hooks/useMatchFormSubmit';
import usePouleSelection from '@/hooks/usePouleSelection';
import { FormValues, Poule, Player, PouleOpponent } from '@/types/types';
import { getDefaultFormValues } from '@/utils/getDefaultMatchFormValues';

function useAddMatchForm(
  poules: Poule[],
  players: Player[],
  action: (
    _prevState: Record<string, unknown> | null,
    params: FormData
  ) => Promise<{ errors: ZodIssue[] }>
): {
  methods: UseFormReturn<FormValues>;
  control: Control<FormValues>;
  errors: FieldErrors<FormValues>;
  setValue: UseFormSetValue<FormValues>;
  watch: UseFormWatch<FormValues>;
  handleSubmit: UseFormHandleSubmit<FormValues>;
  selectedPoule: Poule | null;
  selectedOpponent: PouleOpponent | null;
  onSubmit: (data: FormValues) => Promise<void>;
} {
  const methods = useForm<FormValues>({
    defaultValues: getDefaultFormValues(poules, players),
  });

  const {
    control,
    formState: { errors },
    setValue,
    watch,
    handleSubmit,
  } = methods;

  const selectedPouleId = watch('poule');
  const { selectedPoule, selectedOpponent } = usePouleSelection(
    poules,
    selectedPouleId,
    setValue
  );
  const onSubmit = useMatchFormSubmit(action);

  return {
    methods,
    control,
    errors,
    setValue,
    watch,
    handleSubmit,
    selectedPoule,
    selectedOpponent,
    onSubmit,
  };
}

export default useAddMatchForm;
