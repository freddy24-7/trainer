'use client';

import React, { useEffect, useState } from 'react';
import { Spinner } from '@nextui-org/spinner';
import {
  Message,
  PusherEventMessage,
  SignedInUser,
  ActionResponse,
} from '@/lib/types';
import { toast } from 'react-toastify';
import Pusher from 'pusher-js';

type Props = {
  signedInUser: SignedInUser;
  messages: Message[];
  action: (_prevState: any, params: FormData) => Promise<ActionResponse>;
};

function ChatClient({
  signedInUser,
  messages: initialMessages,
  action,
}: Props) {
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    Pusher.logToConsole = true;

    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY as string, {
      cluster: 'eu',
      forceTLS: true,
    });

    const channel = pusher.subscribe('chat');

    const handlePusherEvent = (data: PusherEventMessage) => {
      console.log('Pusher event received:', data);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: data.id,
          content: data.content,
          sender: data.sender,
          createdAt: new Date(data.createdAt),
        },
      ]);
    };

    channel.bind('new-message', handlePusherEvent);

    setLoading(false);

    return () => {
      channel.unbind('new-message', handlePusherEvent);
      pusher.unsubscribe('chat');
      pusher.disconnect();
    };
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMessage.trim()) {
      toast.error('Message cannot be empty.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('content', newMessage);
      formData.append('senderId', signedInUser.id.toString());

      const response = await action({}, formData);

      if (response.success) {
        setNewMessage('');
        toast.success('Message sent!');
      } else if (response.errors) {
        const errorMessages = response.errors
          .map((error) => error.message)
          .join(', ');
        toast.error(`Failed to send message: ${errorMessages}`);
      } else {
        toast.error('Failed to send message due to unknown reasons.');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('An error occurred while sending the message.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center mt-10">
        <Spinner label="Loading Chat" color="primary" labelColor="primary" />
      </div>
    );
  }

  return (
    <div className="mt-5 max-w-xl mx-auto bg-brandcolor p-6 rounded">
      <h1 className="text-3xl font-bold mb-4 text-center">
        Welcome to Chat, {signedInUser.username}!
      </h1>

      <div className="overflow-y-auto max-h-96 mb-4 p-4 bg-white rounded-lg">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`mb-4 flex ${
              Number(msg.sender.id) === Number(signedInUser.id)
                ? 'justify-end'
                : 'justify-start'
            }`}
          >
            <div
              className={`p-3 rounded-lg shadow-md max-w-xs break-words ${
                Number(msg.sender.id) === Number(signedInUser.id)
                  ? 'bg-blue-500 text-white self-end'
                  : 'bg-gray-200 text-gray-900 self-start'
              }`}
            >
              <div className="text-sm font-semibold mb-1">
                {Number(msg.sender.id) === Number(signedInUser.id)
                  ? 'You'
                  : msg.sender.username}
              </div>
              <div className="text-sm">{msg.content}</div>
              <div className="text-xs text-gray-400 mt-1">
                {new Date(msg.createdAt).toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSendMessage} className="flex">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-grow p-2 border border-gray-300 rounded-l"
          placeholder="Type your message..."
        />
        <button
          type="submit"
          className="p-2 bg-blue-500 text-white rounded-r"
          disabled={!newMessage.trim()}
        >
          Send
        </button>
      </form>
    </div>
  );
}

export default ChatClient;
