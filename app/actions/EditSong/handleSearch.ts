"use server"

import { prisma } from "../../lib/prisma";

export default async function handleSearch(
  tableData: { name: string; fields: string; idFieldName: string; songId: number; },
  searchData: string,
) {
  const model = prisma[tableData.name as keyof typeof prisma] as any;
  
  const existingAuthor = await model.findFirst({
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
    const newRecord = await model.create({
      data: {
        name: searchData,
      }
    });

    const searchingValue = Object.entries(newRecord);
    const searchingArray = searchingValue.find(value => {
      return value[0].endsWith("_id");
    });
    if (searchingArray) {
      searchId = Number(searchingArray[1]);
    }
  }

  const songsTable = prisma[`songs_${tableData.name}` as keyof typeof prisma] as any;
  await songsTable.create({
    data: {
      [tableData.idFieldName]: searchId,
      song_id: tableData.songId
    }
  })

  return JSON.parse(JSON.stringify({searchId}));
}