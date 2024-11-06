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

  const newMessage = 'new-message';

  const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY as string, {
    cluster: 'eu',
    forceTLS: true,
    authEndpoint: '/api/pusher/auth',
    auth: {
      headers: {
        'Content-Type': 'application/json',
      },
    },
    authorizer: (channel) => {
      return {
        authorize: (
          socketId: string,
          callback: (error: any, authData: any) => void
        ) => {
          fetch('/api/pusher/auth', {
            method: 'POST',
            credentials: 'include',
            body: JSON.stringify({
              socket_id: socketId,
              channel_name: channel.name,
            }),
            headers: {
              'Content-Type': 'application/json',
            },
          })
            .then((response) => {
              if (response.status === 200) {
                return response.json();
              } else {
                throw new Error(
                  `Failed to authenticate Pusher channel: ${response.statusText}`
                );
              }
            })
            .then((data) => {
              callback(null, data);
            })
            .catch((err) => {
              console.error('Error in Pusher authorization:', err);
              callback(err, null);
            });
        },
      };
    },
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
