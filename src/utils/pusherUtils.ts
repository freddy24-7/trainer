import pusher from '@/lib/pusher';

import Pusher, { Channel } from 'pusher-js';
import { PusherEventMessage } from '@/types/type-list';

export async function triggerNewMessageEvent(message: any, sender: any) {
  try {
    const pusherResponse = await pusher.trigger('chat', 'new-message', {
      id: message.id,
      content: message.content,
      senderId: message.senderId,
      createdAt: message.createdAt,
      sender: {
        id: message.senderId,
        username: sender?.username,
      },
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

export function initializePusher(
  onMessageReceived: (data: PusherEventMessage) => void
): () => void {
  Pusher.logToConsole = true;

  const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY as string, {
    cluster: 'eu',
    forceTLS: true,
  });

  const channel: Channel = pusher.subscribe('chat');

  channel.bind('new-message', onMessageReceived);

  return () => {
    channel.unbind('new-message', onMessageReceived);
    pusher.unsubscribe('chat');
    pusher.disconnect();
  };
}
