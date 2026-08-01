import clsx from "clsx";
import Image from "next/image"
import formatDate from "../../utils/formatDate";

interface MiniAlbumCardProps {
  album: {
    id: number,
    name: string,
    image: string | null,
    release: Date | null,
  };
  className?: string;
}

const MiniAlbumCard: React.FC<MiniAlbumCardProps> = ({ album, className }) => {
  if (!album) return null

  return (
    <a
      key={album.id}
      className={clsx("flex flex-row flex-wrap w-[calc(100%/2-16px)]", className)}
      href={`/albums/${album.id}`}
    >
      <Image
        src={album.image || album.image ? `/backgrounds/albums/${album.image}` : "/noimage2.svg"}
        alt={"обложка песни"}
        width={90}
        height={90}
      />
      <div className="my-2 ml-4">
        <div>{album?.name}</div>
        <div>{album.release === null ? "" : formatDate(album.release)}</div>
      </div>
    </a>
  );
}

export default MiniAlbumCard;