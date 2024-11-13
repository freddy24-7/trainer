import { currentUser } from '@clerk/nextjs';
import { NextRequest, NextResponse } from 'next/server';

import prisma from '@/lib/prisma';
import pusher from '@/lib/pusher';

async function handleAuthorizePrivateChannel(
  dbUserId: number,
  channelName: string
): Promise<boolean> {
  if (channelName.startsWith('private-chat-')) {
    const recipientId = channelName.split('-').pop();
    return dbUserId.toString() === recipientId;
  }
  return true;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { clerkId: user.id },
    });
    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { socketId, channelName } = (await req.json()) as {
      socketId: string;
      channelName: string;
    };

    const isAuthorized = await handleAuthorizePrivateChannel(
      dbUser.id,
      channelName
    );
    if (!isAuthorized) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const authResponse = pusher.authorizeChannel(socketId, channelName, {
      user_id: dbUser.id.toString(),
      user_info: {
        username: dbUser.username || 'Anonymous',
      },
    });

    return NextResponse.json(authResponse);
  } catch (error) {
    console.error('Error authorizing Pusher channel:', error);
    return NextResponse.json(
      { error: 'Error authorizing channel' },
      { status: 500 }
    );
  }
}
