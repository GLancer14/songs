"use server"

import { Prisma, songs } from "@/src/generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { SearchSongsSchema, SearchSongsSchemaType } from "@/app/lib/definitions";
import userIam from "../userIam";
import { writeFile } from "fs";
import path from "path";

export default async function searchSongs(
  searchValue: string, artists: string | undefined,
): Promise<({
    image: string | null;
    name: string;
    description: string | null;
    file: string | null;
    title: string;
    song_id: number;
    user_id: number;
    artists: string;
    addition_date: Date | null;
    release_date: Date;
    mood_id: number;
    rank: string | null;
    bpm: number | null;
    bitrate_audio: bigint | null;
    track_gain: number | null;
}[])> {
  const user = await userIam();
  const validatedFields = SearchSongsSchema.safeParse({
    searchValue,
    artists,
  });

  // if (!validatedFields.success) {
  //   return {
  //     errors: validatedFields.error.flatten().fieldErrors,
  //   }
  // }

  // if (!user) {
  //   return {
  //     errors: ["You are logged out"],
  //   }
  // }
  const searchStringData = validatedFields.data;

  const songs = await prisma.songs.findMany({
    where: {
      title: {
        contains: searchStringData?.searchString,
        mode: "insensitive",
      },
    },
  })

  return JSON.parse(JSON.stringify(songs));
}