import prisma from '@/lib/prisma';

export async function updateUsername(clerkId: string, newUsername: string) {
  try {
    const dbUser = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!dbUser) {
      console.log(`User with Clerk ID ${clerkId} not found in the database.`);
      return { success: false, error: 'User not found' };
    }

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
    return { success: false, error: 'Error updating username' };
  }
}
