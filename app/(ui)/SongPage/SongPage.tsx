"use client"

import { Prisma, songs, users } from "@/src/generated/prisma/client";
import "./SongPage";
import s from "./SongPage.module.scss";
import Image from "next/image";
import clsx from "clsx";
import { FastAverageColor } from "fast-average-color";
import { useRef } from "react";

const SongPage = ({ songData }: { songData: songs }) => {
  const imgRef = useRef(null)
  const fac = new FastAverageColor();
  const imageColor = imgRef && fac.getColor(imgRef.current).rgba;

  return (
    <div className="flex flex-col">
      <header className="flex items-center relative h-[290px]">
        <div className="relative flex flex-row w-[1200px] mx-auto">
          {songData.image &&
            <Image
              className="relative top-14 border-white border-2 self-start mr-11 shadow-[rgba(0,0,0,0.18)_0px_0px_12px_0px]"
              src={`/backgrounds/songs/${songData.image}`}
              alt={"обложка"}
              width={340}
              height={340}
              ref={imgRef}
            />}
            <div className="relative top-14 flex flex-col flex-1 text-white">
              <div className="text-3xl mb-2">{songData.name}</div>
              <div className="text-4 underline">{songData.artists}</div>
              <div className="text-xs mt-6">Producer</div>
            </div>
        </div>
        <div className={clsx(`
          absolute
          w-full
          h-full
          top-0
          left-0
          bg-[${imageColor}]
          bg-cover
          bg-no-repeat bg-center
          z-[-1]
        `, s.header)}></div>
      </header>
      <div className="w-[1200px] mx-auto">
      </div>
      
    </div>
  );
}

export default SongPage;
