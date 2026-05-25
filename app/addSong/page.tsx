"use server"

import { Suspense } from "react"
import AddSong from "../(ui)/AddSong/AddSong"
import userIam from "../actions/userIam"
import { prisma } from "../lib/prisma"
import Loading from "./loading"
import findSearchFieldValue from "../actions/SearchField/searchFields"
import { Prisma } from "@/src/generated/prisma/client"

const Page = async () => {
  const creators: Array<{
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
  const dataGroupes: Array<{
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
  const requiredFields: Array<{
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
  const lyricsLanguages = ["original", "english", "russian"];
  const user = await userIam()
  const languages = (await prisma.languages.findMany()).map(language => language.lang);
  const moods = (await prisma.mood.findMany()).map(mood => mood.mood);

  return (
    <Suspense fallback={<Loading />}>
      <AddSong
        user={user}
        languages={languages}
        moods={moods}
        creators={creators}
        dataGroupes={dataGroupes}
        requiredFields={requiredFields}
        lyricsLanguages={lyricsLanguages}
      />
    </Suspense>
  )
}

export default Page;