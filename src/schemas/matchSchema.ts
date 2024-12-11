import { z } from 'zod';

import {
  invalidPouleOpponentIdMessage,
  invalidDateFormatMessage,
  invalidUserIdMessage,
  invalidMatchIdMessage,
  minutesPositiveNumberMessage,
  minutesWhenAvailableMessage,
} from '@/strings/validationStrings';

export const createMatchSchema = z.object({
  pouleOpponentId: z.number().min(1, invalidPouleOpponentIdMessage),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: invalidDateFormatMessage,
  }),
});

export const addMatchPlayerSchema = z
  .object({
    userId: z.number().min(1, invalidUserIdMessage),
    matchId: z.number().min(1, invalidMatchIdMessage),
    available: z.boolean(),
    minutes: z.number().min(0, minutesPositiveNumberMessage),
  })
  .refine(
    (data) => {
      return !(data.available && data.minutes <= 0);
    },
    {
      message: minutesWhenAvailableMessage,
      path: ['minutes'],
    }
  );
