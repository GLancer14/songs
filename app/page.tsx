"use server"

import Header from "./(ui)/Header/Header";
import Footer from "./(ui)/Footer/Footer";
import { songs } from "@/src/generated/prisma/client";
import { prisma } from "./lib/prisma";
import userIam from "./actions/userIam";
import SongCard from "./(ui)/SongCard/SongCard";

export default async function Home() {
  const user = await userIam();
  const songs: Array<songs> = await prisma.songs.findMany();

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <Header user={user} />
      <main className="flex flex-1 w-full flex-col items-center py-8 px-16 bg-white dark:bg-black sm:items-start">
        <h1
          className="flex justify-center mt-5 mb-5 self-center text-3xl"
        >
          Welcome to my page!
        </h1>
        <section className="flex flex-col w-full">
          <h2 className="text-xl self-center">Songs</h2>
          <div className="songs flex flex-row flex-wrap">
            {songs.length > 0 &&
              songs.map((song, ind) => {
                return (
                  <SongCard key={ind} songData={song} />
                )
              })
            }
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
