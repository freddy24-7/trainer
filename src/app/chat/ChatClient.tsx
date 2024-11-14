'use client';

import React, { useState } from 'react';

import ChatMessageInputForm from '@/components/helpers/ChatMessageInputForm';
import MessageList from '@/components/helpers/ChatMessageList';
import ChatRecipientSelector from '@/components/helpers/ChatRecipientSelector';
import VideoDropzone from '@/components/helpers/VideoDropzone';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useChatMessages } from '@/hooks/useChatMessages';
import { Message } from '@/types/message-types';
import { ActionResponse } from '@/types/shared-types';
import { SignedInUser, ChatUser } from '@/types/user-types';
import {
  handleDeleteMessageLocal,
  handleDeleteVideoLocal,
} from '@/utils/chatUtils';

interface Props {
  signedInUser: SignedInUser;
  messages: Message[];
  users: ChatUser[];
  action: (_prevState: unknown, params: FormData) => Promise<ActionResponse>;
  getMessages: (
    userId: number,
    recipientId?: number
  ) => Promise<{
    messages: unknown[];
    success: boolean;
    error?: string;
  }>;
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
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [selectedRecipientId, setSelectedRecipientId] = useState<number | null>(
    recipientId
  );

  const { messages, setMessages } = useChatMessages(
    signedInUser.id,
    initialMessages,
    (messageId) => handleDeleteMessageLocal(messageId, setMessages),
    setLoading
  );

  const onDeleteVideo = async (
    messageId: number,
    removeFromDatabase = true
  ): Promise<void> => {
    if (removeFromDatabase) {
      const response = await deleteVideo(messageId, signedInUser.id);
      if (response.success) {
        handleDeleteVideoLocal(messageId, setMessages);
      } else {
        console.error('Failed to delete video from the database');
      }
    } else {
      handleDeleteVideoLocal(messageId, setMessages);
    }
  };

  const onDeleteMessage = async (
    messageId: number,
    removeFromDatabase = true
  ): Promise<void> => {
    if (removeFromDatabase) {
      const response = await deleteMessage(messageId, signedInUser.id);
      if (response.success) {
        handleDeleteMessageLocal(messageId, setMessages);
      } else {
        console.error('Failed to delete message from the database');
      }
    } else {
      handleDeleteMessageLocal(messageId, setMessages);
    }
  };

  const fetchMessagesForChat = async (
    recipientId: number | null
  ): Promise<void> => {
    setLoading(true);
    const response = await getMessages(
      signedInUser.id,
      recipientId ?? undefined
    );
    if (response.success) {
      setMessages(response.messages as Message[]);
    } else {
      console.error('Error fetching messages:', response.error);
    }
    setLoading(false);
  };

  const handleRecipientChange = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ): Promise<void> => {
    const selectedId =
      event.target.value === 'group' ? null : Number(event.target.value);
    setSelectedRecipientId(selectedId);
    await fetchMessagesForChat(selectedId);
  };

  const handleSendMessage = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!newMessage.trim() && !selectedVideo) {
      return;
    }

    setIsSending(true);

    const formData = new FormData();
    formData.append('content', newMessage);
    formData.append('senderId', signedInUser.id.toString());

    if (selectedRecipientId !== null) {
      formData.append('recipientId', selectedRecipientId.toString());
    }

    if (selectedVideo) {
      formData.append('videoFile', selectedVideo);
    }

    const response = await action({}, formData);

    setIsSending(false);

    if (response.success) {
      setNewMessage('');
      setSelectedVideo(null);
    } else if (response.errors) {
      const errorMessages = response.errors
        .map((error) => error.message)
        .join(', ');
      console.error(`Failed to send message: ${errorMessages}`);
    } else {
      console.error('Failed to send message due to unknown reasons.');
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="mt-5 max-w-xl mx-auto bg-brandcolor p-6 rounded">
      <h1 className="text-3xl font-bold mb-4 text-center">
        Welcome to Chat, {signedInUser.username}!
      </h1>

      <ChatRecipientSelector
        users={users}
        signedInUser={signedInUser}
        selectedRecipientId={selectedRecipientId}
        handleRecipientChange={handleRecipientChange}
      />

      <MessageList
        messages={messages}
        signedInUser={signedInUser}
        onDeleteVideo={onDeleteVideo}
        onDeleteMessage={onDeleteMessage}
      />
      {isSending && (
        <LoadingSpinner
          label="Sending..."
          color="primary"
          labelColor="primary"
        />
      )}

      <VideoDropzone setSelectedVideo={setSelectedVideo} />

      <ChatMessageInputForm
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        handleSendMessage={handleSendMessage}
        selectedVideo={selectedVideo}
        setSelectedVideo={setSelectedVideo}
      />
    </div>
  );
}

export default ChatClient;
