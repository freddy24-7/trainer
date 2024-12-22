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
import { errorLoadingMessages } from '@/strings/serverStrings';
import { Message } from '@/types/message-types';
import { ChatUser } from '@/types/user-types';

export default async function ChatPage(props: {
  searchParams: Promise<{ recipientId?: string | string[] }>;
}): Promise<React.ReactElement> {
  const searchParams = await props.searchParams;
  const signedInUser = await fetchAndCheckUser();

  if (!signedInUser) {
    return <LoginModal />;
  }

  const userId = Number(signedInUser.id);

  if (isNaN(userId)) {
    throw new Error('Invalid user ID format from Clerk.');
  }

  const recipientId = searchParams.recipientId
    ? Number(searchParams.recipientId)
    : undefined;

  if (recipientId && isNaN(recipientId)) {
    throw new Error('Invalid recipient ID format.');
  }

  const response = await getMessages(userId, recipientId);

  if (!response.success) {
    return handleChatErrorResponse(response.error || errorLoadingMessages, [
      'chat',
      'fetchMessages',
    ]);
  }

  const usersResponse = await getUsers();
  const users: ChatUser[] = usersResponse.success
    ? (usersResponse.users?.map((user) => {
        return {
          ...user,
          username: user.username || 'Unknown',
          whatsappNumber: user.whatsappNumber || '',
        };
      }) ?? [])
    : [];

  const messages = response.messages as Message[];

  return (
    <ChatClient
      signedInUser={{ ...signedInUser, id: userId }}
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
