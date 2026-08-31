"use server"

import { Suspense } from "react"
import EditSong from "../../(ui)/EditSong/EditSong"
import userIam from "../../actions/userIam"
import { prisma } from "../../lib/prisma"
import Loading from "./loading"
import { creators, dataGroupes, requiredFields } from "../../lib/searchFields"

const Page = async ({
  params,
}: {
  params: Promise<{ song: number }>
}) => {
  const lyricsLanguages = ["original", "english", "russian"];
  const user = await userIam()
  const languages = (await prisma.languages.findMany()).map(language => language.lang);
  const moods = await prisma.mood.findMany();
  const { song } = await params;

  const songData = await prisma.songs.findFirst({
    where: {
      song_id: +song,
    },
  });
  
  const lyrics = await prisma.songs_lyrics.findMany({
    where: {
      song_id: songData?.song_id,
    },
    select: {
      languages: true,
      lyrics_text: true,
    }
  });
  
  const album = await prisma.songs_albums.findFirst({
    where: {
      song_id: songData?.song_id,
    },
    select: {
      albums: true,
    }
  });
  
  
  let albumSongs: any[];
  if (album) {
    albumSongs = await prisma.songs_albums.findMany({
      where: {
        id: album?.albums.id,
      },
      include: {
        songs: true,
      }
    });
  } else {
    albumSongs = [];
  }
  
  const group = await prisma.songs_groupes.findMany({
    where: {
      song_id: +song
    },
    select: {
      groupes: {
        select: {
          id: true,
          name: true,
          description: true,
          image: true,
          groupesType: {
            select: {
              type: true,
            },
          },
        },
      },
    },
  });
  
  const people = await prisma.songs_people.findMany({
    where: {
      song_id: +song
    },
    select: {
      people: {
        select: {
          id: true,
          nickname: true,
          description: true,
          image: true,
          peopleType: {
            select: {
              type: true,
            },
          },
        },
      },
    },
  });
  
  const songLinks = await prisma.links.findMany({
    where: {
      song_id: songData?.song_id,
    },
  })

  return (
    <Suspense fallback={<Loading />}>
      <EditSong
        user={user}
        languages={languages}
        moods={moods}
        creators={creators}
        dataGroupes={dataGroupes}
        requiredFields={requiredFields}
        lyricsLanguages={lyricsLanguages}
        edit={user?.role === "admin"}
      />
    </Suspense>
  )
}

export default Page;