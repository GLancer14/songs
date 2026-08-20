"use server"

import { Prisma, songs } from "@/src/generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { AddPeopleSchema, AddPeopleSchemaType, EditUserSchema, EditUserSchemaType } from "@/app/lib/definitions";
import userIam from "../userIam";
import { writeFile } from "fs";
import path from "path";
import { put } from "@vercel/blob";

export default async function editPeople(
  state: EditUserSchemaType, formData: FormData
) {
  const user = await userIam();
  const validatedFields = EditUserSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    avatar: formData.get("avatar"),
    coverart: formData.get("coverart"),
    bio: formData.get("bio"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  if (!user) {
    return {
      errors: ["You are logged out"],
    }
  }
  const userData = validatedFields.data;

  const avatarName = `${Date.now()}-${userData.avatar?.name.replace(/[^a-zA-Z0-9.]/g, '-')}`;
  const coverartName = `${Date.now()}-${userData.coverart?.name.replace(/[^a-zA-Z0-9.]/g, '-')}`;

  const updatedUser = await prisma.users.update({
    where: {
      user_id: user.user_id,
    },
    data: {
      name: userData.name,
      email: userData.email,
      avatar: avatarName,
      coverart: coverartName,
      bio: userData.bio,
    }
  });

  if (userData.avatar) {
    if (userData.avatar.size === 0) {
      return userData.avatar = undefined;
    }

    const file = userData.avatar;
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    if (!process.env.NEXT_PUBLIC_BLOB_STORE_ID) {
      await writeFile(path.join(process.cwd(), 'public/backgrounds/users/avatars', avatarName), buffer, (e) => {
        console.log(e)
      })
    } else {
      const savePath = `backgrounds/users/avatars/${avatarName}`;
      await put(savePath, buffer, {
        access: 'public',
      });
    }
  }

  if (userData.coverart) {
    if (userData.coverart.size === 0) {
      return userData.coverart = undefined;
    }

    const file = userData.coverart;
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    if (!process.env.NEXT_PUBLIC_BLOB_STORE_ID) {
      await writeFile(path.join(process.cwd(), 'public/backgrounds/users/coverarts', avatarName), buffer, (e) => {
        console.log(e)
      })
    } else {
      const savePath = `backgrounds/users/coverarts/${avatarName}`;
      await put(savePath, buffer, {
        access: 'public',
      });
    }
  }

  return JSON.parse(JSON.stringify(updatedUser));
}