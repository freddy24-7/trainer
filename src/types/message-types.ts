import React from 'react';

import { SignedInUser } from './user-types';

export interface Message {
  id: number;
  content: string;
  sender: Sender;
  createdAt: Date;
  recipientId?: number | null;
}

export interface MessageListProps {
  messages: Message[];
  signedInUser: SignedInUser;
}

export interface PusherEventMessage {
  id: number;
  content: string;
  sender: Sender;
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
}
