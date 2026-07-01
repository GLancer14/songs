"use server";

import { Profile } from "../../(ui)/Profile/Profile"
import userIam from "../../actions/userIam"
import { Suspense } from "react";
import Header from "../../(ui)/Header/Header";
import Footer from "../../(ui)/Footer/Footer";
import { prisma } from "../../lib/prisma";
import SongPage from "../../(ui)/SongPage/SongPage";
import Image from "next/image";
import clsx from "clsx";

export default async function Page({
  params,
}: {
  params: Promise<{ people: number }>
}) {
  const { people } = await params;

  const userData = await userIam();
  const peopleData = await prisma.people.findFirst({
    where: {
      id: +people,
    },
  });

  const songs = await prisma.songs_people.findMany({
    where: {
      id: +people,
    },
    orderBy: {
      songs: {
        song_id: "asc"
      }
    },
    take: 8,
    include: {
      songs: true,
    }
  });

  const albums = await prisma.songs_albums.findMany({
    where: {
      id: +people,
    },
    include: {
      albums: true,
    }
  });

  const country = await prisma.countries.findFirst({
    where: {
      country_id: peopleData?.country_id ? peopleData?.country_id : 0,
    },
  });

  if (!userData) return null;

  return (
    <>
      <Header user={userData} />
      {peopleData && 
        <div className="flex flex-col flex-1 items-center">
          <header
            className={`flex items-center relative h-82.5 w-full justify-center bg-no-repeat bg-cover bg-center`}
            style={{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.5) 100%), url(/backgrounds/people/${peopleData.image})`,
            }}
          >
            <div className="relative colum flex flex-row max-w-344 w-344 py-4 px-10.5">
              {peopleData && peopleData.image &&
                <Image
                  className="relative top-12 self-start mr-11 border-4 border-white rounded-[50%] object-cover object-center w-85 h-85"
                  src={peopleData.image ? `/backgrounds/people/${peopleData.image}` : "/noimage2.svg"}
                  alt={"обложка"}
                  width={340}
                  height={340}
                />}
                <div className="relative top-4 flex flex-col flex-1 justify-end-safe text-white">
                  <div className="text-[90px] mb-2">{peopleData?.name}</div>
                </div>
            </div>
            <div
              className={clsx(`
                absolute
                w-full
                h-full
                top-0
                left-0
                bg-cover
                bg-no-repeat
                bg-center
                z-[-1]
              `)}
            ></div>
          </header>
          <div className="relative top-16 flex flex-row gap-17 w-300 max-w-300">
            <div className="w-130 max-w-130">
              <h3 className="text-center text-[40px]">About</h3>
              {peopleData.description}
            </div>
            <div className="w-263 max-w-263">
              <div>
                <h3 className="text-[22.5px] font-medium">Songs</h3>
                <div className="flex flex-row flex-wrap gap-4 border-gray-300 border-2 p-7">
                  {songs.map(song => {
                    return (
                      <a
                        className="flex flex-row flex-wrap w-[calc(100%/2-16px)]"
                        href={`/songs/${song.song_id}`}
                      >
                        <Image
                          src={song.songs.image ? `/backgrounds/songs/${song.songs.image}` : "/noimage2.svg"}
                          alt={"обложка песни"}
                          width={90}
                          height={90}
                        />
                        <div className="my-2 ml-4">
                          <div>{song.songs.name}</div>
                          <div>{peopleData.name}</div>
                        </div>
                      </a>
                    )
                  })}
                  <button
                    className="w-full h-10 border border-black rounded-[20px] text-[18px] cursor-pointer"
                    type="button"
                  >
                    All songs by {peopleData.name}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      } 
      
      <Footer />
    </>
  )
}