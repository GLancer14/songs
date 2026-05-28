import { Prisma } from "@/src/generated/prisma/client";

export const creators: Array<{
  name: Prisma.ModelName;
  title: string;
  fields: string;
}> = [
  {
    name: "music_authors",
    title: "",
    fields: "nickname",
  },
  {
    name: "lyrics_authors",
    title: "",
    fields: "nickname",
  },
  {
    name: "singers",
    title: "",
    fields: "singer",
  },
  {
    name: "producers",
    title: "",
    fields: "producer",
  },
  {
    name: "groupes",
    title: "",
    fields: "grope_name",
  },
];

export const dataGroupes: Array<{
  name: Prisma.ModelName;
  title: string;
  fields: string;
}> = [
  {
    name: "genres",
    title: "",
    fields: "genre",
  },
  {
    name: "albums",
    title: "",
    fields: "title",
  }
];

export const requiredFields: Array<{
  name: Prisma.ModelName;
  title: string;
  fields: string;
}> = [
  {
    name: "songs",
    title: "Например: Okame-P feat. Hatsune Miku - -2017- The End Of A Dream",
    fields: "title",
  },
  {
    name: "songs",
    title: "Чаще всего, вторая половина полного названия песни (имя песни), например: -2017- The End Of A Dream",
    fields: "artists",
  },
  {
    name: "songs",
    title: "Чаще всего, первая половина полного названия песни (авторы), например: Okame-P feat. Hatsune Miku",
    fields: "name",
  },
];