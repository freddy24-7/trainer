import LoginModal from '@/components/LoginModal';
import ChatClient from '@/components/ChatClient';
import { fetchAndCheckUser } from '@/app/fetchAndCheckUser';
import getMessages from '@/app/actions/getMessages';
import addMessage from '@/app/actions/addMessage';

export default async function ChatPage() {
  const signedInUser = await fetchAndCheckUser();

  if (!signedInUser) {
    return <LoginModal />;
  }

  const response = await getMessages();

  if (!response.success) {
    return <div>Error loading messages: {response.error}</div>;
  }

  const messages = response.messages;

  return (
    <ChatClient
      signedInUser={signedInUser}
      messages={messages}
      action={addMessage}
    />
  );
}
