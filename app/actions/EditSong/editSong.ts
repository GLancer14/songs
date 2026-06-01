"use server"

import { Prisma, songs } from "@/src/generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { AddSongSchema, AddSongSchemaType } from "@/app/lib/definitions";
import userIam from "../userIam";
import { writeFile } from "fs";
import path from "path";

export default async function editSong(
  state: AddSongSchemaType, formData: FormData
) {
  const user = await userIam();
  const validatedFields = AddSongSchema.safeParse({
    songs_title: formData.get("songs_title"),
    songs_name: formData.get("songs_name"),
    songs_artists: formData.get("songs_artists"),
    description: formData.get("description"),
    lyrics_translation_langs: formData.getAll("lyrics_translation_langs"),
    original: formData.get("original"),
    english: formData.get("english"),
    russian: formData.get("russian"),
    music_authors_name: formData.getAll("music_authors_name"),
    lyrics_authors_name: formData.getAll("lyrics_authors_name"),
    singers_name: formData.getAll("singers_name"),
    producers_name: formData.getAll("producers_name"),
    groupes_grope_name: formData.getAll("groupes_name"),
    orig_lang: formData.get("orig_lang"),
    genres_genre: formData.getAll("genres_genre"),
    albums_name: formData.getAll("albums_name"),
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

  const imageName = `${Date.now()}-${songData.title_image?.name.replace(/[^a-zA-Z0-9.]/g, '-')}`;
  const audioName = `${Date.now()}-${songData.orig_audio?.name.replace(/[^a-zA-Z0-9.]/g, '-')}`;

  const songCreateResult = await prisma.songs.create({
    data: {
      title: songData.songs_title,
      artists: songData.songs_artists,
      name: songData.songs_name,
      addition_date: new Date(),
      release_date: new Date(),
      bpm: Number(songData.bpm),
      description: songData.description,
      image: imageName,
      file: audioName,
      users: {
        connect: {
          user_id: user.user_id,
        }
      },
      mood: {
        connect: {
          mood_id: Number(songData.mood) || 1,
        }
      }
    }
  });

  if (
    songData.lyrics_translation_langs &&
    songData.lyrics_translation_langs.length !== 0 &&
    (songData.lyrics_translation_langs.find(value => value === "english" || value === "russian"))
  ) {
    const origLangId = await prisma.languages.findFirst({
      where: {
        lang: songData.orig_lang
      },
      select: {
        language_id: true,
      }
    })

    await prisma.songs_lyrics.create({
      data: {
        song_id: songCreateResult.song_id,
        language_id: origLangId?.language_id || 1,
        lyrics_text: songData.original,
      }
    })

    songData.lyrics_translation_langs.forEach(async (value) => {
      if (value === "english") {
        await prisma.songs_lyrics.create({
          data: {
            song_id: songCreateResult.song_id,
            language_id: 1,
            lyrics_text: songData.english ?? "",
          }
        })
      } else {
        await prisma.songs_lyrics.create({
          data: {
            song_id: songCreateResult.song_id,
            language_id: 11,
            lyrics_text: songData.russian ?? "",
          }
        })
      }
    });
  }

  if (songData.title_image && songData.title_image.size !== 0) {
    const file = songData.title_image;
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(path.join(process.cwd(), 'public/backgrounds/songs', imageName), buffer, (e) => {
      console.log(e)
    })
  }

  if (songData.orig_audio && songData.orig_audio.size !== 0) {
    const file = songData.orig_audio;
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(path.join(process.cwd(), 'public/songs', audioName), buffer, (e) => {
      console.log(e);
    })
  }

  return JSON.parse(JSON.stringify(songCreateResult));
}