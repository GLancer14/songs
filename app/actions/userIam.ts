"use server"

import 'server-only'
import { prisma } from "../lib/prisma";
import { decrypt } from "../lib/session";
import { cookies } from 'next/headers';

export default async function userIam() {
  const cookie = (await cookies()).get('session')?.value;
  if (cookie) {
    const userId = await decrypt(cookie);
    if (userId) {
      const userData = await prisma.users.findUnique({
        where: {
          user_id: Number(userId.userId),
        },
      });

      // if (!userData) {
      //   return {
      //     message: 'An error occurred while creating your account.',
      //   };
      // }

      return userData
    }
  }
}