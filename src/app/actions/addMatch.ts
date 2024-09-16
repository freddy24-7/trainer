// This server action serves as a helper function.

'use server';

import prisma from '@/lib/prisma';
import { createMatchSchema } from '@/schemas/matchSchema';
import { ZodIssue } from 'zod';

export default async function addMatch(
  _prevState: any,
  params: FormData
): Promise<{ match?: { id: number }; errors?: ZodIssue[] }> {
  const validation = createMatchSchema.safeParse({
    pouleOpponentId: parseInt(params.get('pouleOpponentId') as string),
    date: params.get('date'),
  });

  if (!validation.success) {
    return {
      errors: validation.error.issues,
    };
  }

  const { pouleOpponentId, date } = validation.data;

  try {
    const opponentExists = await prisma.pouleOpponents.findUnique({
      where: { id: pouleOpponentId },
    });

    if (!opponentExists) {
      return {
        errors: [
          {
            message: 'Selected opponent does not exist.',
            path: ['pouleOpponentId'],
            code: 'custom',
          },
        ],
      };
    }

    const match = await prisma.match.create({
      data: {
        pouleOpponentId,
        date: new Date(date),
        createdAt: new Date(),
      },
    });

    return { match: { id: match.id } };
  } catch (error) {
    console.error('Error creating match:', error);
    return {
      errors: [
        { message: 'Failed to create match.', path: ['form'], code: 'custom' },
      ],
    };
  }
}
