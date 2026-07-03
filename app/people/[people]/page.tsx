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
import formatDate from "@/app/(ui)/utils/formatDate";
import Modal from "@/app/(ui)/ui/Modal/Modal";
import PeoplePage from "@/app/(ui)/PeoplePage/PeoplePage";

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

  const albums = await prisma.albums.findMany({
    where: {
      author: peopleData && peopleData.name,
    },
    take: 6,
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
        <PeoplePage
          peopleData={peopleData}
          songs={songs}
          albums={albums}
          country={country}
        />
      <Footer />
    </>
  )
}