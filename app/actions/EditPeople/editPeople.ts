"use server"

import { Prisma, songs } from "@/src/generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { AddAlbumSchema, AddAlbumSchemaType, AddSingerSchema, AddSingerSchemaType, AddSongSchema, AddSongSchemaType } from "@/app/lib/definitions";
import userIam from "../userIam";
import { writeFile } from "fs";
import path from "path";

export default async function editPeople(
  state: AddSingerSchemaType, formData: FormData
) {
  const user = await userIam();
  const validatedFields = AddSingerSchema.safeParse({
    singer_name: formData.get("singer_name"),
    singer_country: formData.get("singer_country"),
    biography: formData.get("biography"),
    title_image: formData.get("title_image"),
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
  const singerData = validatedFields.data;

  const imageName = `${Date.now()}-${singerData.title_image?.name.replace(/[^a-zA-Z0-9.]/g, '-')}`;

  const singerCountry = await prisma.countries.findFirst({
    where: {
      country: {
        contains: singerData.singer_country,
        mode: "insensitive",
      },
    },
    select: {
      country_id: true,
    }
  })

  const albumCreateResult = await prisma.singers.create({
    data: {
      name: singerData.singer_name,
      country_id: singerCountry?.country_id ?? null,
      biography: singerData.biography,
      image: imageName,
    }
  });

  if (singerData.title_image) {
    if (singerData.title_image.size === 0) {
      return singerData.title_image = undefined;
    }

    const file = singerData.title_image;
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(path.join(process.cwd(), 'public/backgrounds/singers', imageName), buffer, (e) => {
      console.log(e)
    })
  }

  return JSON.parse(JSON.stringify(albumCreateResult));
}