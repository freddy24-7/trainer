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
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
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
