import React from 'react';

import { SignedInUser } from './user-types';

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
}

export interface PusherEventMessage {
  id: number;
  recipientId?: number | null;
  content: string;
  sender: Sender;
  videoUrl?: string | null;
  createdAt: string;
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
