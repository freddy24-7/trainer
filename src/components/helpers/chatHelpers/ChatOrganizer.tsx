import React from 'react';

import ChatMessageInputForm from '@/components/helpers/chatHelpers/ChatMessageInputForm';
import MessageList from '@/components/helpers/chatHelpers/ChatMessageList';
import ChatRecipientSelector from '@/components/helpers/chatHelpers/ChatRecipientSelector';
import VideoDropzone from '@/components/helpers/chatHelpers/VideoDropzone';
import LoadingSpinner from '@/components/LoadingSpinner';
import { ChatMessageProps } from '@/types/message-types';

const ChatOrganizer: React.FC<ChatMessageProps> = ({
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
  videoPublicId,
  setVideoPublicId,
}) => {
  return (
    <div className="mt-5 max-w-xl mx-auto bg-brandcolor p-6 rounded">
      <h1 className="text-3xl font-bold mb-4 text-center">
        Gaan chatten, {signedInUser.username}!
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

      <VideoDropzone
        setSelectedVideo={setSelectedVideo}
        setVideoPublicId={setVideoPublicId}
      />

      <ChatMessageInputForm
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        handleSendMessage={handleSendMessage}
        selectedVideo={selectedVideo}
        setSelectedVideo={setSelectedVideo}
        videoPublicId={videoPublicId ?? null}
        setVideoPublicId={setVideoPublicId}
      />
    </div>
  );
};

export default ChatOrganizer;
