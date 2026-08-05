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
import MiniAlbumCard from "../AlbumCard/MiniAlbumCard/MiniAlbumCard";
import Link from "next/link";

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
  album: {
    albums: {
      name: string;
      release_date: Date | null;
      description: string | null;
      image: string | null;
      id: number;
      author: string | null;
      album_type: number | null;
    };
  } | null;
  albumSongs: ({
    songs: {
      user_id: number;
      name: string;
      song_id: number;
      title: string;
      artists: string;
      addition_date: Date | null;
      release_date: Date;
      file: string | null;
      mood_id: number;
      rank: string | null;
      bpm: number | null;
      bitrate_audio: bigint | null;
      track_gain: number | null;
      description: string | null;
      image: string | null;
    };
  } & {
      song_id: number;
      id: number;
      track: number | null;
      disk: number | null;
  })[];
}

const SongPage: React.FC<SongPageProps> = ({
  songData,
  imageColor,
  imageValue,
  lyrics,
  album,
  albumSongs,
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
              <div className="flex items-center gap-2 text-xs mt-6 justify-self-end-safe">
                <svg width={10} height={10} xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 18">
                  <path d="M15.923 1.385h-2.77V0H11.77v1.385H6.231V0H4.846v1.385h-2.77c-.76 0-1.384.623-1.384 1.384v13.846c0 .762.623 1.385 1.385 1.385h13.846c.762 0 1.385-.623 1.385-1.385V2.77c0-.761-.623-1.384-1.385-1.384Zm0 15.23H2.077V6.923h13.846v9.692Zm0-11.077H2.077V2.77h2.77v1.385H6.23V2.769h5.538v1.385h1.385V2.769h2.77v2.77Z">
                  </path>
                </svg>
                {formatDate(songData.release_date)}
              </div>
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
        {album && <div className="max-w-300 w-full mx-auto text-white">
          <div
            key={album.albums.id}
            className={clsx("flex flex-row flex-wrap max-w-180 gap-14 items-center mb-11 ml-14")}
          >
            <Image
              className="shadow-[rgba(0,0,0,0.18)0px0px0.75rem0px]"
              src={album.albums.image || album.albums.image ? `/backgrounds/albums/${album.albums.image}` : "/noimage2.svg"}
              alt={"обложка песни"}
              width={250}
              height={250}
            />
            <div>
              <Link
                className="text-[18px]"
                href={`/albums/${album.albums.id}`}
              >
                {album?.albums.name}
              </Link>
              <div
                className="text-[14px] underline"
              >
                {album.albums.author}
              </div>
            </div>
          </div>
          </div>
        }
        {albumSongs && (() => {
          const sortedAlbums = albumSongs.sort((a, b) => {
            if (a.track && b.track) {
              return a.track - b.track
            } else {
              return 0;
            }
          });

          const half = Math.ceil(sortedAlbums.length / 2);
          const firstColumn = sortedAlbums.slice(0, half);
          const secondColumn = sortedAlbums.slice(half);

          return (
            <div className="max-w-300 w-full mx-auto text-white text-[14px]">
              <div className={clsx("grid grid-cols-2 mt-4 max-w-180")}>
                <div className="flex flex-col gap-y-2">
                  {firstColumn.map((albumSong) => (
                    <div
                      className={clsx("relative flex flex-row overflow-hidden w-fit px-4 py-2", {
                        [s.albumSong]: songData.song_id === albumSong.songs.song_id,
                      })}
                      key={albumSong.id}
                    >
                      <span className="mr-2 min-w-5">{albumSong.track}.</span>
                      {songData.song_id !== albumSong.songs.song_id
                        ? <Link
                          href={`/songs/${albumSong.songs.song_id}`}
                          className="truncate underline"
                        >
                          {albumSong.songs.name}
                        </Link>
                        : <span className="truncate">{albumSong.songs.name}</span>
                      }
                    </div>
                  ))}
                </div>
                
                <div className="flex flex-col gap-y-2">
                  {secondColumn.map((albumSong) => (
                    <div className={clsx("relative flex flex-row overflow-hidden w-fit px-4 py-2", {
                        [s.albumSong]: songData.song_id === albumSong.songs.song_id,
                      })}
                      key={albumSong.id}
                    >
                      <span className="mr-2 min-w-5">{albumSong.track}.</span>
                      {songData.song_id !== albumSong.songs.song_id
                        ? <Link
                          href={`/songs/${albumSong.songs.song_id}`}
                          className="truncate underline"
                        >
                          {albumSong.songs.name}
                        </Link>
                        : <span className="truncate">{albumSong.songs.name}</span>
                      }
                    </div>
                  ))}
                </div>
              </div>
              <hr className="max-w-180 w-full text-white my-16" />
            </div>
          )
        })()}
      </div>
    </div>
  );
}

export default SongPage;
