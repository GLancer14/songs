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

  let imageColor: string | undefined;
  let imageValue: number[] | undefined;
  if (songData?.image) {
    const color = (await getAverageColor(`./public/backgrounds/songs/${songData.image}`));
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
        />
      </div>
      <Footer />
    </>
    
  )
}