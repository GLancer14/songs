"use server"

import { Prisma, songs } from "@/src/generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { AddPeopleSchema, AddPeopleSchemaType } from "@/app/lib/definitions";
import userIam from "../userIam";
import { writeFile } from "fs";
import path from "path";

export default async function editPeople(
  state: AddPeopleSchemaType, formData: FormData
) {
  const user = await userIam();
  const validatedFields = AddPeopleSchema.safeParse({
    people_name: formData.get("people_name"),
    people_firstname: formData.get("people_firstname"),
    people_surname: formData.get("people_surname"),
    people_nickname: formData.get("people_nickname"),
    people_type: formData.get("people_type"),
    people_country: formData.get("people_country"),
    description: formData.get("description"),
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
  const peopleData = validatedFields.data;

  const imageName = `${Date.now()}-${peopleData.title_image?.name.replace(/[^a-zA-Z0-9.]/g, '-')}`;

  const singerCountry = await prisma.countries.findFirst({
    where: {
      country: {
        contains: peopleData.people_country,
        mode: "insensitive",
      },
    },
    select: {
      country_id: true,
    }
  })

  const albumCreateResult = await prisma.people.create({
    data: {
      name: peopleData.people_name,
      firstname: peopleData.people_firstname,
      surname: peopleData.people_surname,
      nickname: peopleData.people_nickname,
      description: peopleData.description,
      type: peopleData.people_type,
      country_id: singerCountry?.country_id ?? null,
      image: imageName,
    }
  });

  if (peopleData.title_image) {
    if (peopleData.title_image.size === 0) {
      return peopleData.title_image = undefined;
    }

    const file = peopleData.title_image;
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(path.join(process.cwd(), 'public/backgrounds/people', imageName), buffer, (e) => {
      console.log(e)
    })
  }

  return JSON.parse(JSON.stringify(albumCreateResult));
}