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
    // <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans w-[1200px] mx-auto">
    <>
      <Header user={user} />
      <main className="flex flex-1 flex-col items-center py-8 px-16 sm:items-start w-300 mx-auto">
        <h2
          className="flex justify-center mt-5 mb-5 self-center text-3xl"
        >
          Songs
        </h2>
        <section className="flex flex-col w-full">
          <div className="songs flex flex-row flex-wrap gap-[2%]">
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
    </>
    // </div>
  );
}
