// This server action is used to add a player to the database.

'use server';

import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { users } from '@clerk/clerk-sdk-node';
import { revalidatePath } from 'next/cache';
import { ZodIssue } from 'zod';
import { createPlayerSchema } from '@/schemas/createPlayerSchema';

export default async function addPlayer(
  _prevState: any,
  params: FormData
): Promise<{ errors: ZodIssue[] }> {
  // Validating the form data against the schema
  const validation = createPlayerSchema.safeParse({
    username: params.get('username'),
    password: params.get('password'),
  });

  if (!validation.success) {
    // Returning validation errors if validation fails
    return {
      errors: validation.error.issues,
    };
  }

  const { username, password } = validation.data;

  try {
    // Registering the player in Clerk using the users object from Clerk SDK
    const clerkUser = await users.createUser({
      username,
      password,
    });

    // Saving the player to database with the Clerk ID using PrismaClient
    await prisma.user.create({
      data: {
        clerkId: clerkUser.id,
        username,
        role: 'PLAYER',
        createdAt: new Date(),
      },
    });
    revalidatePath('/player/management');

    // Redirecting after successful addition
    redirect('/player/management');
  } catch (error) {
    console.error('Error adding player:', error);

    // Return the error formatted as a ZodIssue to maintain type compatibility
    return {
      errors: [
        {
          message: 'Error registering the player.',
          path: ['form'],
          code: 'custom',
        },
      ],
    };
  }
}
