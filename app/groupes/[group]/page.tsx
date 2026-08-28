"use server";

import { Profile } from "../../(ui)/Profile/Profile"
import userIam from "../../actions/userIam"
import { Suspense } from "react";
import Header from "../../(ui)/Header/Header";
import Footer from "../../(ui)/Footer/Footer";
import { prisma } from "../../lib/prisma";
import SongPage from "../../(ui)/SongPage/SongPage";
import SongCard from "@/app/(ui)/SongCard/SongCard";
import PeoplePage from "@/app/(ui)/PeoplePage/PeoplePage";

export default async function Page({
  params,
}: {
  params: Promise<{ group: number }>
}) {
  const { group } = await params;

  const userData = await userIam();
  const groupData = await prisma.groupes.findFirst({
    where: {
      id: +group,
    },
  });

  const albums = await prisma.albums.findMany({
    where: {
      author: groupData ? groupData.name : "",
    },
    take: 6,
  });

  // const groupesAlbums = await prisma.songs_groupes.findMany({
  //   where: {
  //     id: +group,
  //   },
  //   select: {
  //     songs: {
  //       include: {
  //         songsAlbums: {
  //           include: {
  //             albums: true,
  //           }
  //         },
  //       }
  //     }
  //   }
  // })

  const songs = await prisma.songs_groupes.findMany({
    where: {
      id: +group,
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

  const country = await prisma.countries.findFirst({
    where: {
      country_id: groupData?.country_id ? groupData?.country_id : 0,
    },
  });

  if (!userData) return null;

  return (
    <>
      <Header user={userData} />
        <PeoplePage
          peopleData={groupData}
          songs={songs}
          albums={albums}
          country={country}
          type="group"
        />
      <Footer />
    </>
  )
}