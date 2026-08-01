"use client"

import Image from "next/image";
import clsx from "clsx";
import formatDate from "../utils/formatDate";
import Modal from "../ui/Modal/Modal";
import { useEffect, useState } from "react";
import MiniSongCard from "../SongCard/MiniSongCard/MiniSongCard";
import searchSongs from "@/app/actions/searchSongs/searchSongs";
import searchAlbums from "@/app/actions/searchAlbums/searchAlbums";
import MiniAlbumCard from "../AlbumCard/MiniAlbumCard/MiniAlbumCard";

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
    firstname?: string | null;
    surname?: string | null;
    nickname?: string | null;
    description: string | null;
    country_id: number | null;
    year_of_foundation?: number | null;
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
  type: "people" | "group";
}

const PeoplePage: React.FC<PeoplePageProps> = ({
  albums,
  peopleData,
  songs,
  country,
  type,
}) => {
  const [songsModalVisibility, setSongsModalVisibility] = useState(false);
  const [albumsModalVisibility, setAlbumsModalVisibility] = useState(false);
  const [search, setSearch] = useState("");
  const [searchAlbumsString, setSearchAlbumsString] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [songsSearchResults, setSongsSearchResults] = useState<{
    image: string | null;
    name: string;
    description: string | null;
    file: string | null;
    title: string;
    song_id: number;
    user_id: number;
    artists: string;
    addition_date: Date | null;
    release_date: Date;
    mood_id: number;
    rank: string | null;
    bpm: number | null;
    bitrate_audio: bigint | null;
    track_gain: number | null;
  }[]>([]);

  const [albumsSearchResults, setAlbumsSearchResults] = useState<{
    name: string;
    id: number;
    author: string | null;
    release_date: Date | null;
    album_type: number | null;
    description: string | null;
    image: string | null;
  }[]>([]);

  useEffect(() => {
    const foundSongs = async () => {
      if (!search) {
        return setSongsSearchResults([]);
      }

      const foundedSongs = await searchSongs(search, peopleData?.name, {
        page: 1,
        sort: "release_date",
        order: "asc"
      });
      if (Array.isArray(foundedSongs)) {
        setSongsSearchResults(foundedSongs);
      }
    };

    foundSongs();
  }, [search]);

  useEffect(() => {
    const foundSongs = async () => {
      if (!searchAlbumsString) {
        return setAlbumsSearchResults([]);
      }

      const foundedAlbums = await searchAlbums(searchAlbumsString, peopleData?.name, {
        page: 1,
        sort: "release_date",
        order: "asc"
      });
      if (Array.isArray(foundedAlbums)) {
        setAlbumsSearchResults(foundedAlbums);
      }
    };

    foundSongs();
  }, [searchAlbumsString]);

  useEffect(() => {
    if (peopleData?.image) {
      if (type === "people") {
        setImageURL(`/backgrounds/people/${peopleData.image}`);
      } else {
        setImageURL(`/backgrounds/groupes/${peopleData.image}`);
      }
    }
  }, []);

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
              src={peopleData.image && imageURL
                ? imageURL
                : "/noimage2.svg"
              }
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
      <div className="relative top-16 flex flex-row gap-17 w-300 max-w-300 mb-8">
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
                  <MiniSongCard
                    key={song.song_id}
                    song={{
                      song_id: song.song_id,
                      name: song.songs.name,
                      image: song.songs.image,
                    }}
                    peopleData={peopleData}
                  />
                )
              })}
              <button
                className="w-full h-10 border border-black rounded-[20px] text-[18px] cursor-pointer"
                type="button"
                onClick={() => setSongsModalVisibility(true)}
              >
                All songs by {peopleData?.name}
              </button>
              <Modal
                className="flex flex-row items-center justify-center h-full"
                isOpen={songsModalVisibility}
                onClose={() => setSongsModalVisibility(false)}
              >
                <div className="w-160 bg-white min-h-[calc(100vh-32px)] h-[calc(100vh-32px)] p-9">
                  <h2 className="text-[32px]">{peopleData?.name} Songs</h2>
                  <input
                    className="w-full px-3 py-2 mt-2"
                    type="text"
                    value={search}
                    placeholder={`Search ${peopleData?.name} songs`}
                    onInput={(e) => {
                      setSearch(e.currentTarget.value);
                    }}
                  />
                  <div className="flex flex-row flex-wrap gap-4 mt-4 overflow-auto">
                    {songsSearchResults.map(song => {
                      return (
                        <MiniSongCard
                          className="w-full overflow-auto"
                          key={song.song_id}
                          song={{
                            song_id: song.song_id,
                            name: song.name,
                            image: song.image,
                          }}
                          peopleData={peopleData}
                        />
                      )
                    })}
                  </div>
                </div>
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
                onClick={() => setAlbumsModalVisibility(true)}
              >
                All albums by {peopleData?.name}
              </button>
              <Modal
                className="flex flex-row items-center justify-center h-full"
                isOpen={albumsModalVisibility}
                onClose={() => setAlbumsModalVisibility(false)}
              >
                <div className="w-160 bg-white min-h-[calc(100vh-32px)] h-[calc(100vh-32px)] p-9">
                  <h2 className="text-[32px]">{peopleData?.name} Albums</h2>
                  <input
                    className="w-full px-3 py-2 mt-2"
                    type="text"
                    value={searchAlbumsString}
                    placeholder={`Search ${peopleData?.name} albums`}
                    onInput={(e) => {
                      setSearchAlbumsString(e.currentTarget.value);
                    }}
                  />
                  <div className="flex flex-row flex-wrap gap-4 mt-4 overflow-auto">
                    {albumsSearchResults.map(album => {
                      return (
                        <MiniAlbumCard
                          className="w-full overflow-auto"
                          key={album.id}
                          album={{
                            id: album.id,
                            name: album.name,
                            image: album.image,
                            release: album.release_date,
                          }}
                        />
                      )
                    })}
                  </div>
                </div>
              </Modal>
            </div>
          </div>}
        </div>
      </div>
    </div>
  );
}

export default PeoplePage;
