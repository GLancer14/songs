"use server"

import 'server-only'
import { FormState, SignupFormSchema } from "../lib/definitions"
import { prisma } from "../lib/prisma";
import bcrypt from "bcrypt";
import { createSession } from "../lib/session";
import { redirect } from "next/navigation";
import { errors } from 'jose';
import { cacheLife } from 'next/cache';

export async function signup(state: FormState, formData: FormData) {
  const validatedFields = SignupFormSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
  });
 
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { name, email, password } = validatedFields.data
  const hashedPassword = await bcrypt.hash(password, 10)
  const data = await prisma.users
    .create({
      data: {
        name,
        email,
        passwordHash: hashedPassword,
      }
    });
 
  const user = data;
 
  if (!user) {
    return {
      message: 'An error occurred while creating your account.',
    };
  }

  await createSession(String(user.user_id));
  redirect('/profile');
}