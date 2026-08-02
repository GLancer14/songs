"use server"

import { prisma } from "../../lib/prisma";

export default async function findSearchFieldValue(
  searchString: string, 
  fieldName: string,
  tableName: string,
): Promise<Array<any> | undefined> {
  if (searchString !== "") {
    const model = prisma[tableName as keyof typeof prisma] as any;
    
    const searchResult = await model.findMany({
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