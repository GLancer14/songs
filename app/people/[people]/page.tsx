"use server";

import { Profile } from "../../(ui)/Profile/Profile"
import userIam from "../../actions/userIam"
import { Suspense } from "react";
import Header from "../../(ui)/Header/Header";
import Footer from "../../(ui)/Footer/Footer";
import { prisma } from "../../lib/prisma";
import SongPage from "../../(ui)/SongPage/SongPage";

export default async function Page({
  params,
}: {
  params: Promise<{ album: number }>
}) {
  const { album } = await params;

  const userData = await userIam();
  const albumData = await prisma.albums.findFirst({
    where: {
      id: +album,
    },
  });
  const tracklist = await prisma.songs_albums.findMany({
    where: {
      id: +album,
    },
    select: {
      songs: true
    }
  })

  if (!userData) return null;

  return (
    <>
      <Header user={userData} />
      <div className="flex flex-col flex-1">
        {albumData && 
          (<div>
            <div>
              <img
                src={`/backgrounds/albums/${albumData.image}`}
                width={100}
                height={100}
                alt="Обложка"
              />
            </div>
            <div>{albumData.name}</div>
            <div>{albumData.author}</div>
            <div>{albumData.release_date?.toString()}</div>
            <div>
              <h3>Tracklist</h3>
              {tracklist.map(track => {
                return (
                  <a
                    className="block"
                    href={`/songs/${track.songs.song_id}`}
                  >
                    {track.songs.name}
                  </a>
                );
              })}
            </div>
          </div>)
        }
      </div>
      <Footer />
    </>
    
  )
}