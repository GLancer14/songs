"use client"

import { Prisma } from "@/src/generated/prisma/client";
import s from "./SongCard.module.scss";

const SongCard = ({ songData }: { songData: Prisma.songsModel }) => {
  
  return (
    // <div className="w-[50%]">
      <div>
        <a href={`/songs/${songData.song_id}`} className={s.songBanner}>
          <img
            className={s.songBanner_image}
            src={`/backgrounds/songs/${songData.image}`}
            alt={songData.image ?? "image"}
            loading="lazy"
            width={200}
            height={200}
          />
          <div className={s.songBanner_title}>{songData.title}</div>
          <div className={s.songBanner_artists}>{songData.artists}</div>
        </a>
      </div>
    // </div>
  );
};

export default SongCard;