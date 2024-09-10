import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs';
import { PrismaClient } from '@prisma/client';
import { UserSchema } from '@/schemas/userSchema';

const prisma = new PrismaClient();

export async function GET() {
  // Obtain the user id from the auth object
  const { userId } = auth();

  if (!userId) {
    return NextResponse.redirect('/sign-in');
  }

  // Obtain the user object from the currentUser function in Clerk
  const user = await currentUser();

  // Check if the user is null before proceeding
  if (!user) {
    return NextResponse.redirect('/sign-in');
  }

  // Prepare the user data for validation, now that user is confirmed to be not null
  const userData = {
    clerkId: user.id,
    username: user.username, // Ensure this value is always provided
    role: 'TRAINER', // default role, can be adjusted as needed
  };

  console.log('Validating user data with Zod:', userData);

  // Validate the user data with Zod before interacting with Prisma
  const parsedUser = UserSchema.safeParse(userData);

  if (!parsedUser.success) {
    // Handle validation errors
    console.error(parsedUser.error.format());
    return NextResponse.json(
      { error: 'Invalid user data', details: parsedUser.error.format() },
      { status: 400 }
    );
  }

  try {
    // Check if the user already exists in the database
    let alreadyExistingUser = await prisma.user.findUnique({
      where: { clerkId: parsedUser.data.clerkId },
    });

    // Create the user in the db if they do not already exist
    if (!alreadyExistingUser) {
      await prisma.user.create({
        data: parsedUser.data,
      });
    }
  } catch (error) {
    console.error('Error interacting with the database:', error);
  } finally {
    // Properly disconnect the PrismaClient to avoid open connections
    await prisma.$disconnect();
  }

  //Redirect the user to the dashboard
  return new NextResponse(null, {
    status: 302,
    headers: {
      Location: 'http://localhost:3000/dashboard',
    },
  });
}
