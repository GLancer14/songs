"use client"

import { Prisma } from "@/src/generated/prisma/client";
import Image from "next/image";
import { useState } from "react";

const SongCard = ({ songData }: { songData: Prisma.songsModel }) => {
  const [listVisibility, setListVisibility] = useState(false);
  const server = process.env.SERVER_URL || "http://localhost:3000";
  console.log(songData.image)
  return (
    <div className="w-[50%]">
      <div className="song-banner">
        <a href={`/songs/${songData.song_id}`} className="song-banner_anchor">
          <img
            className="song-banner_image"
            src={`/backgrounds/songs/${songData.image}`}
            alt={songData.image ?? "image"}
            loading="lazy"
            width={200}
            height={200}
          />
          <div className="song-banner_title">{songData.title}</div>
          <div className="song-banner_artists">{songData.artists}</div>
        </a>
      </div>
    </div>
  );
};

export default SongCard;