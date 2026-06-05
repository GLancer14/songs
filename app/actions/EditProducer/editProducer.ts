"use server"

import { Prisma, songs } from "@/src/generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { AddProducerSchema, AddProducerSchemaType } from "@/app/lib/definitions";
import userIam from "../userIam";
import { writeFile } from "fs";
import path from "path";

export default async function editProducer(
  state: AddProducerSchemaType, formData: FormData
) {
  const user = await userIam();
  const validatedFields = AddProducerSchema.safeParse({
    producer_name: formData.get("producer_name"),
    producer_country: formData.get("producer_country"),
    biography: formData.get("biography"),
    year_of_start: formData.get("year_of_start"),
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
  const producerData = validatedFields.data;

  const imageName = `${Date.now()}-${producerData.title_image?.name.replace(/[^a-zA-Z0-9.]/g, '-')}`;

  const producerCountry = await prisma.countries.findFirst({
    where: {
      country: {
        contains: producerData.producer_country,
        mode: "insensitive",
      },
    },
    select: {
      country_id: true,
    }
  })

  const albumCreateResult = await prisma.producers.create({
    data: {
      name: producerData.producer_name,
      country_id: producerCountry?.country_id ?? null,
      biography: producerData.biography,
      begin_year: producerData.year_of_start,
      image: imageName,
    }
  });

  if (producerData.title_image) {
    if (producerData.title_image.size === 0) {
      return producerData.title_image = undefined;
    }

    const file = producerData.title_image;
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(path.join(process.cwd(), 'public/backgrounds/producers', imageName), buffer, (e) => {
      console.log(e)
    })
  }

  return JSON.parse(JSON.stringify(albumCreateResult));
}