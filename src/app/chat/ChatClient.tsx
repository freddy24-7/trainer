'use client';

import React, { useEffect, useState } from 'react';

import MessageInputForm from '@/components/helpers/ChatMessageInputForm';
import MessageList from '@/components/helpers/ChatMessageList';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Message } from '@/types/message-types';
import { ActionResponse } from '@/types/response-types';
import { SignedInUser } from '@/types/user-types';
import {
  handleSendMessageUtil,
  subscribeToPusherEvents,
} from '@/utils/chatUtils';

interface Props {
  signedInUser: SignedInUser;
  messages: Message[];
  action: (_prevState: unknown, params: FormData) => Promise<ActionResponse>;
}

function ChatClient({
  signedInUser,
  messages: initialMessages,
  action,
}: Props): React.ReactElement {
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    return subscribeToPusherEvents(setMessages, setLoading);
  }, []);

  const handleSendMessage = async (e: React.FormEvent): Promise<void> => {
    await handleSendMessageUtil(
      e,
      newMessage,
      signedInUser,
      action,
      setNewMessage
    );
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="mt-5 max-w-xl mx-auto bg-brandcolor p-6 rounded">
      <h1 className="text-3xl font-bold mb-4 text-center">
        Welcome to Chat, {signedInUser.username}!
      </h1>

      <MessageList messages={messages} signedInUser={signedInUser} />

      <MessageInputForm
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        handleSendMessage={handleSendMessage}
      />
    </div>
  );
}

export default ChatClient;
