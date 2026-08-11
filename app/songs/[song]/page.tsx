"use server";

import { Profile } from "../../(ui)/Profile/Profile"
import userIam from "../../actions/userIam"
import { Suspense } from "react";
import Header from "../../(ui)/Header/Header";
import Footer from "../../(ui)/Footer/Footer";
import { prisma } from "../../lib/prisma";
import SongPage from "../../(ui)/SongPage/SongPage";
import { getAverageColor } from "fast-average-color-node";
import path from "path";
import { FastAverageColorResult } from "fast-average-color";

export default async function Page({
  params,
}: {
  params: Promise<{ song: number }>
}) {
  const { song } = await params;

  const userData = await userIam();
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

  const albumSongs = await prisma.songs_albums.findMany({
    where: {
      id: album?.albums.id,
    },
    include: {
      songs: true,
    }
  })

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

  let imageColor: string | undefined;
  let imageValue: number[] | undefined;

  if (songData?.image) {
    let color: FastAverageColorResult;
    if (!process.env.BLOB_STORE_ID) {
      color = (await getAverageColor(`./public/backgrounds/songs/${songData.image}`));
    } else {
      color = (await getAverageColor(`${process.env.STATIC_URL}/backgrounds/songs/${songData.image}`));
    }

    imageColor = color.rgb;
    imageValue = color.value;
  }
  // if (songData?.image) {
  //   try {
  //     const imagePath = path.join(process.cwd(), 'public', 'backgrounds', 'songs', songData.image);
  //     const color = await getAverageColor(imagePath);
  //     imageColor = color.rgb;
  //     imageValue = color.value;
  //   } catch (error) {
  //     console.error('Failed to get average color for image:', songData.image, error);

  //     imageColor = 'rgb(128, 128, 128)'; // серый по умолчанию
  //     imageValue = [128, 128, 128];
  //   }
  // }

  if (!userData) return null;

  return (
    <>
      <Header user={userData} imageColor={imageColor} />
      <div className="flex flex-col flex-1">
        <SongPage
          songData={songData!}
          imageColor={imageColor}
          imageValue={imageValue}
          lyrics={lyrics}
          album={album}
          albumSongs={albumSongs}
          group={group}
          people={people}
        />
      </div>
      <Footer />
    </>
    
  )
}