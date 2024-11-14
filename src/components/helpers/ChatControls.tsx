import React from 'react';

import ChatMessageInputForm from '@/components/helpers/ChatMessageInputForm';

interface ChatControlsProps {
  newMessage: string;
  setNewMessage: React.Dispatch<React.SetStateAction<string>>;
  selectedVideo: File | null;
  setSelectedVideo: React.Dispatch<React.SetStateAction<File | null>>;
  onSendMessage: () => void;
}

const ChatControls: React.FC<ChatControlsProps> = ({
  newMessage,
  setNewMessage,
  selectedVideo,
  setSelectedVideo,
  onSendMessage,
}) => (
  <ChatMessageInputForm
    newMessage={newMessage}
    setNewMessage={setNewMessage}
    handleSendMessage={onSendMessage}
    selectedVideo={selectedVideo}
    setSelectedVideo={setSelectedVideo}
  />
);

export default ChatControls;
