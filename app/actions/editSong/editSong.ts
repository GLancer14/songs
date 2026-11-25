"use server"

import { prisma } from "../../lib/prisma";
import { AddSongSchema, AddSongSchemaType, EditSongSchema, EditSongSchemaType } from "@/app/lib/definitions";
import userIam from "../userIam";
import { rm, writeFile } from "fs";
import path from "path";
import { del, put } from "@vercel/blob";

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
    track: formData.getAll("track"),
    title_image: formData.get("title_image"),
    orig_audio: formData.get("orig_audio"),
    url: formData.getAll("url"),
    url_name: formData.getAll("url_name"),
    url_type: formData.getAll("url_type"),
    song_id: formData.get("song_id"),
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

  const songData = validatedFields.data;
  const oldSongData = await prisma.songs.findFirst({
    where: {
      song_id: +songData.song_id,
    }
  });

  const imageName = `${Date.now()}-${songData.title_image?.name.replace(/[^a-zA-Z0-9.]/g, '-')}`;
  const audioName = `${Date.now()}-${songData.orig_audio?.name.replace(/[^a-zA-Z0-9.]/g, '-')}`;



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

  await prisma.songs_albums.deleteMany({
    where: {
      song_id: +songData.song_id,
    },
  });

  await prisma.songs_genres.deleteMany({
    where: {
      song_id: +songData.song_id,
    },
  });

  await prisma.songs_lyrics.deleteMany({
    where: {
      song_id: +songData.song_id,
    },
  });

  await prisma.links.deleteMany({
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
    const foundPeople = await prisma.people.findFirst({
      where: {
        name: {
          contains: value,
          mode: "insensitive",
        },
      },
    });

    if (foundPeople) {
      return foundPeople;
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

  const newSongAlbums = songData.albums && await Promise.all(songData.albums.map(async (value) => {
    const foundAlbums = await prisma.albums.findFirst({
      where: {
        name: {
          contains: value,
          mode: "insensitive",
        },
      },
    });

    if (foundAlbums) {
      return foundAlbums;
    }

    return await prisma.albums.create({
      data: {
        name: value,
        author: "new author",
      },
    });
  }));

  if (newSongAlbums) {
    for (let i = 0; i < newSongAlbums.length; i++) {
      await prisma.songs_albums.create({
        data: {
          song_id: +songData.song_id,
          album_id: newSongAlbums[i].album_id,
          track: +songData.track[i],
        },
      });
    }
  }

  const newSongGenres = songData.genres && await Promise.all(songData.genres.map(async (value) => {
    const foundGenres = await prisma.genres.findFirst({
      where: {
        name: {
          contains: value,
          mode: "insensitive",
        },
      },
    });

    if (foundGenres) {
      return foundGenres;
    }

    return await prisma.genres.create({
      data: {
        name: value,
      },
    });
  }));

  if (newSongGenres) {
    for (let i = 0; i < newSongGenres.length; i++) {
      await prisma.songs_genres.create({
        data: {
          song_id: +songData.song_id,
          id: newSongGenres[i].id,
        },
      });
    }
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
      song_id: +songData.song_id,
      language_id: origLangId?.language_id || 1,
      lyrics_text: songData.original,
      original: true,
    }
  });

  console.log(songData.lyrics_translation_langs)

  if (songData.lyrics_translation_langs &&
    songData.lyrics_translation_langs.length !== 0 &&
    (songData.lyrics_translation_langs.find(value => value === "english" || value === "russian"))
  ) {
    for (const value of songData.lyrics_translation_langs) {
      if (value === "english") {
        await prisma.songs_lyrics.create({
          data: {
            song_id: +songData.song_id,
            language_id: 1,
            lyrics_text: songData.english ?? "",
            original: false,
          }
        })
      } else if (value === "russian") {
        await prisma.songs_lyrics.create({
          data: {
            song_id: +songData.song_id,
            language_id: 11,
            lyrics_text: songData.russian ?? "",
            original: false,
          }
        })
      }
    }
  }



  const songDataImage: {
    title: string;
    artists: string;
    name: string;
    mood_id: number;
    release_date: Date;
    description?: string | undefined;
    bpm?: number;
    image?: string;
    file?: string;
  } = {
    title: songData.songs_title,
    artists: songData.songs_artists,
    name: songData.songs_name,
    mood_id: +songData.mood,
    release_date: new Date(songData.release_date),
    description: songData.description,
    bpm: Number(songData.bpm),
  };

  if (songData.title_image && !songData.title_image.name.includes("blob")) {
    songDataImage.image = imageName;
  }

  if (songData.orig_audio && !songData.orig_audio.name.includes("blob")) {
    songDataImage.file = imageName;
  }

  const songUpdateResult = await prisma.songs.update({
    where: {
      song_id: Number(songData.song_id),
    },
    data: {
      ...songDataImage,
    },
  });


  if (songData.url && songData.url.length > 0) {
    songData.url.forEach(async (value, ind) => {
      await prisma.links.create({
        data: {
          song_id: +songData.song_id,
          url: value,
          url_name: songData.url_name![ind],
          url_type: songData.url_type![ind],
        }
      })
    })
  }

  if (songData.title_image) {
    if (songData.title_image.size === 0) {
      return songData.title_image = undefined;
    }

    if (oldSongData?.image && oldSongData.image !== songData.title_image.name) {
      if (!process.env.NEXT_PUBLIC_BLOB_STORE_ID) {
        rm(path.join(process.cwd(), 'public/backgrounds/songs', oldSongData.image), (e) => {
          console.log(e)
        });
      } else {
        const savePath = `backgrounds/songs/${oldSongData.image}`;
        await del(savePath);
      }
    }

    const file = songData.title_image;
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    if (!process.env.NEXT_PUBLIC_BLOB_STORE_ID) {
      await writeFile(path.join(process.cwd(), 'public/backgrounds/songs', imageName), buffer, (e) => {
        console.log(e)
      })
    } else {
      const savePath = `backgrounds/songs/${imageName}`;
      await put(savePath, buffer, {
        access: 'public',
      });
    }
  }

  if (songData.orig_audio) {
    if (songData.orig_audio.size === 0) {
      return songData.orig_audio = undefined;
    }

    if (oldSongData?.file && oldSongData.file !== songData.orig_audio.name) {
      if (!process.env.NEXT_PUBLIC_BLOB_STORE_ID) {
        rm(path.join(process.cwd(), 'public/songs', oldSongData.file), (e) => {
          console.log(e)
        });
      } else {
        const savePath = `songs/${oldSongData.file}`;
        await del(savePath);
      }
    }

    const file = songData.orig_audio;
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    if (!process.env.NEXT_PUBLIC_BLOB_STORE_ID) {
      await writeFile(path.join(process.cwd(), 'public/songs', audioName), buffer, (e) => {
        console.log(e)
      })
    } else {
      const savePath = `songs/${audioName}`;
      await put(savePath, buffer, {
        access: 'public',
      });
    }
  }

  return JSON.parse(JSON.stringify(songUpdateResult));
}