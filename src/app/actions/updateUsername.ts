import {
  handleFindUserByClerkId,
  updateUserUsername,
} from '@/lib/services/updateUserService';
import { UpdateUsernameResult } from '@/types/user-types';
import { formatError } from '@/utils/errorUtils';

export async function updateUsername(
  clerkId: string,
  newUsername: string
): Promise<UpdateUsernameResult> {
  try {
    const dbUser = await handleFindUserByClerkId(clerkId);

    if (!dbUser) {
      console.log(`User with Clerk ID ${clerkId} not found in the database.`);
      return formatError('User not found', ['clerkId'], 'custom', true);
    }

    if (dbUser.username !== newUsername) {
      console.log(
        `Updating username from '${dbUser.username}' to '${newUsername}'`
      );

      await updateUserUsername(clerkId, newUsername);

      console.log(`Username successfully updated to: ${newUsername}`);
      return { success: true };
    } else {
      console.log('Username is already up-to-date, no update needed.');
      return { success: true };
    }
  } catch (error) {
    console.error(`Error updating username for Clerk ID ${clerkId}:`, error);
    return formatError('Error updating username', ['username'], 'custom', true);
  }
}
