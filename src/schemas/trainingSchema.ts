import { z } from 'zod';

export const calendarDateSchema = z.preprocess(
  (arg) => {
    if (typeof arg === 'string') {
      const d = new Date(arg);
      return {
        year: d.getFullYear(),
        month: d.getMonth() + 1,
        day: d.getDate(),
      };
    }
    return arg;
  },
  z.object({
    year: z.number(),
    month: z.number(),
    day: z.number(),
  })
);

export const addTrainingSchema = z.object({
  date: calendarDateSchema.transform((calendarDate) => {
    const { year, month, day } = calendarDate;
    return new Date(year, month - 1, day).toISOString();
  }),
  players: z.array(
    z.object({
      userId: z.number(),
      absent: z.boolean(),
    })
  ),
});
