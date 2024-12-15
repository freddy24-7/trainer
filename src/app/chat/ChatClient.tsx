'use client';

import React, { useState, useCallback } from 'react';

import ChatOrganizer from '@/components/helpers/ChatOrganizer';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useChatMessages } from '@/hooks/useChatMessages';
import { ChatClientProps } from '@/types/message-types';
import {
  handleOnDeleteMessage,
  handleOnDeleteVideo,
  handleSendMessage,
} from '@/utils/chatUtils';

function ChatClient({
  signedInUser,
  messages: initialMessages,
  users,
  action,
  getMessages,
  deleteVideo,
  deleteMessage,
  recipientId = null,
}: ChatClientProps): React.ReactElement {
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [selectedRecipientId, setSelectedRecipientId] = useState<number | null>(
    recipientId
  );

  const { messages, setMessages, handleDeleteMessage, addOptimisticMessage } =
    useChatMessages(signedInUser.id, initialMessages, setLoading);

  const handleRecipientChange = useCallback(
    async (event: React.ChangeEvent<HTMLSelectElement>) => {
      const recipientId =
        event.target.value === 'group' ? null : Number(event.target.value);

      setSelectedRecipientId(recipientId);
      setMessages([]); // Clear old messages
      setLoading(true);

      try {
        const response = await getMessages(
          signedInUser.id,
          recipientId ?? undefined // Convert null to undefined
        );

        if (response.success) {
          setMessages(response.messages);
        } else {
          console.error('Failed to fetch messages:', response.error);
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setLoading(false);
      }
    },
    [signedInUser.id, getMessages, setMessages]
  );

  const memoizedHandleSendMessage = useCallback(
    (e: React.FormEvent) =>
      handleSendMessage({
        e,
        newMessage,
        selectedVideo,
        setIsSending,
        signedInUserId: signedInUser.id,
        selectedRecipientId,
        action,
        setNewMessage,
        setSelectedVideo,
        setMessages,
        addOptimisticMessage, // Pass the new function
      }),
    [
      newMessage,
      selectedVideo,
      signedInUser.id,
      selectedRecipientId,
      action,
      setNewMessage,
      setSelectedVideo,
      setMessages,
      addOptimisticMessage,
    ]
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <ChatOrganizer
      signedInUser={signedInUser}
      users={users}
      selectedRecipientId={selectedRecipientId}
      handleRecipientChange={handleRecipientChange}
      messages={messages}
      onDeleteVideo={(messageId, removeFromDatabase = true) =>
        handleOnDeleteVideo({
          messageId,
          removeFromDatabase,
          deleteVideo,
          signedInUserId: signedInUser.id,
          setMessages,
        })
      }
      onDeleteMessage={(messageId, removeFromDatabase = true) =>
        handleOnDeleteMessage({
          messageId,
          removeFromDatabase,
          deleteMessage,
          signedInUserId: signedInUser.id,
          handleDeleteMessage,
        })
      }
      isSending={isSending}
      setSelectedVideo={setSelectedVideo}
      newMessage={newMessage}
      setNewMessage={setNewMessage}
      handleSendMessage={memoizedHandleSendMessage}
      selectedVideo={selectedVideo}
    />
  );
}

export default ChatClient;
