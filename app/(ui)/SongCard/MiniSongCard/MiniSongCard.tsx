import clsx from "clsx";
import Image from "next/image"

interface MiniSongCardProps {
  song: {
    image: string | null;
    name: string;
    song_id: number;
  };
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
  className?: string;
}

const MiniSongCard: React.FC<MiniSongCardProps> = ({ song, peopleData, className }) => {
  if (!song) return null

  return (
    <a
      key={song.song_id}
      className={clsx("flex flex-row flex-wrap w-[calc(100%/2-16px)]", className)}
      href={`/songs/${song.song_id}`}
    >
      <Image
        src={song.image || song.image ? `/backgrounds/songs/${song.image}` : "/noimage2.svg"}
        alt={"обложка песни"}
        width={90}
        height={90}
      />
      <div className="my-2 ml-4">
        <div>{song?.name}</div>
        <div>{peopleData?.name}</div>
      </div>
    </a>
  );
}

export default MiniSongCard;