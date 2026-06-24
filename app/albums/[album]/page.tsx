"use server";

import userIam from "../../actions/userIam"
import Header from "../../(ui)/Header/Header";
import Footer from "../../(ui)/Footer/Footer";
import { prisma } from "../../lib/prisma";
import Image from "next/image";
import formatDate from "@/app/(ui)/utils/formatDate";
import clsx from "clsx";
import { getAverageColor } from "fast-average-color-node";
import s from "./page.module.scss";

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
  const tracklist = await prisma.songs_albums.findMany({
    where: {
      id: +album,
    },
    select: {
      songs: true
    }
  })
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
      <header className="flex items-center relative h-[330px]">
        <div className="relative flex flex-row max-w-[1376px] w-full mx-auto py-4">
          {albumData.image &&
            <Image
              className="relative top-4 self-start mr-11 shadow-[rgba(0,0,0,0.18)_0px_0px_12px_0px]"
              src={`/backgrounds/albums/${albumData.image}`}
              alt={"обложка"}
              width={340}
              height={340}
              style={{
                boxShadow: "rgba(0,0,0,0.18) 0px 0px 12px 0px",
              }}
            />}
            <div className="relative top-4 flex flex-col flex-1 text-white">
              <div>Album</div>
              <div className="text-3xl mb-2">{albumData.name}</div>
              <div className="text-4 underline">{albumData.author}</div>
              <div className="text-xs mt-6">Producer</div>
              <div className="text-xs mt-6 justify-self-end-safe">{formatDate(albumData.release_date)}</div>
            </div>
        </div>
        <div
          className={clsx(`
            absolute
            w-full
            h-full
            top-0
            left-0
            bg-cover
            bg-no-repeat bg-center
            z-[-1]
          `, s.header)}
          style={{
            background: `linear-gradient(${imageColor}, ${imageColorMinusValue})`,
          }}
        ></div>
      </header>
      <div className="w-[1200px] mx-auto">
        {albumData && 
          (<div>
            <div>
              <h3>Tracklist</h3>
              {tracklist.map(track => {
                return (
                  <a
                    className="block"
                    href={`/songs/${track.songs.song_id}`}
                  >
                    {track.songs.name}
                  </a>
                );
              })}
            </div>
          </div>)
        }
      </div>
      <div
        style={{
          background: `linear-gradient(${imageColor}, ${imageColorMinusValue})`,
        }}
      >
        <div className="max-w-[1200px] w-full mx-auto text-white">
          <h2 className="capitalize text-[90px] max-w-[720px] text-center">about</h2>
          <div className="max-w-[720px]">
            {albumData.description}
          </div>
          <hr className="max-w-[720px] my-16" />
        </div>
      </div>
      <Footer />
    </>
    
  )
}