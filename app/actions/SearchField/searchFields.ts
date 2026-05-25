"use server"

import { Prisma } from "@/src/generated/prisma/client";
import { prisma } from "../../lib/prisma";

export default async function findSearchFieldValue(
  searchString: string, 
  fieldName: string,
  tableName: Prisma.ModelName,
): Promise<Array<any> | undefined> {
  if (searchString !== "") {
    const searchResult = await prisma[tableName].findMany({
      where: {
        [fieldName]: {
          contains: searchString,
          mode: "insensitive",
        },
      },
      take: 10,
    });

    return JSON.parse(JSON.stringify(searchResult));
  }

  return [];
}