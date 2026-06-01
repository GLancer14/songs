"use server"

import { prisma } from "../../lib/prisma";
import { PrismaClient } from "@prisma/client/extension";

export default async function handleSearch(
  tableData: { name: string; fields: string; idFieldName: string; songId: number; },
  searchData: string,
) {
  const existingAuthor = await prisma[tableData.name as PrismaClient].findFirst({
    where: {
      [tableData.fields]: searchData,
    }
  });

  let searchId: number = 0;

  if (existingAuthor) {
    const searchingValue = Object.entries(existingAuthor);
    const searchingArray = searchingValue.find(value => {
      return value[0].endsWith("_id");
    });
    if (searchingArray) {
      searchId = Number(searchingArray[1]);
    }
  } else {
    const newRecord = await prisma[tableData.name as PrismaClient].create({
      data: {
        name: searchData,
      }
    });

    searchId = newRecord.music_author_id;
  }

  await prisma[`songs_${tableData.name}` as PrismaClient].create({
    data: {
      [tableData.idFieldName]: searchId,
      song_id: tableData.songId
    }
  })

  return JSON.parse(JSON.stringify({searchId}));
}