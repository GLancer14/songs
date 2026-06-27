import { useState } from "react";
import ShowButton from "../../ui/ShowButton/ShowButton";
import clsx from "clsx";

interface CreditsProps {
  albumData: {
    image: string | null;
    id: number;
    name: string;
    author: string | null;
    release_date: Date | null;
    album_type: number | null;
    description: string | null;
  };
  songs: {
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
  songsPeople: Promise<{
    song_id: number;
    people: {
      id: number;
      name: string;
      description: string | null;
      image: string | null;
      firstname: string | null;
      surname: string | null;
      nickname: string | null;
      country_id: number | null;
    };
  }[][]>
}

const Credits: React.FC<CreditsProps> = ({
  albumData,
  songs,
  songsPeople,
}) => {
  const songsShowing = songs.map(song => {
    return {
      song_id: song.songs.song_id,
      isShowing: false,
    }
  })
  const [showTitle, setShowTitle] = useState(false);
  const [showSongs, setShowSongs] = useState(songsShowing);

  return (
    <div className="grid">
      {albumData &&
        (<div>
          <span></span>
          <span>{albumData.name}</span>
          <ShowButton
            show={showTitle}
            setShow={setShowTitle}
          />
          <div className={clsx({
            ["block"]: showTitle,
            ["hidden"]: !showTitle,
          })}>
            <span>{albumData.author}</span>
          </div>
        </div>)
      }
      {songs &&
        (<div>
          {songs.sort((a, b) => {
            if (typeof(a.track) === "number" && typeof(b.track) === "number") {
              return a.track - b.track;
            }
            
            return -1;
          }).map((song, ind, array) => {
            return (
              <div key={song.songs.song_id} className={clsx("flex flex-row -ml-8 text-[18px]")}>
                <span className="w-[16] flex text-center py-3.5">{song.track}.</span>
                <a
                  key={song.songs.song_id}
                  className={clsx("block ml-4 flex-1 py-3.5", {
                    ["border-2 border-gray-300"]: ind !== array.length - 1,
                  })}
                  href={`/songs/${song.songs.song_id}`}
                >
                  {song.songs.name}
                </a>
                <ShowButton
                  show={showSongs.find(songShow => songShow.song_id === song.songs.song_id)?.isShowing || null}
                  setShow={setShowSongs}
                />
              </div>
            );
          })}
        </div>)
      }

    </div>
  )
};

export default Credits;