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
  params: Promise<{ group: number }>
}) {
  const { group } = await params;

  const userData = await userIam();
  const groupeData = await prisma.groupes.findFirst({
    where: {
      id: +group,
    },
  });
  const albums = await prisma.songs_groupes.findMany({
    where: {
      id: +group,
    },
    select: {
      songs: {
        include: {
          songsAlbums: true,
        }
      }
    }
  })

  console.log(albums)

  if (!userData) return null;

  return (
    <>
      <Header user={userData} />
      <div className="flex flex-col flex-1">
        {groupeData && 
          (<div>
            <div>
              <img
                src={`/backgrounds/albums/${groupeData.image}`}
                width={100}
                height={100}
                alt="Обложка"
              />
            </div>
            <div>{groupeData.name}</div>
            <div>{groupeData.year_of_foundation}</div>
            <div>{groupeData.description}</div>
            <div>
              <h3>Tracklist</h3>
              {albums.map(album => {
                return (
                  <a
                    className="block"
                    href={`/songs/${album.songs.song_id}`}
                  >
                    {album.songs.name}
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