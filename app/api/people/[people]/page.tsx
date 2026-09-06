"use server";

import userIam from "@/app/actions/userIam"
import Header from "@/app/(ui)/Header/Header";
import Footer from "@/app/(ui)/Footer/Footer";
import { prisma } from "@/app/lib/prisma";
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
      author: peopleData ? peopleData.name : "",
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
          type="people"
          userRole={userData.role}
        />
      <Footer />
    </>
  )
}