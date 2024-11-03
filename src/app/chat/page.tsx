import React from 'react';

import addMessage from '@/app/actions/addMessage';
import getMessages from '@/app/actions/getMessages';
import getPlayers from '@/app/actions/getPlayers';
import ChatClient from '@/app/chat/ChatClient';
import { fetchAndCheckUser } from '@/app/fetchAndCheckUser';
import { handleChatErrorResponse } from '@/components/helpers/RenderError';
import LoginModal from '@/components/LoginModal';
import { Message } from '@/types/message-types';
import { Player } from '@/types/user-types';

export default async function ChatPage({
  searchParams,
}: {
  searchParams: { recipientId?: string | string[] };
}): Promise<React.ReactElement> {
  const signedInUser = await fetchAndCheckUser();

  if (!signedInUser) {
    return <LoginModal />;
  }

  const recipientId = searchParams.recipientId
    ? Number(searchParams.recipientId)
    : undefined;

  const response = await getMessages(signedInUser.id, recipientId);

  if (!response.success) {
    return handleChatErrorResponse(response.error || 'Error loading messages', [
      'chat',
      'fetchMessages',
    ]);
  }

  const playersResponse = await getPlayers();
  const players: Player[] = playersResponse.success
    ? (playersResponse.players?.map((player) => ({
        ...player,
        username: player.username || 'Unknown',
        whatsappNumber: player.whatsappNumber || '',
      })) ?? [])
    : [];

  const messages = response.messages as Message[];

  return (
    <ChatClient
      signedInUser={signedInUser}
      messages={messages}
      action={addMessage}
      recipientId={recipientId}
      players={players}
    />
  );
}
