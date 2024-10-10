import prisma from '@/lib/prisma';
import { getUserByField } from '@/lib/services/prismaGetUserService';
import { handleValidatePlayer } from '@/schemas/validation/getPlayerValidation';
import { Player } from '@/type-list/types';

interface PlayerValidation {
  id: number;
  username: string | null;
  whatsappNumber: string | null;
  clerkId: string | null;
}

// Validate an individual player
export async function fetchPlayer(playerId: number): Promise<PlayerValidation> {
  const player = await getUserByField('id', playerId);

  if (!player) {
    throw new Error('Player not found.');
  }

  const validationError = handleValidatePlayer(player);
  if (validationError) {
    throw new Error(validationError);
  }

  return player;
}

export async function updateUser(
  playerId: number,
  data: { username: string; whatsappNumber: string }
): Promise<void> {
  await prisma.user.update({
    where: { id: playerId },
    data: { username: data.username, whatsappNumber: data.whatsappNumber },
  });
}

export async function createUser(
  clerkUserId: string,
  username: string,
  whatsappNumber: string
): Promise<void> {
  await prisma.user.create({
    data: {
      clerkId: clerkUserId,
      username,
      whatsappNumber,
      role: 'PLAYER',
      createdAt: new Date(),
    },
  });
}

export async function deleteUser(playerId: number): Promise<void> {
  await prisma.user.delete({
    where: { id: playerId },
  });
}

export async function fetchPlayersFromDB(): Promise<Player[]> {
  return prisma.user.findMany({
    where: { role: 'PLAYER' },
    select: {
      id: true,
      username: true,
      whatsappNumber: true,
    },
    orderBy: { createdAt: 'desc' },
  });
}
