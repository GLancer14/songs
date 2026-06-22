"use client"

import { Prisma, songs, users } from "@/src/generated/prisma/client";
import "./SongPage";
import s from "./SongPage.module.scss";
import Image from "next/image";
import clsx from "clsx";
import { FastAverageColor } from "fast-average-color";
import { useRef } from "react";
import formatDate from "../utils/formatDate";

export interface SongPageProps {
  songData: songs;
  imageColor?: string;
  imageValue?: number[];
  lyrics?: Array<{ 
    lyrics_text: string;
    languages: {
      language_id: number;
      lang: string;
    };
  }>;
}

const SongPage: React.FC<SongPageProps> = ({
  songData,
  imageColor,
  imageValue,
  lyrics,
}) => {
  const imgRef = useRef(null);
  let imageColorMinus;
  let imageColorMinusValue;

  if (imageValue) {
    imageColorMinus = imageValue.map(value => {
      return Math.round(value * 0.7);
    });

    imageColorMinusValue = `rgb(${imageColorMinus[0]},${imageColorMinus[1]},${imageColorMinus[2]})`;
  }

  return (
    <div className="flex flex-col">
      <header className="flex items-center relative h-[330px]">
        <div className="relative flex flex-row max-w-[1376px] w-full mx-auto py-4">
          {songData.image &&
            <Image
              className="relative top-4 self-start mr-11 shadow-[rgba(0,0,0,0.18)_0px_0px_12px_0px]"
              src={`/backgrounds/songs/${songData.image}`}
              alt={"обложка"}
              width={340}
              height={340}
              ref={imgRef}
              style={{
                boxShadow: "rgba(0,0,0,0.18) 0px 0px 12px 0px",
              }}
            />}
            <div className="relative top-4 flex flex-col flex-1 text-white">
              <div className="text-3xl mb-2">{songData.name}</div>
              <div className="text-4 underline">{songData.artists}</div>
              <div className="text-xs mt-6">Producer</div>
              <div className="text-xs mt-6 justify-self-end-safe">{formatDate(songData.release_date)}</div>
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
        <div>
          {lyrics && lyrics.map((lyric, ind, array) => {
            return (
              <div key={ind} className="whitespace-pre mt-12 mb-12 text-[20px]">
                {lyric.lyrics_text}
              </div>
            )
          })}
        </div>
      </div>
      <div
        style={{
          background: `linear-gradient(${imageColor}, ${imageColorMinusValue})`,
        }}
      >
        <div className="max-w-[1200px] w-full mx-auto text-white">
          <h2 className="capitalize text-[90px] max-w-[720px] text-center">about</h2>
          <div className="max-w-[720px]">
            {songData.description}
          </div>
          <hr className="max-w-[720px] my-16" />
        </div>
      </div>
    </div>
  );
}

export default SongPage;
