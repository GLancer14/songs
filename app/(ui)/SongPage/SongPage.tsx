"use client"

import userIam from "@/app/actions/userIam";
import Header from "../Header/Header"
import { Prisma, songs, users } from "@/src/generated/prisma/client";
import "./SongPage";
import SearchField from "../ui/SearchField/SearchField";
import Footer from "../Footer/Footer";
import { useState } from "react";
import clsx from "clsx";

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
