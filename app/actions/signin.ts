"use server"

import 'server-only'
import { FormStateSignIn, SigninFormSchema, SignupFormSchema } from "../lib/definitions"
import { prisma } from "../lib/prisma";
import bcrypt from "bcrypt";
import { createSession } from "../lib/session";
import { redirect } from "next/navigation";
import { errors } from 'jose';
import { cacheLife } from 'next/cache';

export async function signin(state: FormStateSignIn, formData: FormData) {
  const validatedFields = SigninFormSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })
 
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { email, password } = validatedFields.data
  // const hashedPassword = await bcrypt.hash(password, 10)
  const data = await prisma.users
    .findUnique({
      where: {
        email,
      }
    });

  if (data?.passwordHash) {
    if (await bcrypt.compare(password, data.passwordHash)) {
      console.log("Добро пожаловать")
    } else {
      return {
        message: 'An error occurred while entering to your account.',
      };
    }
  }

  await createSession(String(data?.user_id));
  redirect('/profile');
}