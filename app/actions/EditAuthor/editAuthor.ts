"use server"

import { Prisma, songs } from "@/src/generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { AddAuthorSchema, AddAuthorSchemaType } from "@/app/lib/definitions";
import userIam from "../userIam";
import { writeFile } from "fs";
import path from "path";

export type ArrayValues = 
  "music_authors" |
  "lyrics_authors" |
  "singers" |
  "producers" |
  "groupes" |
  "genres" |
  "albums";

export default async function editAuthor(
  state: AddAuthorSchemaType, formData: FormData
) {
  const user = await userIam();
  const validatedFields = AddAuthorSchema.safeParse({
    author_name: formData.get("author_name"),
    author_surname: formData.get("author_surname"),
    author_nickname: formData.get("author_nickname"),
    author_description: formData.get("author_description"),
    title_image: formData.get("title_image"),
    author_type: formData.get("author_type"),
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
  const authorData = validatedFields.data;
  const tableName = `${authorData.author_type}_authors`;

  const imageName = `${Date.now()}-${authorData.title_image?.name.replace(/[^a-zA-Z0-9.]/g, '-')}`;

  const albumCreateResult = await prisma[tableName].create({
    data: {
      name: authorData.author_name,
      surname: authorData.author_surname,
      nickname: authorData.author_nickname,
      description: authorData.author_description,
      image: imageName,
    },
  });

  if (authorData.title_image) {
    if (authorData.title_image.size === 0) {
      return authorData.title_image = undefined;
    }

    const file = authorData.title_image;
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(path.join(process.cwd(), 'public/backgrounds/albums', imageName), buffer, (e) => {
      console.log(e)
    });
  }

  return JSON.parse(JSON.stringify(albumCreateResult));
}