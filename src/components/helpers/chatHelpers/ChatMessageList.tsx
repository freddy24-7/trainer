import { Button } from '@heroui/react';
import React from 'react';

import {
  youLabel,
  removeVideoButtonText,
  deleteMessageButtonText,
  downloadVideoButtonText,
} from '@/strings/clientStrings';
import { MessageListProps } from '@/types/message-types';

const handleDownloadVideo = (videoUrl: string, messageId: number): void => {
  const downloadUrl = `${videoUrl.replace('/upload/', '/upload/fl_attachment/')}`;
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.download = `video_${messageId}.mp4`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const renderVideoControls = (
  msg: MessageListProps['messages'][number],
  signedInUser: MessageListProps['signedInUser'],
  onDeleteVideo: (messageId: number, removeFromDatabase?: boolean) => void
): React.ReactElement => (
  <div className="mt-2">
    <video
      controls={true}
      src={msg.videoUrl || ''}
      className="w-full rounded-lg"
    />
    <div className="flex justify-end mt-2">
      {msg.sender.id !== signedInUser.id && (
        <Button
          onPress={() => {
            if (msg.videoUrl) {
              handleDownloadVideo(msg.videoUrl, msg.id);
            } else {
              console.error('Video URL is not available for download.');
            }
          }}
          className="text-blue-500 text-xs"
        >
          {downloadVideoButtonText}
        </Button>
      )}
      <div className="flex justify-end ml-2">
        <Button
          onPress={() => onDeleteVideo(msg.id, msg.recipientId != null)}
          className="text-red-500 text-xs"
        >
          {removeVideoButtonText}
        </Button>
      </div>
    </div>
  </div>
);

const renderMessageContent = (
  msg: MessageListProps['messages'][number],
  signedInUser: MessageListProps['signedInUser'],
  onDeleteVideo: (messageId: number, removeFromDatabase?: boolean) => void
): React.ReactElement => {
  const isVideoHidden = msg.hiddenVideos?.includes(signedInUser.id);

  return (
    <>
      <div className="text-sm font-semibold mb-1">
        {msg.sender.id === signedInUser.id ? youLabel : msg.sender.username}
      </div>
      {msg.content && <div className="text-sm">{msg.content}</div>}
      {msg.videoUrl &&
        !isVideoHidden &&
        renderVideoControls(msg, signedInUser, onDeleteVideo)}
    </>
  );
};

const MessageList: React.FC<MessageListProps> = ({
  messages,
  signedInUser,
  onDeleteVideo,
  onDeleteMessage,
}) => {
  return (
    <div className="overflow-y-auto max-h-96 mb-4 p-4 bg-white rounded-lg">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`mb-4 flex ${
            msg.sender.id === signedInUser.id ? 'justify-end' : 'justify-start'
          }`}
        >
          <div
            className={`p-3 rounded-lg shadow-md max-w-xs break-words ${
              msg.sender.id === signedInUser.id
                ? 'bg-zinc-500 text-white self-end'
                : 'bg-gray-200 text-gray-900 self-start'
            }`}
          >
            {renderMessageContent(msg, signedInUser, onDeleteVideo)}

            <div className="flex justify-end mt-2">
              <Button
                onPress={() =>
                  onDeleteMessage(msg.id, msg.sender.id === signedInUser.id)
                }
                className="text-red-500 text-xs"
              >
                {deleteMessageButtonText}
              </Button>
            </div>

            <div className="text-xs text-gray-400 mt-1">
              {new Date(msg.createdAt).toLocaleTimeString()}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageList;
