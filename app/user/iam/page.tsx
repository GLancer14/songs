"use server"

import { cookies } from 'next/headers';
import { decrypt } from '@/app/lib/session';
import { prisma } from '@/app/lib/prisma';
 
export default async function Page() {
  const cookie = (await cookies()).get('session')?.value;
  if (!cookie) {
    const userId = await decrypt(cookie);
    if (userId) {
      const userData = await prisma.users.findUnique({
        where: {
          user_id: Number(userId.id),
        },
      });

      if (!userData) {
        return {
          message: 'An error occurred while creating your account.',
        };
      }
    }
  }
}