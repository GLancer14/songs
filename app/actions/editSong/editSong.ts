"use server"

import { prisma } from "../../lib/prisma";
import { AddSongSchema, AddSongSchemaType, EditSongSchema, EditSongSchemaType } from "@/app/lib/definitions";
import userIam from "../userIam";
import { writeFile } from "fs";
import path from "path";
import { put } from "@vercel/blob";

export type ArrayValues = 
  "people" |
  "groupes" |
  "genres" |
  "albums";

type ValidModelKeys = Extract<keyof typeof prisma, ArrayValues>;

export default async function editSong(
  state: EditSongSchemaType, formData: FormData
) {
  const user = await userIam();
  const validatedFields = EditSongSchema.safeParse({
    songs_title: formData.get("songs_title"),
    songs_name: formData.get("songs_name"),
    songs_artists: formData.get("songs_artists"),
    description: formData.get("description"),
    lyrics_translation_langs: formData.getAll("lyrics_translation_langs"),
    original: formData.get("original"),
    english: formData.get("english"),
    russian: formData.get("russian"),
    people: formData.getAll("people"),
    people_types: formData.getAll("people_name-input-as"),
    groupes: formData.getAll("groupes"),
    groupes_types: formData.getAll("groupes_name-input-as"),
    orig_lang: formData.get("orig_lang"),
    genres: formData.getAll("genres"),
    albums: formData.getAll("albums"),
    mood: formData.get("mood"),
    release_date: formData.get("release_date"),
    bpm: formData.get("bpm"),
    track: formData.get("track"),
    title_image: formData.get("title_image"),
    orig_audio: formData.get("orig_audio"),
    url: formData.getAll("url"),
    url_name: formData.getAll("url_name"),
    url_type: formData.getAll("url_type"),
    song_id: formData.get("song_id"),
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
  const oldSongData = await prisma.albums.findFirst({
    where: {
      album_id: +songData.song_id,
    }
  });

  const imageName = `${Date.now()}-${songData.title_image?.name.replace(/[^a-zA-Z0-9.]/g, '-')}`;
  const audioName = `${Date.now()}-${songData.orig_audio?.name.replace(/[^a-zA-Z0-9.]/g, '-')}`;

  const songCreateResult = await prisma.songs.create({
    data: {
      title: songData.songs_title,
      artists: songData.songs_artists,
      name: songData.songs_name,
      addition_date: new Date(),
      release_date: new Date(Date.parse(songData.release_date)),
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

  await prisma.songs_groupes.deleteMany({
    where: {
      song_id: +songData.song_id,
    },
  });

  await prisma.songs_people.deleteMany({
    where: {
      song_id: +songData.song_id,
    },
  });

  const newSongGroupes = await Promise.all(songData.groupes.map(async (value) => {
    const foundGroup = await prisma.groupes.findFirst({
      where: {
        name: {
          contains: value,
          mode: "insensitive",
        },
      },
    });

    if (foundGroup) {
      return foundGroup;
    }

    return await prisma.groupes.create({
      data: {
        name: value,
      },
    });
  }));

  const newSongGroupType = await Promise.all(songData.groupes_types.map(async (value) => {
    const foundGroupType = await prisma.type.findFirst({
      where: {
        name: {
          contains: value,
          mode: "insensitive",
        },
      },
    });

    if (foundGroupType) {
      return foundGroupType;
    }

    return await prisma.type.create({
      data: {
        name: value,
      },
    });
  }));

  for (let i = 0; i < newSongGroupes.length; i++) {
    await prisma.songs_groupes.create({
      data: {
        song_id: +songData.song_id,
        id: newSongGroupes[i].id,
        type_id: newSongGroupType[i].type_id,
      },
    });
  }

  const newSongPeople = await Promise.all(songData.people.map(async (value) => {
    const foundGroup = await prisma.people.findFirst({
      where: {
        name: {
          contains: value,
          mode: "insensitive",
        },
      },
    });

    if (foundGroup) {
      return foundGroup;
    }

    return await prisma.people.create({
      data: {
        name: value,
      },
    });
  }));

  const newSongPeopleType = await Promise.all(songData.people_types.map(async (value) => {
    const foundPeopleType = await prisma.type.findFirst({
      where: {
        name: {
          contains: value,
          mode: "insensitive",
        },
      },
    });

    if (foundPeopleType) {
      return foundPeopleType;
    }

    return await prisma.type.create({
      data: {
        name: value,
      },
    });
  }));

  for (let i = 0; i < newSongPeople.length; i++) {
    await prisma.songs_people.create({
      data: {
        song_id: +songData.song_id,
        id: newSongPeople[i].id,
        type_id: newSongPeopleType[i].type_id,
      },
    });
  }

  const origLangId = await prisma.languages.findFirst({
    where: {
      lang: songData.orig_lang
    },
    select: {
      language_id: true,
    }
  });

  await prisma.songs_lyrics.create({
    data: {
      song_id: songCreateResult.song_id,
      language_id: origLangId?.language_id || 1,
      lyrics_text: songData.original,
      original: true,
    }
  });

  if (songData.lyrics_translation_langs &&
    songData.lyrics_translation_langs.length !== 0 &&
    (songData.lyrics_translation_langs.find(value => value === "english" || value === "russian"))
  ) {
    for (const value of songData.lyrics_translation_langs) {
      if (value === "english") {
        await prisma.songs_lyrics.create({
          data: {
            song_id: songCreateResult.song_id,
            language_id: 1,
            lyrics_text: songData.english ?? "",
            original: false,
          }
        })
      } else if (value === "russian") {
        await prisma.songs_lyrics.create({
          data: {
            song_id: songCreateResult.song_id,
            language_id: 11,
            lyrics_text: songData.russian ?? "",
            original: false,
          }
        })
      }
    }
  }

  const arrays: Array<ArrayValues> = [
    "people",
    "groupes",
    "genres",
    "albums",
  ]

  async function sendSongsArray(tableName: ArrayValues) {
    if (songData[tableName] && songData[tableName].length > 0) {
      const model = prisma[tableName as ValidModelKeys] as any;
      
      for (const author of songData[tableName]) {
        const existingAuthor = await model.findFirst({
          where: {
            name: author,
          },
          select: {
            id: true,
          }
        });

        let sendDataAlbums: any;

        if (existingAuthor) {
          if (tableName === "albums") {
            sendDataAlbums = {
              song_id: songCreateResult.song_id,
              id: existingAuthor.id,
              track: Number(songData.track),
            }
          } else {
            sendDataAlbums = {
              song_id: songCreateResult.song_id,
              id: existingAuthor.id,
            }
          }

          const songsTable = prisma[`songs_${tableName}` as keyof typeof prisma] as any;
          await songsTable.create({
            data: sendDataAlbums,
          });
        } else {
          const newMusicAuthor = await model.create({
            data: {
              name: author,
            },
            select: {
              id: true,
            }
          });

          if (tableName === "albums") {
            sendDataAlbums = {
              song_id: songCreateResult.song_id,
              id: newMusicAuthor.id,
              track: Number(songData.track),
            }
          } else {
            sendDataAlbums = {
              song_id: songCreateResult.song_id,
              id: newMusicAuthor.id,
            }
          }

          const songsTable = prisma[`songs_${tableName}` as keyof typeof prisma] as any;
          await songsTable.create({
            data: sendDataAlbums,
          });
        }
      }
    }
  }

  for (const arrayData of arrays) {
    await sendSongsArray(arrayData);
  }

  if (songData.url && songData.url.length > 0) {
    songData.url.forEach(async (value, ind) => {
      await prisma.links.create({
        data: {
          song_id: songCreateResult.song_id,
          url: value,
          url_name: songData.url_name![ind],
          url_type: songData.url_type![ind],
        }
      })
    })
  }

  if (songData.title_image) {
    if (songData.title_image.size === 0) {
      songData.title_image = undefined;
    } else {
      const file = songData.title_image;
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      if (!process.env.NEXT_PUBLIC_BLOB_STORE_ID) {
        await writeFile(path.join(process.cwd(), 'public/backgrounds/songs', imageName), buffer, (e) => {
          console.log(e)
        });
      } else {
        const savePath = `backgrounds/songs/${imageName}`;
        await put(savePath, buffer, {
          access: 'public',
        });
      }
    }
  }

  if (songData.orig_audio) {
    if (songData.orig_audio.size === 0) {
      songData.orig_audio = undefined;
    } else {
      const file = songData.orig_audio;
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      if (!process.env.NEXT_PUBLIC_BLOB_STORE_ID) {
        await writeFile(path.join(process.cwd(), 'public/songs', audioName), buffer, (e) => {
          console.log(e)
        });
      } else {
        const savePath = `songs/${audioName}`;
        await put(savePath, buffer, {
          access: 'public',
          multipart: true,
        });
      }
    }
  }

  return JSON.parse(JSON.stringify(songCreateResult));
}