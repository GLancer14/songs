"use server"

import { prisma } from "../../lib/prisma";
import { AddAlbumSchema, AddAlbumSchemaType } from "@/app/lib/definitions";
import userIam from "../userIam";
import { writeFile } from "fs";
import path from "path";
import { put } from "@vercel/blob";

export type ArrayValues = 
  "people" |
  "groupes";

type ValidModelKeys = Extract<keyof typeof prisma, ArrayValues>;

export default async function addAlbum(
  state: AddAlbumSchemaType, formData: FormData
) {
  const user = await userIam();
  const validatedFields = AddAlbumSchema.safeParse({
    album_name: formData.get("album_name"),
    album_author: formData.get("album_author"),
    album_description: formData.get("album_description"),
    album_type: formData.get("album_type"),
    groupes: formData.getAll("groupes"),
    groupes_types: formData.getAll("groupes_name-input-as"),
    people: formData.getAll("people"),
    people_types: formData.getAll("people_name-input-as"),
    release_date: formData.get("release_date"),
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
  const albumData = validatedFields.data;

  const imageName = `${Date.now()}-${albumData.title_image?.name.replace(/[^a-zA-Z0-9.]/g, '-')}`;

  const albumCreateResult = await prisma.albums.create({
    data: {
      name: albumData.album_name,
      author: albumData.album_author,
      description: albumData.album_description,
      album_type: Number(albumData.album_type),
      release_date: new Date(Date.parse(albumData.release_date)),
      image: imageName,
    }
  });

  const arrays: Array<ArrayValues> = [
    "people",
    "groupes",
  ];

  if (albumData.groupes_types && albumData.people_types) {
    const existingTypesArray = albumData.groupes_types.concat(albumData.people_types);
    for await (const type of existingTypesArray) {

      const existingType = await prisma.type.findFirst({
        where: {
          name: type,
        }
      });

      if (!existingType) {
        await prisma.type.create({
          data: {
            name: type,
          }
        })
      }
    }
  }
  
  const sendAlbumsArray = async (tableName: ArrayValues) => {
    if (albumData[tableName] && albumData[tableName].length > 0) {
      const model = prisma[tableName as ValidModelKeys] as any;
      const authorArray = albumData[tableName];
      
      for (let i = 0; i < authorArray.length; i++) {
        const existingAuthor = await model.findFirst({
          where: {
            name: authorArray[i],
          },
          select: {
            id: true,
          },
        });

        const authorType = await prisma.type.findFirst({
          where: {
            name: {
              contains: albumData[`${tableName}_types`][i],
              mode: "insensitive",
            },
          }
        });

        let sendDataAlbums: any;

        if (existingAuthor) {
          sendDataAlbums = {
            album_id: albumCreateResult.album_id,
            id: existingAuthor.id,
            type_id: authorType?.type_id,
          }

          const albumsTable = prisma[`albums_${tableName}` as keyof typeof prisma] as any;
          await albumsTable.create({
            data: sendDataAlbums,
          });
        } else {
          const newMusicAuthor = await model.create({
            data: {
              name: authorArray[i],
            },
            select: {
              id: true,
            }
          });

          sendDataAlbums = {
            album_id: albumCreateResult.album_id,
            id: newMusicAuthor.id,
            type_id: authorType?.type_id,
          }

          const albumsTable = prisma[`albums_${tableName}` as keyof typeof prisma] as any;
          await albumsTable.create({
            data: sendDataAlbums,
          });
        }
      }
    }
  }

  for (const arrayData of arrays) {
    await sendAlbumsArray(arrayData);
  }

  if (albumData.title_image) {
    if (albumData.title_image.size === 0) {
      return albumData.title_image = undefined;
    }

    const file = albumData.title_image;
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    if (!process.env.NEXT_PUBLIC_BLOB_STORE_ID) {
      await writeFile(path.join(process.cwd(), 'public/backgrounds/albums', imageName), buffer, (e) => {
        console.log(e)
      });
    } else {
      const savePath = `backgrounds/albums/${imageName}`;
      await put(savePath, buffer, {
        access: 'public',
      });
    }
  }

  return JSON.parse(JSON.stringify(albumCreateResult));
}