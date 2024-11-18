'use client';

import React, { useState } from 'react';

import ChatOrganizer from '@/components/helpers/ChatOrganizer';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useChatMessages } from '@/hooks/useChatMessages';
import { ChatClientProps } from '@/types/message-types';
import {
  handleDeleteMessageLocal,
  handleOnDeleteMessage,
  handleOnDeleteVideo,
  fetchMessagesForChat,
  handleRecipientChange,
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

  const { messages, setMessages } = useChatMessages(
    signedInUser.id,
    initialMessages,
    (messageId) => handleDeleteMessageLocal(messageId, setMessages),
    setLoading
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <ChatOrganizer
      signedInUser={signedInUser}
      users={users}
      selectedRecipientId={selectedRecipientId}
      handleRecipientChange={(event) =>
        handleRecipientChange({
          event,
          setSelectedRecipientId,
          fetchMessagesForChat: (recipientId) =>
            fetchMessagesForChat({
              recipientId,
              signedInUserId: signedInUser.id,
              getMessages,
              setMessages,
              setLoading,
            }),
        })
      }
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
          setMessages,
        })
      }
      isSending={isSending}
      setSelectedVideo={setSelectedVideo}
      newMessage={newMessage}
      setNewMessage={setNewMessage}
      handleSendMessage={(e) =>
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
        })
      }
      selectedVideo={selectedVideo}
    />
  );
}

export default ChatClient;
