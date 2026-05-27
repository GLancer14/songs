"use client"

import Link from "next/link";
import s from "./SongCard.module.scss";
import { Prisma, users } from "@/src/generated/prisma/client";
import LogoutButton from "../LogoutButton/LogoutButton";
import clsx from "clsx";
import { useState } from "react";

const SongCard = ({ songData }: { songData: Prisma.songsModel }) => {
  const [listVisibility, setListVisibility] = useState(false);

  return (
    <div className="w-[50%]">
      <div className="song-banner">
        <a href={`/${songData.song_id}`} className="song-banner_anchor">
          <img
            className="song-banner_image"
            src={`public/backgrounds/${songData.image}`}
            alt={songData.image ?? "image"}
            loading="lazy"
          />
          <div className="song-banner_title">{songData.title}</div>
          <div className="song-banner_artists">{songData.artists}</div>
        </a>
      </div>
    </div>
  );
};

export default SongCard;