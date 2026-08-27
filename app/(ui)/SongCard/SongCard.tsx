"use client";

import { Prisma } from "@/src/generated/prisma/client";
import s from "./SongCard.module.scss";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import searchAlbum from "@/app/actions/searchAlbum/searchAlbum";

const SongCard = ({ songData }: { songData: Prisma.songsModel }) => {
  const staticURL = !process.env.NEXT_PUBLIC_BLOB_STORE_ID ? "" : process.env.NEXT_PUBLIC_STATIC_URL;
  const [songsAlbum, setSongsAlbum] = useState<{
    albums: {
        name: string;
        id: number;
        release_date: Date | null;
        description: string | null;
        image: string | null;
        author: string | null;
        album_type: number | null;
    }
    status: "ok";
} | null>(null);

  useEffect(() => {
    const getSongsAlbum = async () => {
      if (songData.song_id) {
        const album = await searchAlbum(songData.song_id)
        if (album && album.status === "ok") {
          setSongsAlbum(album)
        }
      }
    }
    
    getSongsAlbum();
  }, [songData]);
  
  return (
    <Link href={`/songs/${songData.song_id}`} className={s.songBanner}>
      {songData.image && songsAlbum && <Image
        className={s.songBanner_image}
        src={
          !songData.image.includes("blob") || songData.image === null
            ? `${staticURL}/backgrounds/songs/${songData.image}`
            : songsAlbum?.albums.image 
              ? `${staticURL}/backgrounds/albums/${songsAlbum?.albums.image}`
              : `${staticURL}/noimage2`
        }
        alt={songData.image ?? "image"}
        loading="lazy"
        width={200}
        height={200}
      />}
      <div className={s.songBanner_title}>{songData.title}</div>
      <div className={s.songBanner_artists}>{songData.artists}</div>
    </Link>
  );
};

export default SongCard;