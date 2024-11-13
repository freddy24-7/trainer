'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

import ChatMessageInputForm from '@/components/helpers/ChatMessageInputForm';
import MessageList from '@/components/helpers/ChatMessageList';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Message, PusherEventMessage } from '@/types/message-types';
import { ActionResponse } from '@/types/shared-types';
import { SignedInUser, ChatUser } from '@/types/user-types';
import { subscribeToPusherEvents } from '@/utils/chatUtils';

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
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [selectedRecipientId, setSelectedRecipientId] = useState<number | null>(
    recipientId
  );

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const videoFile = acceptedFiles[0];
    if (videoFile && videoFile.type.startsWith('video/')) {
      setSelectedVideo(videoFile);
    } else {
      console.error('Only video files are accepted');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'video/*': ['.mp4', '.mov', '.avi'] },
  });

  const handleDeleteVideoLocal = (messageId: number): void => {
    setMessages((prevMessages) =>
      prevMessages.map((msg) =>
        msg.id === messageId ? { ...msg, videoUrl: null } : msg
      )
    );
  };

  const handleDeleteMessageLocal = (messageId: number): void => {
    setMessages((prevMessages) =>
      prevMessages.filter((msg) => msg.id !== messageId)
    );
  };

  const onDeleteVideo = async (
    messageId: number,
    removeFromDatabase = true
  ) => {
    if (removeFromDatabase) {
      const response = await deleteVideo(messageId, signedInUser.id);
      if (response.success) {
        handleDeleteVideoLocal(messageId);
      } else {
        console.error('Failed to delete video from the database');
      }
    } else {
      handleDeleteVideoLocal(messageId);
    }
  };

  const onDeleteMessage = async (
    messageId: number,
    removeFromDatabase = true
  ) => {
    if (removeFromDatabase) {
      const response = await deleteMessage(messageId, signedInUser.id);
      if (response.success) {
        handleDeleteMessageLocal(messageId);
      } else {
        console.error('Failed to delete message from the database');
      }
    } else {
      handleDeleteMessageLocal(messageId);
    }
  };

  useEffect(() => {
    return subscribeToPusherEvents(
      (data: PusherEventMessage) => {
        const incomingMessage: Message = {
          id: data.id,
          content: data.content,
          sender: data.sender,
          createdAt: new Date(data.createdAt),
          videoUrl: data.videoUrl || null,
          recipientId: data.recipientId ?? null,
        };

        setMessages((prevMessages) => [...prevMessages, incomingMessage]);
      },
      handleDeleteMessageLocal,
      setLoading,
      signedInUser.id
    );
  }, [signedInUser.id]);

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

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Select Chat:</label>
        <select
          className="p-2 border rounded w-full"
          value={selectedRecipientId ?? 'group'}
          onChange={handleRecipientChange}
        >
          <option value="group">Group Chat</option>
          {users
            .filter((user) => user.id !== signedInUser.id)
            .map((user) => (
              <option key={user.id} value={user.id}>
                Chat with {user.username}
              </option>
            ))}
        </select>
      </div>

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

      <div
        {...getRootProps()}
        className={`border-2 border-dashed p-4 rounded-md ${
          isDragActive ? 'border-blue-500' : 'border-gray-300'
        } mb-4`}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the video here...</p>
        ) : (
          <p>Drag & drop a video here, or click icon below to select one</p>
        )}
      </div>

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
