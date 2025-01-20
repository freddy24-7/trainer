import React from 'react';

import addMessage from '@/app/actions/addMessage';
import { deleteMessage } from '@/app/actions/deleteMessage';
import { deleteVideo } from '@/app/actions/deleteVideo';
import getMessages from '@/app/actions/getMessages';
import getUsers from '@/app/actions/getUsers';
import ChatClient from '@/app/chat/ChatClient';
import { fetchAndCheckUser } from '@/app/fetchAndCheckUser';
import LoginModal from '@/components/LoginModal';
import { handleChatErrorResponse } from '@/components/RenderError';
import { errorLoadingMessages } from '@/strings/serverStrings';
import { Message } from '@/types/message-types';
import { ChatUser } from '@/types/user-types';

type ValidatedUser = {
  signedInUser: ChatUser & { id: number };
  userId: number;
} | null;

const getValidatedUser = async (): Promise<ValidatedUser> => {
  const signedInUser = await fetchAndCheckUser();
  if (!signedInUser) {
    return null;
  }

  const userId = Number(signedInUser.id);
  if (isNaN(userId)) {
    throw new Error('Invalid user ID format from Clerk.');
  }

  return { signedInUser: { ...signedInUser, id: userId }, userId };
};

const getValidatedRecipientId = (
  recipientIdParam?: string | string[]
): number | undefined => {
  if (!recipientIdParam) return undefined;

  const recipientId = Number(
    Array.isArray(recipientIdParam) ? recipientIdParam[0] : recipientIdParam
  );
  if (isNaN(recipientId)) {
    throw new Error('Invalid recipient ID format.');
  }

  return recipientId;
};

const fetchProcessedUsers = async (): Promise<ChatUser[]> => {
  const usersResponse = await getUsers();
  if (!usersResponse.success) return [];

  return (
    usersResponse.users?.map((user) => ({
      ...user,
      username: user.username || 'Unknown',
      whatsappNumber: user.whatsappNumber || '',
    })) || []
  );
};

export default async function ChatPage(props: {
  searchParams: Promise<{ recipientId?: string | string[] }>;
}): Promise<React.ReactElement> {
  const searchParams = await props.searchParams;

  const userData = await getValidatedUser();
  if (!userData) {
    return <LoginModal />;
  }
  const { signedInUser, userId } = userData;

  const recipientId = getValidatedRecipientId(searchParams.recipientId);

  const response = await getMessages(userId, recipientId);
  if (!response.success) {
    return handleChatErrorResponse(response.error || errorLoadingMessages, [
      'chat',
      'fetchMessages',
    ]);
  }

  const users = await fetchProcessedUsers();
  const messages = response.messages as Message[];

  return (
    <ChatClient
      signedInUser={signedInUser}
      messages={messages}
      action={addMessage}
      getMessages={getMessages}
      deleteVideo={deleteVideo}
      deleteMessage={deleteMessage}
      recipientId={recipientId}
      users={users}
    />
  );
}
