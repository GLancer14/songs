"use server"

import { Suspense } from "react"
import EditSong from "@/app/(ui)/EditSong/EditSong"
import userIam from "@/app/actions/userIam"
import { prisma } from "@/app/lib/prisma"
import Loading from "./loading"
import { creators, dataGroupes, requiredFields } from "@/app/lib/searchFields"

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
      original: true,
    }
  });
  
  const albums = await prisma.songs_albums.findMany({
    where: {
      song_id: songData?.song_id,
    },
    include: {
      albums: true,
    }
  });

  const genres = await prisma.songs_genres.findMany({
    where: {
      song_id: +song
    },
    include: {
      genres: true,
    }
  })
  
  let albumSongs: ({
    songs: {
      user_id: number;
      name: string;
      mood_id: number;
      song_id: number;
      title: string;
      artists: string;
      addition_date: Date | null;
      release_date: Date;
      file: string | null;
      rank: string | null;
      bpm: number | null;
      bitrate_audio: bigint | null;
      track_gain: number | null;
      description: string | null;
      image: string | null;
    };
  } & {
    song_id: number;
    album_id: number;
    track: number | null;
    disk: number | null;
  })[];

  if (albums.length > 0) {
    const earlierAlbum = albums.map(album => {
      return {
        ...album.albums,
        release_date: album.albums.release_date ? album.albums.release_date.getTime() : 0,
      }
    });
    const minDate = Math.min(...earlierAlbum.map(album => album.release_date));

    albumSongs = await prisma.songs_albums.findMany({
      where: {
        album_id: earlierAlbum.find(album => album.release_date === minDate)?.album_id,
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
    include: {
      groupes: true,
      type: true,
    },
  });
  
  const people = await prisma.songs_people.findMany({
    where: {
      song_id: +song
    },
    include: {
      people: true,
      type: true,
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
        songData={songData}
        lyrics={lyrics}
        albums={albums}
        group={group}
        people={people}
        songLinks={songLinks}
        genres={genres}
      />
    </Suspense>
  )
}

export default Page;