"use server"

import { Prisma, songs } from "@/src/generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { SearchArtistSchema, SearchSongsSchema, SearchSongsSchemaType } from "@/app/lib/definitions";
import userIam from "../userIam";
import { writeFile } from "fs";
import path from "path";

const searchArtist = async (
  id: number,
  type: string,
) => {
  const user = await userIam();
  const validatedFields = SearchArtistSchema.safeParse({
    id: id,
    type: type,
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
  const searchArtistData = validatedFields.data;
  let people: {
    name: string;
    id: number;
    year_of_foundation: number | null;
    country_id: number | null;
    description: string | null;
    image: string | null;
  } | {
    name: string;
    id: number;
    country_id: number | null;
    description: string | null;
    image: string | null;
    firstname: string | null;
    surname: string | null;
    nickname: string | null;
  } | null;

  if (type === "groupes") {
    people = await prisma.groupes.findFirst({
      where: {
        id: searchArtistData.id
      },
    });
  } else {
    people = await prisma.people.findFirst({
      where: {
        id: searchArtistData.id
      },
    });
  }

  return JSON.parse(JSON.stringify(people));
}

export default searchArtist;