import Pusher, { Channel } from 'pusher-js';

import pusher from '@/lib/pusher';
import { PusherEventMessage, Message, Sender } from '@/types/message-types';

const newMessage = 'new-message';

export async function handleTriggerNewMessageEvent(
  message: Message,
  sender: Sender,
  recipientId?: number
): Promise<unknown> {
  try {
    const channel = recipientId ? `private-chat-${recipientId}` : 'chat';
    const pusherResponse = await pusher.trigger(channel, newMessage, {
      id: message.id,
      content: message.content,
      sender: {
        id: sender.id,
        username: sender.username,
      },
      createdAt: message.createdAt,
    });

    console.log(
      `Pusher event triggered for ${recipientId ? 'private' : 'group'} message:`,
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
  onMessageReceived: (data: PusherEventMessage) => void,
  userId?: number
): () => void {
  Pusher.logToConsole = true;

  const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY as string, {
    cluster: 'eu',
    forceTLS: true,
  });

  const groupChannel: Channel = pusher.subscribe('chat');
  groupChannel.bind(newMessage, onMessageReceived);

  const privateChannel = userId
    ? pusher.subscribe(`private-chat-${userId}`)
    : null;
  if (privateChannel) {
    privateChannel.bind(newMessage, onMessageReceived);
  }

  return () => {
    groupChannel.unbind(newMessage, onMessageReceived);
    pusher.unsubscribe('chat');
    if (privateChannel) {
      privateChannel.unbind(newMessage, onMessageReceived);
      pusher.unsubscribe(`private-chat-${userId}`);
    }
    pusher.disconnect();
  };
}
