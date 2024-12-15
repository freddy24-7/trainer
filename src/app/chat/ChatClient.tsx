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
  deleteVideo,
  deleteMessage,
  recipientId = null,
}: ChatClientProps): React.ReactElement {
  // State variables for UI
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [selectedRecipientId, setSelectedRecipientId] = useState<number | null>(
    recipientId
  );

  /**
   * Initialize chat messages and manage state with the custom hook.
   */
  const { messages, setMessages, handleDeleteMessage } = useChatMessages(
    signedInUser.id,
    initialMessages,
    setLoading
  );

  /**
   * Function to handle recipient change and update messages.
   */
  const handleRecipientChange = useCallback(
    async (event: React.ChangeEvent<HTMLSelectElement>) => {
      const recipientId =
        event.target.value === 'group' ? null : Number(event.target.value);
      setSelectedRecipientId(recipientId);
      setMessages([]); // Clear messages for a smooth transition
      setLoading(true);
      // Simulate fetching new messages (add actual fetching logic if needed)
      setTimeout(() => {
        setLoading(false);
      }, 500); // Mock loading time
    },
    [setMessages]
  );

  /**
   * Memoized function for sending a message with optimistic UI updates.
   */
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
    ]
  );

  /**
   * Memoized function for deleting a video.
   */
  const memoizedHandleDeleteVideo = useCallback(
    (messageId: number, removeFromDatabase = true) =>
      handleOnDeleteVideo({
        messageId,
        removeFromDatabase,
        deleteVideo,
        signedInUserId: signedInUser.id,
        setMessages,
      }),
    [deleteVideo, signedInUser.id, setMessages]
  );

  /**
   * Memoized function for deleting a message.
   */
  const memoizedHandleDeleteMessage = useCallback(
    (messageId: number, removeFromDatabase = true) =>
      handleOnDeleteMessage({
        messageId,
        removeFromDatabase,
        deleteMessage,
        signedInUserId: signedInUser.id,
        handleDeleteMessage, // Uses the hook's local deletion logic
      }),
    [deleteMessage, signedInUser.id, handleDeleteMessage]
  );

  // Render loading spinner while fetching messages
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
      onDeleteVideo={memoizedHandleDeleteVideo}
      onDeleteMessage={memoizedHandleDeleteMessage}
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
