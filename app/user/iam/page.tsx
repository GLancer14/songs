import { cookies } from 'next/headers';
import { decrypt } from '@/app/lib/session';
import { prisma } from '@/app/lib/prisma';

export default async function Page() {
  const cookieStore = await cookies();
  const cookie = cookieStore.get('session')?.value;
  
  if (!cookie) {
    return (
      <div className="p-4">
        <h1>IAM Page</h1>
        <p>Session not found. Please log in.</p>
      </div>
    );
  }

  const userId = await decrypt(cookie);
  
  if (!userId) {
    return (
      <div className="p-4">
        <h1>IAM Page</h1>
        <p>Invalid session. Please log in again.</p>
      </div>
    );
  }

  const userData = await prisma.users.findUnique({
    where: {
      user_id: Number(userId.id),
    },
  });

  if (!userData) {
    return (
      <div className="p-4">
        <h1>IAM Page</h1>
        <p>An error occurred while creating your account.</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1>IAM Page</h1>
      <div>
        <p>Welcome, {userData.name || 'User'}!</p>
        <p>Email: {userData.email}</p>
      </div>
    </div>
  );
}