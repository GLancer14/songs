"use server"

import { Prisma, songs } from "@/src/generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { AddAlbumSchema, AddAlbumSchemaType, AddSongSchema, AddSongSchemaType } from "@/app/lib/definitions";
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

export default async function editAlbum(
  state: AddAlbumSchemaType, formData: FormData
) {
  const user = await userIam();
  const validatedFields = AddAlbumSchema.safeParse({
    album_name: formData.get("album_name"),
    album_author: formData.get("album_author"),
    album_description: formData.get("album_description"),
    album_type: formData.get("album_type"),
    release_date: formData.get("release_date"),
    title_image: formData.get("title_image"),
  });

  console.log(validatedFields)
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
  const albumData = validatedFields.data;

  const imageName = `${Date.now()}-${albumData.title_image?.name.replace(/[^a-zA-Z0-9.]/g, '-')}`;

  
  const albumCreateResult = await prisma.albums.create({
    data: {
      name: albumData.album_name,
      author: albumData.album_author,
      description: albumData.album_description,
      album_type: Number(albumData.album_type),
      release_date: new Date(),
      image: imageName,
    }
  });

  if (albumData.title_image) {
    if (albumData.title_image.size !== 0) {
      return albumData.title_image = undefined;
    }

    const file = albumData.title_image;
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(path.join(process.cwd(), 'public/backgrounds/albums', imageName), buffer, (e) => {
      console.log(e)
    })
  }

  return JSON.parse(JSON.stringify(albumCreateResult));
}