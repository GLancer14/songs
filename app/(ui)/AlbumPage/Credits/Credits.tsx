import { useEffect, useState } from "react";
import ShowButton from "../../ui/ShowButton/ShowButton";
import clsx from "clsx";
import formatDate from "../../utils/formatDate";

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
  songsPeople: ({
    people: {
        peopleType: ({
            type: {
                name: string;
                type_id: number;
            };
        } & {
            id: number;
            type_id: number;
        })[];
    } & {
        name: string;
        id: number;
        description: string | null;
        image: string | null;
        firstname: string | null;
        surname: string | null;
        nickname: string | null;
        country_id: number | null;
    };
} & {
    id: number;
    song_id: number;
})[][];
}

const Credits: React.FC<CreditsProps> = ({
  albumData,
  songs,
  songsPeople,
}) => {
  const [showSongCreadits, setShowSongCredits] = useState<Array<{
    song_id: number;
    isShowing: boolean;
  }>>([]);
  const [showTitle, setShowTitle] = useState(false);

  useEffect(() => {
    setShowSongCredits(() => {
      return songs.map(song => {
        return {
          song_id: song.songs.song_id,
          isShowing: false,
        }
      })
    })
  }, [songs])

  return (
    <div className="border">
      {albumData &&
        (<div className="border-b">
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
            const people = songsPeople.flat(2).filter(value => value.song_id === song.songs.song_id);
            console.log(people)

            return (
              <div className={clsx({
                ["border-b"]: ind !== array.length - 1,
              })}>
                <div key={song.songs.song_id} className={clsx("flex flex-row text-[18px]", )}>
                  <span className="w-[16] ml-4 flex text-center py-3.5">{song.track}.</span>
                  <span
                    key={song.songs.song_id}
                    className={clsx("block ml-4 flex-1 py-3.5", )}
                  >
                    {song.songs.name}
                  </span>
                  <button>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M24 10h-10v-10h-4v10h-10v4h10v10h4v-10h10z"></path>
                    </svg>
                    <svg width="24" height="24" viewBox="0 0 24 24">
                      <path d="M0 10h24v4h-24z"></path>
                    </svg>
                  </button>
                </div>
                <div className="flex flex-row">
                  <div className="w-1/2">
                    <div>Released on</div>
                    <div>{formatDate(song.songs.release_date)}</div>
                  </div>
                  {people.map(peopleType => {
                    return (<div>
                      {peopleType.people.name}
                    </div>)
                  })}
                </div>
              </div>
            );
          })}
        </div>)
      }

    </div>
  )
};

export default Credits;