"use server";

import { Profile } from "../../(ui)/Profile/Profile"
import userIam from "../../actions/userIam"
import { Suspense } from "react";
import Header from "../../(ui)/Header/Header";
import Footer from "../../(ui)/Footer/Footer";
import { prisma } from "../../lib/prisma";
import SongPage from "../../(ui)/SongPage/SongPage";
import SongCard from "@/app/(ui)/SongCard/SongCard";

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
  const groupesAlbums = await prisma.songs_groupes.findMany({
    where: {
      id: +group,
    },
    select: {
      songs: {
        include: {
          songsAlbums: {
            include: {
              albums: true,
            }
          },
        }
      }
    }
  })

  const groupSongs = await prisma.songs_groupes.findMany({
    where: {
      id: +group,
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
        {groupeData && 
          (<div>
            <div>
              <img
                src={groupeData.image ? `/backgrounds/groupes/${groupeData.image}` : "/noimage2.svg"}
                width={100}
                height={100}
                alt="Обложка"
              />
            </div>
            <div>{groupeData.name}</div>
            <div>{groupeData.year_of_foundation}</div>
            <div>{groupeData.description}</div>
            <div>
              <h3>Albums</h3>
              {groupesAlbums.map(albums => {
                const authorAlbums = albums.songs.songsAlbums;
                return (
                  <div>
                    {authorAlbums.map(album => {
                      return (
                        <a
                          className="block"
                          href={`/albums/${album.albums.id}`}
                        >
                          {album.albums.name}
                        </a>
                      )
                    })}
                  </div>
                );
              })}
            </div>

            <div>
              <h3>Songs</h3>
              {groupSongs.map(songs => {
                return (
                  <SongCard songData={songs.songs} />
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