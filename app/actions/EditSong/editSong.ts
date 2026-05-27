"use server"

import { Prisma, songs } from "@/src/generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { AddSongSchema, AddSongSchemaType } from "@/app/lib/definitions";
import userIam from "../userIam";

export default async function findSearchFieldValue(
  state: AddSongSchemaType, formData: FormData
) {
  const user = await userIam();
  const validatedFields = AddSongSchema.safeParse({
    songs_title: formData.get("songs_title"),
    songs_name: formData.get("songs_name"),
    songs_artist: formData.get("songs_artist"),
    description: formData.get("description"),
    lyrics_translation_langs: formData.get("lyrics_translation_langs"),
    original: formData.get("original"),
    english: formData.get("english"),
    russian: formData.get("russian"),
    music_authors_nickname: formData.get("music_authors_nickname"),
    lyrics_authors_nickname: formData.get("lyrics_authors_nickname"),
    singers_singer: formData.get("singers_singer"),
    producers_producer: formData.get("producers_producer"),
    groupes_grope_name: formData.get("groupes_grope_name"),
    original_languages: formData.get("original_languages"),
    genres_genre: formData.get("genres_genre"),
    albums_title: formData.get("albums_title"),
    mood: formData.get("mood"),
    release_date: formData.get("release_date"),
    bpm: formData.get("bpm"),
    title_image: formData.get("title_image"),
    orig_audio: formData.get("orig_audio"),
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
  const songData = validatedFields.data;
  console.log(songData.lyrics_translation_langs)

  const songCreateResult = await prisma.songs.create({
    data: {
      user_id: user.user_id,
      title: songData.songs_title,
      artists: songData.songs_artist,
      name: songData.songs_name,
      addition_date: new Date(),
      release_date: songData.release_date,
      mood_id: +songData.mood,
      bpm: songData.bpm,
      description: songData.description,
      image: songData.title_image?.name,
      file: songData.orig_audio?.name,
    }
  });

  if (songData.lyrics_translation_langs && songData.lyrics_translation_langs?.length !== 0) {
    songData.lyrics_translation_langs.forEach(value => {
      
    })
  }

  return JSON.parse(JSON.stringify(songCreateResult));
}