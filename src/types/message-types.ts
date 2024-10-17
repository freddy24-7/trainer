import { SignedInUser } from './user-types';

export interface Message {
  id: number;
  content: string;
  sender: Sender;
  createdAt: Date;
}

export type MessageListProps = {
  messages: Message[];
  signedInUser: SignedInUser;
};

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
