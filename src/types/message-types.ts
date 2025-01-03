import React, { Dispatch, SetStateAction } from 'react';

import { ActionResponse } from '@/types/shared-types';

export interface Sender {
  id: number;
  username: string;
}

export interface ChatUser extends Sender {}

export interface SignedInUser extends Sender {}

export interface Message {
  id: number;
  content?: string | null;
  sender: Sender;
  videoUrl?: string | null;
  createdAt: Date;
  recipientId?: number | null;
}

export interface PusherEventMessage {
  id: number;
  recipientId?: number | null;
  content: string;
  sender: Sender;
  videoUrl?: string | null;
  createdAt: string;
  type?: 'delete-message' | 'new-message';
}

export interface ChatClientProps {
  signedInUser: SignedInUser;
  messages: Message[];
  users: ChatUser[];
  action: (_prevState: unknown, params: FormData) => Promise<ActionResponse>;
  getMessages: (
    userId: number,
    recipientId?: number
  ) => Promise<{
    messages: Message[];
    success: boolean;
    error?: string;
  }>;
  deleteVideo: (messageId: number, userId: number) => Promise<ActionResponse>;
  deleteMessage: (messageId: number, userId: number) => Promise<ActionResponse>;
  recipientId?: number | null;
}

export interface ChatRecipientSelectorProps {
  users: ChatUser[];
  signedInUser: SignedInUser;
  selectedRecipientId: number | null;
  handleRecipientChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

export interface ChatMessageProps {
  signedInUser: SignedInUser;
  users: ChatUser[];
  selectedRecipientId: number | null;
  handleRecipientChange: (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => Promise<void>;
  messages: Message[];
  onDeleteVideo: (
    messageId: number,
    removeFromDatabase?: boolean
  ) => Promise<void>;
  onDeleteMessage: (
    messageId: number,
    removeFromDatabase?: boolean
  ) => Promise<void>;
  isSending: boolean;
  selectedVideo: VideoData | null;
  setSelectedVideo: React.Dispatch<React.SetStateAction<VideoData | null>>;
  handleSendMessage: (formData: FormData) => Promise<void>;
  newMessage: string;
  setNewMessage: React.Dispatch<React.SetStateAction<string>>;
}

export interface VideoData {
  url: string;
  publicId: string;
}

export interface MessageInputFormProps {
  newMessage: string;
  setNewMessage: React.Dispatch<React.SetStateAction<string>>;
  handleSendMessage: (formData: FormData) => Promise<void>;
  selectedVideo: VideoData | null;
  setSelectedVideo: React.Dispatch<React.SetStateAction<VideoData | null>>;
}

export interface VideoDropzoneProps {
  setSelectedVideo: Dispatch<SetStateAction<VideoData | null>>;
}

export interface HandleOnDeleteVideoParams {
  messageId: number;
  removeFromDatabase: boolean;
  deleteVideo: (messageId: number, userId: number) => Promise<ActionResponse>;
  signedInUserId: number;
  setMessages: Dispatch<SetStateAction<Message[]>>;
}

export interface HandleOnDeleteMessageParams {
  messageId: number;
  removeFromDatabase: boolean;
  deleteMessage: (messageId: number, userId: number) => Promise<ActionResponse>;
  signedInUserId: number;
  handleDeleteMessage: (
    messageId: number,
    removeFromDatabase?: boolean
  ) => void;
}

export interface HandleSendMessageParams {
  newMessage: string;
  selectedVideo: VideoData | null;
  setIsSending: Dispatch<SetStateAction<boolean>>;
  signedInUserId: number;
  selectedRecipientId: number | null;
  action: (_prevState: unknown, params: FormData) => Promise<ActionResponse>;
  setNewMessage: Dispatch<SetStateAction<string>>;
  setSelectedVideo: Dispatch<SetStateAction<VideoData | null>>;
  setMessages: Dispatch<SetStateAction<Message[]>>;
  addOptimisticMessage: (message: Message) => void;
  replaceOptimisticMessage: (temporaryId: number, newMessage: Message) => void;
}

export interface SubscribeToPusherEventsParams {
  onMessageReceived: (data: PusherEventMessage) => void;
  onDeleteMessage: (messageId: number) => void;
  setLoading: Dispatch<SetStateAction<boolean>>;
  userId?: number;
}

export interface ChatClientAction {
  (_prevState: unknown, params: FormData): Promise<ActionResponse>;
}

export interface MessageListProps {
  messages: Message[];
  signedInUser: SignedInUser;
  onDeleteVideo: (messageId: number, removeFromDatabase?: boolean) => void;
  onDeleteMessage: (messageId: number, removeFromDatabase?: boolean) => void;
}

export interface CreateMessageParams {
  content: string | null;
  senderId: number;
  recipientId?: number;
  videoUrl?: string | null;
  videoPublicId?: string | null;
}
