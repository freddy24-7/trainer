import React from 'react';

import addMessage from '@/app/actions/addMessage';
import getMessages from '@/app/actions/getMessages';
import { fetchAndCheckUser } from '@/app/fetchAndCheckUser';
import ChatClient from '@/components/chat/ChatClient';
import LoginModal from '@/components/LoginModal';

export default async function ChatPage(): Promise<React.ReactElement> {
  const signedInUser = await fetchAndCheckUser();

  if (!signedInUser) {
    return <LoginModal />;
  }

  const response = await getMessages();

  if (!response.success) {
    return <div>Error loading messages: {response.error}</div>;
  }

  const messages = response.messages;

  return (
    <ChatClient
      signedInUser={signedInUser}
      messages={messages}
      action={addMessage}
    />
  );
}
