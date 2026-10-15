"use server"

import { prisma } from "../../lib/prisma";
import { SearchAlbumTypeSchema } from "@/app/lib/definitions";
import userIam from "../userIam";

const searchAlbumType = async (
  albumTypeId: number,
): Promise<
  (
    {
      album_type_id: number;
      album_type: string;
      status: "ok";
    }
    | null
  )
  | { errors: string[]; status: "fail"; }
  | {
      errors: { albumTypeId?: string[] | undefined; },
      status: "fail";
    }
> => {
  const user = await userIam();
  const validatedFields = SearchAlbumTypeSchema.safeParse({
    albumTypeId,
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

  const albumType: {
    album_type_id: number;
    album_type: string;
    status?: "ok";
  } | null = await prisma.album_types.findFirst({
    where: {
      album_type_id: searchIdData.albumTypeId,
    },
  });

  if (albumType) {
    albumType.status = "ok";
  }

  return JSON.parse(JSON.stringify(albumType));
}

export default searchAlbumType;