"use server"

import { Prisma, songs } from "@/src/generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { AddGroupSchema, AddGroupSchemaType } from "@/app/lib/definitions";
import userIam from "../userIam";
import { writeFile } from "fs";
import path from "path";

export default async function editGroup(
  state: AddGroupSchemaType, formData: FormData
) {
  const user = await userIam();
  const validatedFields = AddGroupSchema.safeParse({
    group_name: formData.get("group_name"),
    group_country: formData.get("group_country"),
    description: formData.get("description"),
    year_of_foundation: Number(formData.get("year_of_foundation")),
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
  const groupData = validatedFields.data;

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
    }
  })

  const albumCreateResult = await prisma.groupes.create({
    data: {
      name: groupData.group_name,
      country_id: groupCountry?.country_id ?? null,
      description: groupData.description,
      year_of_foundation: Number(groupData.year_of_foundation),
      image: imageName,
    }
  });

  if (groupData.title_image) {
    if (groupData.title_image.size === 0) {
      return groupData.title_image = undefined;
    }

    const file = groupData.title_image;
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(path.join(process.cwd(), 'public/backgrounds/groupes', imageName), buffer, (e) => {
      console.log(e)
    })
  }

  return JSON.parse(JSON.stringify(albumCreateResult));
}