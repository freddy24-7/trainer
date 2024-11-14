'use client';

import React, { useState } from 'react';

import ChatControls from '@/components/helpers/ChatControls';
import ChatDropzone from '@/components/helpers/ChatDropzone';
import ChatHeader from '@/components/helpers/ChatHeader';
import ChatMessageList from '@/components/helpers/ChatListWrapper';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Message } from '@/types/message-types';
import { ActionResponse } from '@/types/shared-types';
import { SignedInUser, ChatUser } from '@/types/user-types';
import {
  handleRecipientChange,
  handleSendMessage,
  InitializePusherSubscription,
} from '@/utils/chatUtils';

interface Props {
  signedInUser: SignedInUser;
  messages: Message[];
  users: ChatUser[];
  action: (_prevState: unknown, params: FormData) => Promise<ActionResponse>;
  getMessages: (
    userId: number,
    recipientId?: number
  ) => Promise<{ messages: unknown[]; success: boolean; error?: string }>;
  deleteVideo: (messageId: number, userId: number) => Promise<ActionResponse>;
  deleteMessage: (messageId: number, userId: number) => Promise<ActionResponse>;
  recipientId?: number | null;
}

function ChatClient({
  signedInUser,
  messages: initialMessages,
  users,
  action,
  getMessages,
  deleteVideo,
  deleteMessage,
  recipientId = null,
}: Props): React.ReactElement {
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [selectedRecipientId, setSelectedRecipientId] = useState<number | null>(
    recipientId
  );

  InitializePusherSubscription(signedInUser.id, setMessages, setLoading);

  if (loading) return <LoadingSpinner />;

  const recipientChangeParams = {
    recipientId: selectedRecipientId,
    setSelectedRecipientId,
    setLoading,
    setMessages,
  };

  const recipientChangeData = {
    getMessages,
    signedInUserId: signedInUser.id,
  };

  const sendMessageData = {
    newMessage,
    selectedRecipientId,
    signedInUserId: signedInUser.id,
    selectedVideo,
  };

  const sendMessageState = {
    setIsSending,
    setNewMessage,
    setSelectedVideo,
  };

  return (
    <div className="mt-5 max-w-xl mx-auto bg-brandcolor p-6 rounded">
      <ChatHeader
        signedInUser={signedInUser}
        users={users}
        selectedRecipientId={selectedRecipientId}
        onRecipientChange={(recipientId) =>
          handleRecipientChange(
            { ...recipientChangeParams, recipientId },
            recipientChangeData
          )
        }
      />

      <ChatMessageList
        messages={messages}
        signedInUser={signedInUser}
        onDeleteVideo={(messageId) => deleteVideo(messageId, signedInUser.id)}
        onDeleteMessage={(messageId) =>
          deleteMessage(messageId, signedInUser.id)
        }
      />

      {isSending && (
        <LoadingSpinner
          label="Sending..."
          color="success"
          labelColor="primary"
        />
      )}

      <ChatDropzone setSelectedVideo={setSelectedVideo} />

      <ChatControls
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        selectedVideo={selectedVideo}
        setSelectedVideo={setSelectedVideo}
        onSendMessage={() =>
          handleSendMessage(sendMessageData, action, sendMessageState)
        }
      />
    </div>
  );
}

export default ChatClient;
