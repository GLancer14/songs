"use client"

import Image from "next/image";
import clsx from "clsx";
import formatDate from "../utils/formatDate";
import Modal from "../ui/Modal/Modal";
import { useState } from "react";

export interface PeoplePageProps {
  albums: {
    image: string | null;
    name: string;
    id: number;
    description: string | null;
    author: string | null;
    release_date: Date | null;
    album_type: number | null;
  }[];
  peopleData: {
    image: string | null;
    id: number;
    name: string;
    firstname: string | null;
    surname: string | null;
    nickname: string | null;
    description: string | null;
    country_id: number | null;
  } | null;
  songs: ({
    songs: {
      image: string | null;
      title: string;
      user_id: number;
      name: string;
      description: string | null;
      song_id: number;
      release_date: Date;
      artists: string;
      addition_date: Date | null;
      file: string | null;
      mood_id: number;
      rank: string | null;
      bpm: number | null;
      bitrate_audio: bigint | null;
      track_gain: number | null;
    };
  } & {
      id: number;
      song_id: number;
  })[];
  country: {
    country_id: number;
    country: string;
  } | null;
}

const PeoplePage: React.FC<PeoplePageProps> = ({
  albums,
  peopleData,
  songs,
  country,
}) => {

  const [modalVisibility, setModalVisibility] = useState(false)
  return (
    <div className="flex flex-col flex-1 items-center">
      <header
        className={`flex items-center relative h-82.5 w-full justify-center bg-no-repeat bg-cover bg-center`}
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.5) 100%), url(/backgrounds/people/${peopleData?.image})`,
        }}
      >
        <div className="relative colum flex flex-row max-w-344 w-344 py-4 px-10.5">
          {peopleData && peopleData.image &&
            <Image
              className="relative top-12 self-start mr-11 border-4 border-white rounded-[50%] object-cover object-center w-85 h-85"
              src={peopleData.image ? `/backgrounds/people/${peopleData.image}` : "/noimage2.svg"}
              alt={"обложка"}
              width={340}
              height={340}
            />}
            <div className="relative top-4 flex flex-col flex-1 justify-end-safe text-white">
              <div className="text-[90px] mb-2">{peopleData?.name}</div>
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
            bg-no-repeat
            bg-center
            z-[-1]
          `)}
        ></div>
      </header>
      <div className="relative top-16 flex flex-row gap-17 w-300 max-w-300">
        <div className="w-130 max-w-130">
          <h3 className="text-center text-[40px]">About</h3>
          {peopleData?.description}
        </div>
        <div className="w-263 max-w-263">
          <div>
            <h3 className="text-[22.5px] font-medium">Songs</h3>
            <div className="flex flex-row flex-wrap gap-4 border-gray-300 border-2 p-7">
              {songs.map(song => {
                return (
                  <a
                    key={song.song_id}
                    className="flex flex-row flex-wrap w-[calc(100%/2-16px)]"
                    href={`/songs/${song.song_id}`}
                  >
                    <Image
                      src={song.songs.image ? `/backgrounds/songs/${song.songs.image}` : "/noimage2.svg"}
                      alt={"обложка песни"}
                      width={90}
                      height={90}
                    />
                    <div className="my-2 ml-4">
                      <div>{song.songs.name}</div>
                      <div>{peopleData?.name}</div>
                    </div>
                  </a>
                )
              })}
              <button
                className="w-full h-10 border border-black rounded-[20px] text-[18px] cursor-pointer"
                type="button"
                onClick={() => {
                  setModalVisibility(true)
                }}
              >
                All songs by {peopleData?.name}
              </button>
              <Modal
                isOpen={modalVisibility}
                onClose={() => setModalVisibility(false)}
              >
                <div>Modal</div>
              </Modal>
            </div>
          </div>
          {albums.length > 0 && <div>
            <h3 className="mt-9 text-[22.5px] font-medium">Albums</h3>
            <div className="flex flex-row flex-wrap gap-4 border-gray-300 border-2 p-7">
              {albums.map(album => {
                return (
                  <a
                    key={album.id}
                    className="flex flex-column flex-wrap w-[calc(100%/3-11px)]"
                    href={`/albums/${album.id}`}
                  >
                    <Image
                      className="w-full"
                      src={album.image ? `/backgrounds/albums/${album.image}` : "/noimage2.svg"}
                      alt={"обложка песни"}
                      width={300}
                      height={300}
                    />
                    <div className="w-full my-2 text-center">
                      <div>{album.name}</div>
                      <div className="text-[12px]">{formatDate(album.release_date)}</div>
                    </div>
                  </a>
                )
              })}
              <button
                className="w-full h-10 border border-black rounded-[20px] text-[18px] cursor-pointer"
                type="button"
              >
                All albums by {peopleData?.name}
              </button>
            </div>
          </div>}
        </div>
      </div>
    </div>
  );
}

export default PeoplePage;
