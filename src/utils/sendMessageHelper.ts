import { toast } from 'react-toastify';

import { SendMessageParams } from '@/types/types';

export async function handleSendMessage({
  action,
  signedInUser,
  newMessage,
  setNewMessage,
}: SendMessageParams): Promise<void> {
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
}
