import { Prisma } from "@/src/generated/prisma/client";
import s from "./SongCard.module.scss";
import Image from "next/image";
import Link from "next/link";

const SongCard = ({ songData }: { songData: Prisma.songsModel }) => {
  const staticURL = !process.env.NEXT_PUBLIC_BLOB_STORE_ID ? "" : process.env.NEXT_PUBLIC_STATIC_URL;
  
  return (
    <Link href={`/songs/${songData.song_id}`} className={s.songBanner}>
      <Image
        className={s.songBanner_image}
        src={songData.image
            ? `${staticURL}/backgrounds/songs/${songData.image}`
            : `${staticURL}/noimage2`}
        alt={songData.image ?? "image"}
        loading="lazy"
        width={200}
        height={200}
      />
      <div className={s.songBanner_title}>{songData.title}</div>
      <div className={s.songBanner_artists}>{songData.artists}</div>
    </Link>
  );
};

export default SongCard;