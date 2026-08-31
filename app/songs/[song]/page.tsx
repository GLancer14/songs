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

  let imageColor: string | undefined;
  let imageValue: number[] | undefined;

  if (songData?.image) {
    let color: FastAverageColorResult;
    if (!process.env.NEXT_PUBLIC_BLOB_STORE_ID) {
      if (!songData.image.includes("blob") || !songData.image === null) {
        color = (await getAverageColor(`./public/backgrounds/songs/${songData.image}`));
      } else if (album?.albums.image) {
        color = (await getAverageColor(`./public/backgrounds/albums/${album?.albums.image}`));
      } else {
        color = (await getAverageColor(`./public/noimage2.svg`));
      }
    } else {
      if (!songData.image.includes("blob") || !songData.image === null) {
        color = (await getAverageColor(`${process.env.NEXT_PUBLIC_STATIC_URL}/backgrounds/songs/${songData.image}`));
      } else if (album?.albums.image) {
        color = (await getAverageColor(`${process.env.NEXT_PUBLIC_STATIC_URL}/backgrounds/albums/${album?.albums.image}`));
      } else {
        color = (await getAverageColor(`${process.env.NEXT_PUBLIC_STATIC_URL}/noimage2.svg`));
      }
    }

    imageColor = color.rgb;
    imageValue = color.value;
  }

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
          songLinks={songLinks}
          userRole={userData.role}
        />
      </div>
      <Footer />
    </>
    
  )
}