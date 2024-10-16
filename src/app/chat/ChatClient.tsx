'use client';

import React, { useEffect, useState } from 'react';
import { ActionResponse, Message, SignedInUser } from '@/types/type-list';
import {
  handleSendMessageUtil,
  subscribeToPusherEvents,
} from '@/utils/chatUtils';
import LoadingSpinner from '@/components/LoadingSpinner';
import MessageList from '@/components/helpers/ChatMessageList';
import MessageInputForm from '@/components/helpers/ChatMessageInputForm';

type Props = {
  signedInUser: SignedInUser;
  messages: Message[];
  action: (_prevState: any, params: FormData) => Promise<ActionResponse>;
};

function ChatClient({
  signedInUser,
  messages: initialMessages,
  action,
}: Props) {
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    return subscribeToPusherEvents(setMessages, setLoading);
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
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
