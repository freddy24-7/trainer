import pusher from '@/lib/pusher';

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
