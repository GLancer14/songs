"use server"

import { prisma } from "../../lib/prisma";
import { EditGroupSchema, EditGroupSchemaType } from "@/app/lib/definitions";
import userIam from "../userIam";
import { rm, writeFile } from "fs";
import path from "path";
import { del, put } from "@vercel/blob";
import { redirect } from "next/navigation";

export default async function editGroup(
  state: EditGroupSchemaType, formData: FormData
) {
  const user = await userIam();
  const validatedFields = EditGroupSchema.safeParse({
    group_name: formData.get("group_name"),
    group_country: formData.get("group_country"),
    description: formData.get("description"),
    year_of_foundation: Number(formData.get("year_of_foundation")),
    title_image: formData.get("title_image"),
    group_id: formData.get("group_id"),
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
  const groupData = validatedFields.data;
  const oldGroupData = await prisma.groupes.findFirst({
    where: {
      id: +groupData.group_id,
    }
  });

  const imageName = `${Date.now()}-${groupData.title_image?.name.replace(/[^a-zA-Z0-9.]/g, '-')}`;

  const groupCountry = await prisma.countries.findFirst({
    where: {
      country: {
        contains: groupData.group_country,
        mode: "insensitive",
      },
    },
    select: {
      country_id: true,
    },
  });

  let newGroupCountry: {
    country_id: number;
    country: string;
  } | undefined;
  if (oldGroupData?.country_id !== groupCountry?.country_id) {
    newGroupCountry = await prisma.countries.create({
      data: {
        country: groupData.group_country,
      },
    });
  }

  const groupDataImage: {
    name: string;
    country_id: number | null;
    description: string | undefined;
    year_of_foundation: number;
    image?: string;
  } = {
    name: groupData.group_name,
    country_id: newGroupCountry?.country_id ?? null,
    description: groupData.description,
    year_of_foundation: Number(groupData.year_of_foundation),
  };

  if (groupData.title_image && !groupData.title_image.name.includes("blob")) {
    groupDataImage.image = imageName;
  }

  const albumUpdateResult = await prisma.groupes.update({
    where: {
      id: Number(groupData.group_id),
    },
    data: {
      ...groupDataImage,
    }
  });

  if (groupData.title_image) {
    if (groupData.title_image.size === 0) {
      return groupData.title_image = undefined;
    }

    if (oldGroupData?.image && oldGroupData.image !== groupData.title_image.name) {
      if (!process.env.NEXT_PUBLIC_BLOB_STORE_ID) {
        rm(path.join(process.cwd(), 'public/backgrounds/groupes', oldGroupData.image), (e) => {
          console.log(e)
        });
      } else {
        const savePath = `backgrounds/groupes/${oldGroupData.image}`;
        await del(savePath);
      }
    }

    const file = groupData.title_image;
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    if (!process.env.NEXT_PUBLIC_BLOB_STORE_ID) {
      writeFile(path.join(process.cwd(), 'public/backgrounds/groupes', imageName), buffer, (e) => {
        console.log(e)
      });
    } else {
      const savePath = `backgrounds/groupes/${imageName}`;
      await put(savePath, buffer, {
        access: 'public',
      });
    }
  }

  return JSON.parse(JSON.stringify(albumUpdateResult));
}