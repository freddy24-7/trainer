// This server action is used to update the username of a user (trainer) in the database.

import prisma from '@/lib/prisma';

export async function updateUsername(clerkId: string, newUsername: string) {
  try {
    // Finding the user (trainer) in the database by Clerk ID
    const dbUser = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!dbUser) {
      console.log(`User with Clerk ID ${clerkId} not found in the database.`);
      return { success: false, error: 'User not found' };
    }

    // Updating the username if it is different
    if (dbUser.username !== newUsername) {
      console.log(
        `Updating username from '${dbUser.username}' to '${newUsername}'`
      );

      await prisma.user.update({
        where: { clerkId },
        data: { username: newUsername },
      });

      console.log(`Username successfully updated to: ${newUsername}`);
      return { success: true };
    } else {
      console.log('Username is already up-to-date, no update needed.');
      return { success: true };
    }
  } catch (error) {
    console.error('Error updating username:', error);
    return { success: false, error: 'Error updating username' };
  }
}
