"use server"

import { prisma } from "../../lib/prisma";
import { EditPeopleSchema, EditPeopleSchemaType } from "@/app/lib/definitions";
import userIam from "../userIam";
import { rm, writeFile } from "fs";
import path from "path";
import { del, put } from "@vercel/blob";

export default async function editPeople(
  state: EditPeopleSchemaType, formData: FormData
) {
  const user = await userIam();
  const validatedFields = EditPeopleSchema.safeParse({
    people_name: formData.get("people_name"),
    people_firstname: formData.get("people_firstname"),
    people_surname: formData.get("people_surname"),
    people_nickname: formData.get("people_nickname"),
    people_type: formData.get("people_type"),
    people_country: formData.get("people_country"),
    description: formData.get("description"),
    title_image: formData.get("title_image"),
    people_id: formData.get("people_id"),
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
  const oldPeopleData = await prisma.people.findFirst({
    where: {
      id: +peopleData.people_id,
    }
  });

  const imageName = `${Date.now()}-${peopleData.title_image?.name.replace(/[^a-zA-Z0-9.]/g, '-')}`;

  const peopleCountry = await prisma.countries.findFirst({
    where: {
      country: {
        contains: peopleData.people_country,
        mode: "insensitive",
      },
    },
    select: {
      country_id: true,
      country: true,
    }
  })

  let newPeopleCountry: {
    country_id: number;
    country: string;
  } | undefined;

  if (oldPeopleData?.country_id !== peopleCountry?.country_id) {
    if (peopleCountry?.country === null) {
      newPeopleCountry = await prisma.countries.create({
        data: {
          country: peopleData.people_country || "USA",
        },
      });
    } else {
      if (peopleCountry) {
        newPeopleCountry = {
          country_id: peopleCountry.country_id,
          country: peopleCountry.country,
        };
      }
    }
  }

  const peopleDataImage: {
    name: string;
    firstname: string;
    surname: string;
    nickname: string;
    // type: string;
    country_id: number | null;
    description: string | undefined;
    image?: string;
  } = {
    name: peopleData.people_name,
    firstname: peopleData.people_firstname || "",
    surname: peopleData.people_surname || "",
    nickname: peopleData.people_nickname || "",
    // type: peopleData.people_type || "",
    country_id: newPeopleCountry?.country_id ?? null,
    description: peopleData.description,
  };

  console.log(peopleDataImage)

  if (peopleData.title_image && !peopleData.title_image.name.includes("blob")) {
    peopleDataImage.image = imageName;
  }

  const groupUpdateResult = await prisma.people.update({
    where: {
      id: Number(peopleData.people_id),
    },
    data: {
      ...peopleDataImage,
    }
  });

  if (peopleData.title_image) {
    if (peopleData.title_image.size === 0) {
      return peopleData.title_image = undefined;
    }

    if (oldPeopleData?.image && oldPeopleData.image !== peopleData.title_image.name) {
      if (!process.env.NEXT_PUBLIC_BLOB_STORE_ID) {
        rm(path.join(process.cwd(), 'public/backgrounds/people', oldPeopleData.image), (e) => {
          console.log(e)
        });
      } else {
        const savePath = `backgrounds/people/${oldPeopleData.image}`;
        await del(savePath);
      }
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

  return JSON.parse(JSON.stringify(groupUpdateResult));
}