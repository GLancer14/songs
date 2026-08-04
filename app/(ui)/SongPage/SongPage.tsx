"use client"

import { Prisma, songs, users } from "@/src/generated/prisma/client";
import "./SongPage";
import s from "./SongPage.module.scss";
import Image from "next/image";
import clsx from "clsx";
import { FastAverageColor } from "fast-average-color";
import { useRef, useState } from "react";
import formatDate from "../utils/formatDate";
import ShowButton from "../ui/ShowButton/ShowButton";
import About from "../ui/About/About";

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
  const [showAbout, setShowAbout] = useState(true);
  const [showAlbumInfo, setShowAlbumInfo] = useState(false);
  const staticURL = !process.env.BLOB_STORE_ID ? "" : process.env.STATIC_URL;
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
      <header className="flex items-center relative h-82.5">
        <div className="relative flex flex-row max-w-344 w-full mx-auto py-4">
          {songData.image &&
            <Image
              className="relative top-4 self-start mr-11 shadow-[rgba(0,0,0,0.18)_0px_0px_12px_0px]"
              src={songData.image
                ? `${staticURL}/backgrounds/songs/${songData.image}`
                : "/noimage2"}
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
      

      <div className="flex flex-row flex-wrap max-w-300 w-300 self-center">
        <div className="w-180 mx-auto">
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
          <div className="w-100 my-12 pt-6 border-l-2 border-gray-300">
            <div className="flex flex-column flex-wrap items-baseline justify-between border-b-2 border-gray-300">
              <div className="flex flex-row justify-between text-[16px] pl-8 pb-4 w-full">
                About
                <ShowButton show={showAbout} setShow={setShowAbout} />
              </div>
              <About
                type="Songs"
                showAbout={showAbout}
                aboutText={songData.description}
              />
            </div>
      
            <div className="mt-8">
              <div className="flex flex-row items-baseline justify-between">
                <div className="text-[16px] pl-8">Song Info</div>
                <ShowButton show={showAlbumInfo} setShow={setShowAlbumInfo} />
              </div>
              <div
                className={clsx("text-[14px] mt-4 pl-8 pb-4", {
                  ["block"]: showAlbumInfo,
                  ["hidden"]: !showAlbumInfo,
                })}
              >
                <div className="flex flex-row gap-4 mb-4 flex-nowrap text-[14px]">
                  <span>Released on</span>
                  <span>{formatDate(songData.release_date)}</span>
                </div>
                <div className="flex flex-row gap-4 mb-4 flex-nowrap text-[14px]">
                  <span>Mood</span>
                  <span>{songData?.mood_id}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      <div
        style={{
          background: `linear-gradient(${imageColor}, ${imageColorMinusValue})`,
        }}
      >
        <div className="max-w-300 w-full mx-auto text-white">
          <h2 className="capitalize text-[90px] max-w-180 text-center">about</h2>
          <div className="max-w-180">
            {songData.description}
          </div>
          <hr className="max-w-180 my-16" />
        </div>
      </div>
    </div>
  );
}

export default SongPage;
