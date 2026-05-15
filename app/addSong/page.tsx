"use server"

import { Suspense } from "react"
import AddSong from "../(ui)/AddSong/AddSong"
import userIam from "../actions/userIam"
import { prisma } from "../lib/prisma"
import Loading from "./loading"

const Page = async () => {
  const creators = ["music_authors", "lyrics_authors", "singers", "producers", "groupes"];
  const dataGroupes = ["genres", "albums"];
  const requiredFields = [
    ["full_name", "Например: Okame-P feat. Hatsune Miku - -2017- The End Of A Dream"],
    ["artists", "Чаще всего, вторая половина полного названия песни (имя песни), например: -2017- The End Of A Dream"],
    ["name", "Чаще всего, первая половина полного названия песни (авторы), например: Okame-P feat. Hatsune Miku"],
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