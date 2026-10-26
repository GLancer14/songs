"use server"

import { prisma } from "../../lib/prisma";
import { EditAlbumSchema, EditAlbumSchemaType } from "@/app/lib/definitions";
import userIam from "../userIam";
import { rm, writeFile } from "fs";
import path from "path";
import { del, put } from "@vercel/blob";

export type ArrayValues = 
  "people" |
  "groupes";

const editAlbum = async (
  state: EditAlbumSchemaType, formData: FormData
) => {
  const user = await userIam();
  const validatedFields = EditAlbumSchema.safeParse({
    album_name: formData.get("album_name"),
    album_author: formData.get("album_author"),
    album_description: formData.get("album_description"),
    album_type_id: formData.get("album_type_id"),
    groupes: formData.getAll("groupes"),
    groupes_types: formData.getAll("groupes_name-input-as"),
    people: formData.getAll("people"),
    people_types: formData.getAll("people_name-input-as"),
    release_date: formData.get("release_date"),
    title_image: formData.get("title_image"),
    album_id: formData.get("album_id"),
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
  const oldAlbumData = await prisma.albums.findFirst({
    where: {
      album_id: +albumData.album_id,
    }
  });

  const imageName = `${Date.now()}-${albumData.title_image?.name.replace(/[^a-zA-Z0-9.]/g, '-')}`;

  const newAlbumType = await prisma.album_types.findFirst({
    where: {
      album_type_id: +albumData.album_type_id,
    }
  })

 

  await prisma.albums_groupes.deleteMany({
    where: {
      album_id: +albumData.album_id,
    },
  });

  await prisma.albums_people.deleteMany({
    where: {
      album_id: +albumData.album_id,
    },
  });

  const newAlbumGroupes = await Promise.all(albumData.groupes.map(async (value) => {
    const foundGroup = await prisma.groupes.findFirst({
      where: {
        name: {
          contains: value,
          mode: "insensitive",
        },
      },
    });

    if (foundGroup) {
      return foundGroup;
    }

    return await prisma.groupes.create({
      data: {
        name: value,
      },
    });
  }));

  const newAlbumGroupType = await Promise.all(albumData.groupes_types.map(async (value) => {
    const foundGroupType = await prisma.type.findFirst({
      where: {
        name: {
          contains: value,
          mode: "insensitive",
        },
      },
    });

    if (foundGroupType) {
      return foundGroupType;
    }

    return await prisma.type.create({
      data: {
        name: value,
      },
    });
  }));

  for (let i = 0; i < newAlbumGroupes.length; i++) {
    await prisma.albums_groupes.create({
      data: {
        album_id: +albumData.album_id,
        id: newAlbumGroupes[i].id,
        type_id: newAlbumGroupType[i].type_id,
      },
    });
  }

  const newAlbumPeople = await Promise.all(albumData.people.map(async (value) => {
    const foundGroup = await prisma.people.findFirst({
      where: {
        name: {
          contains: value,
          mode: "insensitive",
        },
      },
    });

    if (foundGroup) {
      return foundGroup;
    }

    return await prisma.people.create({
      data: {
        name: value,
      },
    });
  }));

  const newAlbumPeopleType = await Promise.all(albumData.people_types.map(async (value) => {
    const foundPeopleType = await prisma.type.findFirst({
      where: {
        name: {
          contains: value,
          mode: "insensitive",
        },
      },
    });

    if (foundPeopleType) {
      return foundPeopleType;
    }

    return await prisma.type.create({
      data: {
        name: value,
      },
    });
  }));

  for (let i = 0; i < newAlbumPeople.length; i++) {
    await prisma.albums_people.create({
      data: {
        album_id: +albumData.album_id,
        id: newAlbumPeople[i].id,
        type_id: newAlbumPeopleType[i].type_id,
      },
    });
  }
  
  const albumDataImage: {
    name: string;
    author: string;
    release_date: Date;
    album_type: number;
    description: string | undefined;
    image?: string;
  } = {
    name: albumData.album_name,
    author: albumData.album_author || "",
    release_date: new Date(Date.parse(albumData.release_date)) || "",
    album_type: newAlbumType!.album_type_id,
    description: albumData.album_description,
  };

  if (albumData.title_image && !albumData.title_image.name.includes("blob")) {
    albumDataImage.image = imageName;
  }

  const albumUpdateResult = await prisma.albums.update({
    where: {
      album_id: Number(albumData.album_id),
    },
    data: {
      ...albumDataImage,
    }
  });

  if (albumData.title_image) {
    if (albumData.title_image.size === 0) {
      return albumData.title_image = undefined;
    }

    if (oldAlbumData?.image && oldAlbumData.image !== albumData.title_image.name) {
      if (!process.env.NEXT_PUBLIC_BLOB_STORE_ID) {
        rm(path.join(process.cwd(), 'public/backgrounds/albums', oldAlbumData.image), (e) => {
          console.log(e)
        });
      } else {
        const savePath = `backgrounds/albums/${oldAlbumData.image}`;
        await del(savePath);
      }
    }

    const file = albumData.title_image;
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    if (!process.env.NEXT_PUBLIC_BLOB_STORE_ID) {
      await writeFile(path.join(process.cwd(), 'public/backgrounds/albums', imageName), buffer, (e) => {
        console.log(e)
      })
    } else {
      const savePath = `backgrounds/albums/${imageName}`;
      await put(savePath, buffer, {
        access: 'public',
      });
    }
  }

  return JSON.parse(JSON.stringify(albumUpdateResult));
}

export default editAlbum;