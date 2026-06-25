"use client"

import { Prisma, songs, users } from "@/src/generated/prisma/client";
import "./AlbumPage";
import s from "./AlbumPage.module.scss";
import Image from "next/image";
import clsx from "clsx";
import { FastAverageColor } from "fast-average-color";
import { useRef } from "react";
import formatDate from "../utils/formatDate";

export interface SongPageProps {
  albumType: {
    album_type: string;
    album_type_id: number;
  } | null;
  albumData: {
    image: string | null;
    id: number;
    name: string;
    author: string | null;
    release_date: Date | null;
    album_type: number | null;
    description: string | null;
  }
  tracklist: {
    songs: {
        image: string | null;
        title: string;
        user_id: number;
        name: string;
        release_date: Date;
        description: string | null;
        song_id: number;
        artists: string;
        addition_date: Date | null;
        file: string | null;
        mood_id: number;
        rank: string | null;
        bpm: number | null;
        bitrate_audio: bigint | null;
        track_gain: number | null;
    };
    track: number | null;
  }[];
  imageColor: string | undefined;
  imageValue: number[] | undefined;
}

const AlbumPage: React.FC<SongPageProps> = ({
  albumType,
  albumData,
  tracklist,
  imageColor,
  imageValue,
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
    <>
      <header className="flex items-center relative h-[330px]">
        <div className="relative flex flex-row max-w-[1376px] w-full mx-auto py-4 px-[42px]">
          {albumData.image &&
            <Image
              className="relative top-4 self-start mr-11 shadow-[rgba(0,0,0,0.18)_0px_0px_12px_0px]"
              src={albumData.image ? `/backgrounds/albums/${albumData.image}` : "/noimage2"}
              alt={"обложка"}
              width={340}
              height={340}
              style={{
                boxShadow: "rgba(0,0,0,0.18) 0px 0px 12px 0px",
              }}
            />}
            <div className="relative top-4 flex flex-col flex-1 text-white">
              <div className="text-yellow-200">Album</div>
              <div className="text-5xl mb-2">{albumData.name}</div>
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
      <div className="flex flex-row flex-wrap max-w-[1200px] mx-auto">
        {albumData && 
          (<div className="my-12 ml-8 pr-8 w-[60%]">
            <h3 className="text-[14px] mb-2 uppercase">{albumData.name} songs</h3>
            <div className="mb-2">
              {tracklist.sort((a, b) => {
                if (typeof(a.track) === "number" && typeof(b.track) === "number") {
                  return a.track - b.track;
                }
                
                return -1;
              }).map((track, ind, array) => {
                return (
                  <div key={track.songs.song_id} className={clsx("flex flex-row -ml-8 text-[18px]")}>
                    <span className="w-[16] flex text-center py-3.5">{track.track}.</span>
                    <a
                      key={track.songs.song_id}
                      className={clsx("block ml-4 flex-1 py-3.5", {
                        ["border-b-2 border-gray-300"]: ind !== array.length - 1,
                      })}
                      href={`/songs/${track.songs.song_id}`}
                    >
                      {track.songs.name}
                    </a>
                  </div>
                );
              })}
            </div>
          </div>)
        }
        <div className="w-[33%] my-12 pt-6 border-l-2 border-gray-300">
          <div className="flex flex-row items-baseline justify-between">
            <span className="pl-8">About</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 18" width="14px" height="14px">
              <path d="M0 0h18v18H0V0Z"></path>
              <path d="M3.857 8.143h10.286v1.714H3.857V8.143Z" fill="white"></path>
            </svg>
            {/* <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 18" width="14px" height="14px">
              <path d="M0 0h18v18H0V0Z"></path>
              <path d="M14.143 8.143H9.857V3.857H8.143v4.286H3.857v1.714h4.286v4.286h1.714V9.857h4.286V8.143Z" fill="white"></path>
            </svg> */}
          </div>
          <div className="text-[14px] mt-4 pl-8 pb-4 border-b-2 border-gray-300">{albumData.description}</div>
          <div className="my-8">
            <span className="pl-8">Album Info</span>
            <div className="flex flex-row gap-4 pl-8 mb-4 flex-nowrap text-[14px]">
              <span>Released on</span>
              <span>{formatDate(albumData.release_date)}</span>
            </div>
            <div className="flex flex-row gap-4 pl-8 mb-4 flex-nowrap text-[14px]">
              <span>Type</span>
              <span>{albumType?.album_type}</span>
            </div>
          </div>
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
            {albumData.description}
          </div>
          <hr className="max-w-[720px] my-16" />
        </div>
      </div>
    </>
  );
}

export default AlbumPage;
