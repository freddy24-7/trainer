'use client';

import React, { useState } from 'react';

import ChatOrganizer from '@/components/helpers/ChatOrganizer';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useChatMessages } from '@/hooks/useChatMessages';
import { ChatClientProps } from '@/types/message-types';
import {
  handleMemoizedRecipientChange as recipientChangeHandler,
  handleMemoizedSendMessage as sendMessageHandler,
} from '@/utils/chatClientUtils';
import { handleOnDeleteMessage, handleOnDeleteVideo } from '@/utils/chatUtils';

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
  const [selectedVideo, setSelectedVideo] = useState<File | string | null>(
    null
  );
  const [selectedRecipientId, setSelectedRecipientId] = useState<number | null>(
    recipientId
  );

  const {
    messages,
    setMessages,
    handleDeleteMessage,
    addOptimisticMessage,
    replaceOptimisticMessage,
  } = useChatMessages(signedInUser.id, initialMessages, setLoading);

  const memoizedHandleRecipientChange = recipientChangeHandler({
    signedInUserId: signedInUser.id,
    getMessages,
    setMessages,
    setLoading,
    setSelectedRecipientId,
  });

  const memoizedHandleSendMessage = sendMessageHandler({
    newMessage,
    selectedVideo,
    setIsSending,
    signedInUserId: signedInUser.id,
    selectedRecipientId,
    action,
    setNewMessage,
    setSelectedVideo,
    setMessages,
    addOptimisticMessage,
    replaceOptimisticMessage,
  });

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <ChatOrganizer
      signedInUser={signedInUser}
      users={users}
      selectedRecipientId={selectedRecipientId}
      handleRecipientChange={memoizedHandleRecipientChange}
      messages={messages}
      onDeleteVideo={async (messageId) => {
        try {
          const response = await fetch('/api/deleteVideo', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ messageId, userId: signedInUser.id }),
          });

          const result = await response.json();

          if (response.ok && result.success) {
            setMessages((prevMessages) =>
              prevMessages.map((msg) =>
                msg.id === messageId
                  ? { ...msg, videoUrl: null, videoPublicId: null }
                  : msg
              )
            );
          } else {
            console.error(
              'Failed to delete video:',
              result.error || 'Unknown error'
            );
          }
        } catch (error) {
          console.error('Error deleting video:', error);
        }
      }}
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
