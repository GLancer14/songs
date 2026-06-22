import { Prisma } from "@/src/generated/prisma/client";

type TableNames = "groupes" | "people" | "albums" | "genres";
export const fieldsNames: Record<TableNames, string> = {
  groupes: "группа",
  people: "люди",
  albums: "альбомы",
  genres: "жанры",
};