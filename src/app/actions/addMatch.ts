'use server';

import { ZodIssue } from 'zod';

import prisma from '@/lib/prisma';
import { createMatchSchema } from '@/schemas/matchSchema';
import { ValidationResult } from '@/types/types';

function createMatchValidation(params: FormData): ValidationResult {
  const validation = createMatchSchema.safeParse({
    pouleOpponentId: parseInt(params.get('pouleOpponentId') as string),
    date: params.get('date'),
  });

  if (!validation.success) {
    return { errors: validation.error.issues };
  }

  return { data: validation.data };
}

async function fetchOpponentExistence(
  pouleOpponentId: number
): Promise<{ errors?: ZodIssue[] }> {
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
      ] as ZodIssue[],
    };
  }

  return {};
}

export default async function createMatch(
  _prevState: unknown,
  params: FormData
): Promise<{ match?: { id: number }; errors?: ZodIssue[] }> {
  const validationResult = createMatchValidation(params);

  if (!validationResult.data) {
    return { errors: validationResult.errors };
  }

  const { pouleOpponentId, date } = validationResult.data;

  try {
    const opponentError = await fetchOpponentExistence(pouleOpponentId);
    if (opponentError.errors) {
      return opponentError;
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
        {
          message: 'Failed to create match.',
          path: ['form'],
          code: 'custom',
        },
      ] as ZodIssue[],
    };
  }
}
