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
  onDeleteMessage,
  onDeleteVideo,
  fetchMessagesForChat,
  handleRecipientChange,
  handleSendMessage,
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
        handleRecipientChange={(event) =>
          handleRecipientChange(event, setSelectedRecipientId, (recipientId) =>
            fetchMessagesForChat(
              recipientId,
              signedInUser.id,
              getMessages,
              setMessages,
              setLoading
            )
          )
        }
      />

      <MessageList
        messages={messages}
        signedInUser={signedInUser}
        onDeleteVideo={(messageId, removeFromDatabase = true) =>
          onDeleteVideo(
            messageId,
            removeFromDatabase,
            deleteVideo,
            signedInUser.id,
            setMessages
          )
        }
        onDeleteMessage={(messageId, removeFromDatabase = true) =>
          onDeleteMessage(
            messageId,
            removeFromDatabase,
            deleteMessage,
            signedInUser.id,
            setMessages
          )
        }
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
        handleSendMessage={(e) =>
          handleSendMessage(
            e,
            newMessage,
            selectedVideo,
            setIsSending,
            signedInUser.id,
            selectedRecipientId,
            action,
            setNewMessage,
            setSelectedVideo
          )
        }
        selectedVideo={selectedVideo}
        setSelectedVideo={setSelectedVideo}
      />
    </div>
  );
}

export default ChatClient;
