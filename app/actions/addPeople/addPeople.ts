"use server"

import { prisma } from "../../lib/prisma";
import { AddPeopleSchema, AddPeopleSchemaType } from "@/app/lib/definitions";
import userIam from "../userIam";
import { writeFile } from "fs";
import path from "path";
import { put } from "@vercel/blob";

export default async function addPeople(
  state: AddPeopleSchemaType, formData: FormData
) {
  const user = await userIam();
  const validatedFields = AddPeopleSchema.safeParse({
    people_name: formData.get("people_name"),
    people_firstname: formData.get("people_firstname"),
    people_surname: formData.get("people_surname"),
    people_nickname: formData.get("people_nickname"),
    people_type: formData.getAll("type"),
    people_country: formData.get("people_country"),
    description: formData.get("description"),
    title_image: formData.get("title_image"),
  });

  console.log(typeof formData.get("type"))
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

  let singerCountry = await prisma.countries.findFirst({
    where: {
      country: {
        contains: peopleData.people_country,
        mode: "insensitive",
      },
    },
    select: {
      country_id: true,
    }
  });

  if (!singerCountry && peopleData.people_country) {
    singerCountry = await prisma.countries.create({
      data: {
        country: peopleData.people_country,
      },
    });
  }

  const peopleCreateResult = await prisma.people.create({
    data: {
      name: peopleData.people_name,
      firstname: peopleData.people_firstname,
      surname: peopleData.people_surname,
      nickname: peopleData.people_nickname,
      description: peopleData.description,
      country_id: singerCountry?.country_id ?? null,
      image: imageName,
    }
  });

  const types = peopleData.people_type.map(async (value) => {
    const foundType = await prisma.type.findFirst({
      where: {
        name: value,
      },
    });

    if (foundType) {
      return foundType;
    }

    return await prisma.type.create({
      data: {
        name: value,
      },
    });
  });

  types.forEach(async (value) => {
    await prisma.people_type.create({
      data: {
        type_id: (await value).type_id,
        id: peopleCreateResult.id,
      },
    });
  });

  if (peopleData.title_image) {
    if (peopleData.title_image.size === 0) {
      return peopleData.title_image = undefined;
    }

    const file = peopleData.title_image;
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    if (!process.env.NEXT_PUBLIC_BLOB_STORE_ID) {
      await writeFile(path.join(process.cwd(), 'public/backgrounds/people', imageName), buffer, (e) => {
        console.log(e)
      })
    } else {
      const savePath = `backgrounds/people/${imageName}`;
      await put(savePath, buffer, {
        access: 'public',
      });
    }
  }

  return JSON.parse(JSON.stringify(peopleCreateResult));
}