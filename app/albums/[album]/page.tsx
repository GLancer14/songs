"use server";

import userIam from "../../actions/userIam"
import Header from "../../(ui)/Header/Header";
import Footer from "../../(ui)/Footer/Footer";
import { prisma } from "../../lib/prisma";
import { getAverageColor } from "fast-average-color-node";
import AlbumPage from "@/app/(ui)/AlbumPage/AlbumPage";

export default async function Page({
  params,
}: {
  params: Promise<{ album: number }>
}) {
  const { album } = await params;
  const userData = await userIam();
  const albumData = await prisma.albums.findFirst({
    where: {
      id: +album,
    },
  });

  const albumType = await prisma.album_types.findFirst({
    where: {
      album_type_id: +album,
    },
  });

  const tracklist = await prisma.songs_albums.findMany({
    where: {
      id: +album,
    },
    select: {
      songs: true,
      track: true,
    }
  });

  let imageColor: string | undefined;
  let imageValue: number[] | undefined;
  if (albumData?.image) {
    const color = (await getAverageColor(`./public/backgrounds/albums/${albumData.image}`));
    imageColor = color.rgb;
    imageValue = color.value;
  }

  let imageColorMinus;
  let imageColorMinusValue;
  
  if (imageValue) {
    imageColorMinus = imageValue.map(value => {
      return Math.round(value * 0.7);
    });

    imageColorMinusValue = `rgb(${imageColorMinus[0]},${imageColorMinus[1]},${imageColorMinus[2]})`;
  }

  if (!userData) return null;
  if (!albumData) return null;
 
  return (
    <>
      <Header user={userData} imageColor={imageColor} />
      <div className="flex flex-col flex-1 items-center">
        <AlbumPage
          albumType={albumType}
          albumData={albumData}
          tracklist={tracklist}
          imageColor={imageColor}
          imageValue={imageValue}
        />
      </div>
      <Footer />
      
    </>
    
  )
}