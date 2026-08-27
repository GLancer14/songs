"use server"

import { Prisma, songs } from "@/src/generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { SearchAlbumSchema, SearchAlbumsSchema, SearchSongsSchema, SearchSongsSchemaType } from "@/app/lib/definitions";
import userIam from "../userIam";
import { writeFile } from "fs";
import path from "path";

export default async function searchAlbum(
  songId: number,
): Promise<
  (
    {
      albums: {
        name: string;
        id: number;
        release_date: Date | null;
        description: string | null;
        image: string | null;
        author: string | null;
        album_type: number | null;
      };
      status: "ok";
    }
    | null
  )
  | { errors: string[]; status: "fail"; }
  | {
      errors: { songId?: string[] | undefined; },
      status: "fail";
    }
> {
  const user = await userIam();
  const validatedFields = SearchAlbumSchema.safeParse({
    songId,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      status: "fail",
    }
  }

  if (!user) {
    return {
      errors: ["You are logged out"],
      status: "fail",
    }
  }
  const searchIdData = validatedFields.data;

  const albums: {
      albums: {
        name: string;
        id: number;
        release_date: Date | null;
        description: string | null;
        image: string | null;
        author: string | null;
        album_type: number | null;
      };
      status?: "ok";
    } | null = await prisma.songs_albums.findFirst({
    where: {
      song_id: searchIdData.songId,
    },
    select: {
      albums: true,
    }
  });

  if (albums) {
    albums.status = "ok";
  }

  return JSON.parse(JSON.stringify(albums));
}