import React from 'react';

import addMessage from '@/app/actions/addMessage';
import { deleteMessage } from '@/app/actions/deleteMessage';
import { deleteVideo } from '@/app/actions/deleteVideo';
import getMessages from '@/app/actions/getMessages';
import getUsers from '@/app/actions/getUsers';
import ChatClient from '@/app/chat/ChatClient';
import { fetchAndCheckUser } from '@/app/fetchAndCheckUser';
import { handleChatErrorResponse } from '@/components/helpers/RenderError';
import LoginModal from '@/components/LoginModal';
import { Message } from '@/types/message-types';
import { ChatUser } from '@/types/user-types';

export default async function ChatPage({
  params,
}: {
  params: Promise<{ recipientId?: string | string[] }>;
}): Promise<React.ReactElement> {
  const { recipientId } = await params; // Await the `params` object

  const signedInUser = await fetchAndCheckUser();

  if (!signedInUser) {
    return <LoginModal />;
  }

  const recipientIdNumber = recipientId ? Number(recipientId) : undefined;

  const response = await getMessages(signedInUser.id, recipientIdNumber);

  if (!response.success) {
    return handleChatErrorResponse(response.error || 'Error loading messages', [
      'chat',
      'fetchMessages',
    ]);
  }

  const usersResponse = await getUsers();
  const users: ChatUser[] = usersResponse.success
    ? (usersResponse.users?.map((user) => ({
        ...user,
        username: user.username || 'Unknown',
        whatsappNumber: user.whatsappNumber || '',
      })) ?? [])
    : [];

  const messages = response.messages as Message[];

  return (
    <ChatClient
      signedInUser={signedInUser}
      messages={messages}
      action={addMessage}
      getMessages={getMessages}
      deleteVideo={deleteVideo}
      deleteMessage={deleteMessage}
      recipientId={recipientIdNumber}
      users={users}
    />
  );
}
