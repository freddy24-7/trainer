import React from 'react';

import ChatMessageInputForm from '@/components/helpers/ChatMessageInputForm';
import MessageList from '@/components/helpers/ChatMessageList';
import ChatRecipientSelector from '@/components/helpers/ChatRecipientSelector';
import VideoDropzone from '@/components/helpers/VideoDropzone';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Message } from '@/types/message-types';
import { SignedInUser, ChatUser } from '@/types/user-types';

interface ChatInterfaceProps {
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

const ChatOrganizer: React.FC<ChatInterfaceProps> = ({
  signedInUser,
  users,
  selectedRecipientId,
  handleRecipientChange,
  messages,
  onDeleteVideo,
  onDeleteMessage,
  isSending,
  setSelectedVideo,
  newMessage,
  setNewMessage,
  handleSendMessage,
  selectedVideo,
}) => {
  return (
    <div className="mt-5 max-w-xl mx-auto bg-brandcolor p-6 rounded">
      <h1 className="text-3xl font-bold mb-4 text-center">
        Welcome to Chat, {signedInUser.username}!
      </h1>

      <ChatRecipientSelector
        users={users}
        signedInUser={signedInUser}
        selectedRecipientId={selectedRecipientId}
        handleRecipientChange={handleRecipientChange}
      />

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

      <VideoDropzone setSelectedVideo={setSelectedVideo} />

      <ChatMessageInputForm
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        handleSendMessage={handleSendMessage}
        selectedVideo={selectedVideo}
        setSelectedVideo={setSelectedVideo}
      />
    </div>
  );
};

export default ChatOrganizer;
