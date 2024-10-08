'use client';

import { Spinner } from '@nextui-org/spinner';
import React from 'react';

import useChatMessages from '@/hooks/useChatMessages';
import { SignedInUser, Message, ActionResponse } from '@/types/types';

import MessageInput from './MessageInput';
import MessageList from './MessageList';

interface Props {
  signedInUser: SignedInUser;
  messages: Message[];
  action: (_prevState: unknown, params: FormData) => Promise<ActionResponse>;
}

function ChatClient({
  signedInUser,
  messages: initialMessages,
  action,
}: Props): React.ReactElement | null {
  const { messages, loading } = useChatMessages(initialMessages);

  if (loading) {
    return (
      <div className="flex justify-center mt-10">
        <Spinner label="Loading Chat" color="primary" labelColor="primary" />
      </div>
    );
  }

  return (
    <div className="mt-5 max-w-xl mx-auto bg-brandcolor p-6 rounded">
      <h1 className="text-3xl font-bold mb-4 text-center">
        Welcome to Chat, {signedInUser.username}!
      </h1>

      <MessageList messages={messages} signedInUser={signedInUser} />

      <MessageInput action={action} signedInUser={signedInUser} />
    </div>
  );
}

export default ChatClient;
