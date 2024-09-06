// This file is responsible for creating a user in the database if they do not already exist
// This entails integration of the Clerk authentication system with the Prisma ORM plus SQL database

import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  // Obtain the user id from the auth object
  const { userId } = auth();

  if (!userId) {
    return NextResponse.redirect('/sign-in');
  }

  // Obtain the user object from the currentUser function in clerk
  const user = await currentUser();

  if (!user) {
    return NextResponse.redirect('/sign-in');
  }

  // Check if the user already exists in the database
  let alreadyExistingUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
  });

  // Create the user in the db if they do not already exist
  if (!alreadyExistingUser) {
    await prisma.user.create({
      data: {
        clerkId: user.id,
        username: user.username,
        role: 'TRAINER',
      },
    });
  }

  // Redirect the user to the dashboard
  return new NextResponse(null, {
    status: 302,
    headers: {
      Location: 'http://localhost:3000/dashboard',
    },
  });
}
