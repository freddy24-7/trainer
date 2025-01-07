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
  videoPublicId?: string | null;
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
  setSelectedVideo: Dispatch<SetStateAction<File | string | null>>;
  newMessage: string;
  setNewMessage: Dispatch<SetStateAction<string>>;
  handleSendMessage: (e: React.FormEvent) => Promise<void>;
  selectedVideo: File | string | null;
  videoPublicId?: string | null;
  setVideoPublicId: Dispatch<SetStateAction<string | null>>;
}

export interface MessageInputFormProps {
  newMessage: string;
  setNewMessage: Dispatch<SetStateAction<string>>;
  handleSendMessage: (e: React.FormEvent) => void;
  selectedVideo: File | string | null;
  setSelectedVideo: Dispatch<SetStateAction<File | string | null>>;
  videoPublicId: string | null;
  setVideoPublicId: Dispatch<SetStateAction<string | null>>;
}

export interface VideoDropzoneProps {
  setSelectedVideo: Dispatch<SetStateAction<File | string | null>>;
  setVideoPublicId: Dispatch<SetStateAction<string | null>>;
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
  e: React.FormEvent;
  newMessage: string;
  selectedVideo: File | string | null;
  setIsSending: Dispatch<SetStateAction<boolean>>;
  signedInUserId: number;
  selectedRecipientId: number | null;
  action: (_prevState: unknown, params: FormData) => Promise<ActionResponse>;
  setNewMessage: Dispatch<SetStateAction<string>>;
  setSelectedVideo: Dispatch<SetStateAction<File | string | null>>;
  setMessages: Dispatch<SetStateAction<Message[]>>;
  addOptimisticMessage: (message: Message) => void;
  replaceOptimisticMessage: (temporaryId: number, newMessage: Message) => void;
  videoPublicId: string | null;
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

export interface UseVideoUploadReturn {
  isUploading: boolean;
  uploadError: string | null;
  inputFileRef: React.RefObject<HTMLInputElement>;
  triggerFileInput: () => void;
  handleVideoChange: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
}

export type SelectedVideo = File | string | null;

export interface SelectedVideoProps {
  selectedVideo: SelectedVideo;
}
