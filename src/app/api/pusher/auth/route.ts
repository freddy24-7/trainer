import { currentUser } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

import prisma from '@/lib/prisma';
import pusher from '@/lib/pusher';
import {
  unauthorizedError,
  userNotFoundError,
  channelAuthorizationError,
} from '@/strings/serverStrings';

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ error: unauthorizedError }, { status: 403 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { clerkId: user.id },
    });

    if (!dbUser) {
      return NextResponse.json({ error: userNotFoundError }, { status: 404 });
    }

    const { socket_id, channel_name } = (await req.json()) as {
      socket_id: string;
      channel_name: string;
    };

    if (channel_name.startsWith('private-chat-')) {
      const recipientId = channel_name.split('-').pop();

      if (dbUser.id.toString() !== recipientId) {
        return NextResponse.json({ error: unauthorizedError }, { status: 403 });
      }
    }

    const authResponse = pusher.authorizeChannel(socket_id, channel_name, {
      user_id: dbUser.id.toString(),
      user_info: {
        username: dbUser.username || 'Anonymous',
      },
    });

    return NextResponse.json(authResponse);
  } catch (error) {
    console.error(channelAuthorizationError, error);
    return NextResponse.json(
      { error: channelAuthorizationError },
      { status: 500 }
    );
  }
}