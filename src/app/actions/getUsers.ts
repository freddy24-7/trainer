import { fetchUsers } from '@/lib/services/getUsersService';
import { errorFetchingUsers } from '@/strings/actionStrings';
import { UserResponse } from '@/types/user-types';
import { formatError } from '@/utils/errorUtils';

export default async function getUsers(): Promise<{
  success?: boolean;
  users?: UserResponse[];
  errors?: unknown[];
}> {
  try {
    const users = await fetchUsers();

    return { success: true, users: users as UserResponse[] };
  } catch (error) {
    console.error(error);
    return formatError(errorFetchingUsers);
  }
}
