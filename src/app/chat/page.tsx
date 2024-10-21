import React from 'react';

import addMessage from '@/app/actions/addMessage';
import getMessages from '@/app/actions/getMessages';
import ChatClient from '@/app/chat/ChatClient';
import { fetchAndCheckUser } from '@/app/fetchAndCheckUser';
import { handleChatErrorResponse } from '@/components/helpers/RenderError';
import LoginModal from '@/components/LoginModal';
import { Message } from '@/types/message-types';

export default async function ChatPage(): Promise<React.ReactElement> {
  const signedInUser = await fetchAndCheckUser();

  if (!signedInUser) {
    return <LoginModal />;
  }

  const response = await getMessages();

  if (!response.success) {
    return handleChatErrorResponse(response.error || 'Error loading messages', [
      'chat',
      'fetchMessages',
    ]);
  }

  const messages = response.messages as Message[];

  return (
    <ChatClient
      signedInUser={signedInUser}
      messages={messages}
      action={addMessage}
    />
  );
}
