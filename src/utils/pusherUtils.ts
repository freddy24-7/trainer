import Pusher, { Channel } from 'pusher-js';

import pusher from '@/lib/pusher';
import { PusherEventMessage, Message, Sender } from '@/types/message-types';

const newMessage = 'new-message';

export async function handleTriggerNewMessageEvent(
  message: Message,
  sender: Sender
): Promise<unknown> {
  try {
    const pusherResponse = await pusher.trigger('chat', newMessage, {
      id: message.id,
      content: message.content,
      sender: {
        id: sender.id,
        username: sender.username,
      },
      createdAt: message.createdAt,
    });

    console.log(
      'Pusher event triggered for new message:',
      message.id,
      pusherResponse
    );

    return pusherResponse;
  } catch (error) {
    console.error('Error triggering Pusher event:', error);
    throw new Error('Error triggering Pusher event');
  }
}

export function handleInitializePusher(
  onMessageReceived: (data: PusherEventMessage) => void
): () => void {
  Pusher.logToConsole = true;

  const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY as string, {
    cluster: 'eu',
    forceTLS: true,
  });

  const channel: Channel = pusher.subscribe('chat');

  channel.bind(newMessage, onMessageReceived);

  return () => {
    channel.unbind(newMessage, onMessageReceived);
    pusher.unsubscribe('chat');
    pusher.disconnect();
  };
}
