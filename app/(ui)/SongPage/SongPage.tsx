"use client"

import { Prisma, songs, users } from "@/src/generated/prisma/client";
import "./SongPage";

const SongPage = ({ songData }: { songData: songs }) => {
  return (
    <div className="flex flex-col">
      <div>{songData.title}</div>
      <div>{songData.name}</div>
      <div>{songData.artists}</div>
    </div>
  );
}

export default SongPage;
