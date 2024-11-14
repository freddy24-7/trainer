import React from 'react';

import MessageList from '@/components/helpers/ChatMessageList';
import { Message } from '@/types/message-types';
import { SignedInUser } from '@/types/user-types';

interface ChatMessageListProps {
  messages: Message[];
  signedInUser: SignedInUser;
  onDeleteVideo: (messageId: number) => void;
  onDeleteMessage: (messageId: number) => void;
}

const ChatMessageList: React.FC<ChatMessageListProps> = ({
  messages,
  signedInUser,
  onDeleteVideo,
  onDeleteMessage,
}) => (
  <MessageList
    messages={messages}
    signedInUser={signedInUser}
    onDeleteVideo={onDeleteVideo}
    onDeleteMessage={onDeleteMessage}
  />
);

export default ChatMessageList;
