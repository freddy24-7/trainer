import Pusher from 'pusher-js';
import { useState, useEffect } from 'react';

import {
  Message,
  PusherEventMessage,
  UseChatMessagesReturn,
} from '@/types/types';

function useChatMessages(initialMessages: Message[]): UseChatMessagesReturn {
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>(initialMessages);

  useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY as string, {
      cluster: 'eu',
      forceTLS: true,
    });

    const channel = pusher.subscribe('chat');

    const handlePusherEvent = (data: PusherEventMessage): void => {
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

  return { messages, loading };
}

export default useChatMessages;
