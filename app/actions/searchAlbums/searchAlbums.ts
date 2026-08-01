"use server"

import { Prisma, songs } from "@/src/generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { SearchAlbumsSchema, SearchSongsSchema, SearchSongsSchemaType } from "@/app/lib/definitions";
import userIam from "../userIam";
import { writeFile } from "fs";
import path from "path";

export default async function searchAlbums(
  searchValue: string,
  artists: string | undefined,
  pagination: {
    page: number;
    sort: "alphabet" | "release_date";
    order: "asc" | "desc";
  },
): Promise<({
    id: number;
    name: string;
    author: string | null;
    release_date: Date | null;
    album_type: number | null;
    description: string | null;
    image: string | null;
}[]) | { errors: string[] } | { errors: {
    searchString?: string[] | undefined;
    artists?: string[] | undefined;
}}> {
  const user = await userIam();
  const validatedFields = SearchAlbumsSchema.safeParse({
    searchString: searchValue,
    artists,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  if (!user) {
    return {
      errors: ["You are logged out"],
    }
  }
  const searchStringData = validatedFields.data;

  const albums = await prisma.albums.findMany({
    where: {
      author: searchStringData?.artists,
      name: {
        contains: searchStringData?.searchString,
        mode: "insensitive",
      },
    },
  });

  return JSON.parse(JSON.stringify(albums));
}