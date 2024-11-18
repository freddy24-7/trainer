import React from 'react';

import { ActionResponse } from '@/types/shared-types';

import { ChatUser, SignedInUser } from './user-types';

export interface ChatClientProps {
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
  setSelectedVideo: React.Dispatch<React.SetStateAction<File | null>>;
  newMessage: string;
  setNewMessage: React.Dispatch<React.SetStateAction<string>>;
  handleSendMessage: (e: React.FormEvent) => Promise<void>;
  selectedVideo: File | null;
}

export interface Message {
  id: number;
  content?: string | null;
  sender: Sender;
  videoUrl?: string | null;
  createdAt: Date;
  recipientId?: number | null;
}

export interface MessageListProps {
  messages: Message[];
  signedInUser: SignedInUser;
  onDeleteVideo: (messageId: number, removeFromDatabase?: boolean) => void;
  onDeleteMessage: (messageId: number, removeFromDatabase?: boolean) => void;
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

export interface Sender {
  id: number;
  username: string;
}

export interface MessageInputFormProps {
  newMessage: string;
  setNewMessage: React.Dispatch<React.SetStateAction<string>>;
  handleSendMessage: (e: React.FormEvent) => void;
  selectedVideo: File | null;
  setSelectedVideo: React.Dispatch<React.SetStateAction<File | null>>;
}

export interface VideoDropzoneProps {
  setSelectedVideo: React.Dispatch<React.SetStateAction<File | null>>;
}

export interface CreateMessageParams {
  content: string | null;
  senderId: number;
  recipientId?: number;
  videoUrl?: string | null;
  videoPublicId?: string | null;
}

export interface HandleOnDeleteVideoParams {
  messageId: number;
  removeFromDatabase: boolean;
  deleteVideo: (messageId: number, userId: number) => Promise<ActionResponse>;
  signedInUserId: number;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

export interface HandleOnDeleteMessageParams {
  messageId: number;
  removeFromDatabase: boolean;
  deleteMessage: (messageId: number, userId: number) => Promise<ActionResponse>;
  signedInUserId: number;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

export interface FetchMessagesForChatParams {
  recipientId: number | null;
  signedInUserId: number;
  getMessages: (
    userId: number,
    recipientId?: number
  ) => Promise<{
    messages: unknown[];
    success: boolean;
    error?: string;
  }>;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface HandleSendMessageParams {
  e: React.FormEvent;
  newMessage: string;
  selectedVideo: File | null;
  setIsSending: React.Dispatch<React.SetStateAction<boolean>>;
  signedInUserId: number;
  selectedRecipientId: number | null;
  action: (_prevState: unknown, params: FormData) => Promise<ActionResponse>;
  setNewMessage: React.Dispatch<React.SetStateAction<string>>;
  setSelectedVideo: React.Dispatch<React.SetStateAction<File | null>>;
}

export interface SubscribeToPusherEventsParams {
  onMessageReceived: (data: PusherEventMessage) => void;
  onDeleteMessage: (messageId: number) => void;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  userId?: number;
}

export interface HandleRecipientChangeParams {
  event: React.ChangeEvent<HTMLSelectElement>;
  setSelectedRecipientId: React.Dispatch<React.SetStateAction<number | null>>;
  fetchMessagesForChat: (recipientId: number | null) => Promise<void>;
}
