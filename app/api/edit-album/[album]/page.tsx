"use server"

import { Suspense } from "react"
import userIam from "@/app/actions/userIam"
import { prisma } from "@/app/lib/prisma"
import Loading from "./loading"
import EditAlbum from "@/app/(ui)/EditAlbum/EditAlbum"

const Page = async ({
  params,
}: {
  params: Promise<{ album: number }>;
}) => {
  const user = await userIam();
  const { album } = await params;
  const albumTypes = await prisma.album_types.findMany();

  const albumData = await prisma.albums.findFirst({
    where: {
      album_id: +album,
    }
  });

  const albumGroupes = await prisma.albums_groupes.findMany({
    where: {
      album_id: +album,
    },
    include: {
      groupes: true,
      type: true,
    }
  });

  const albumPeople = await prisma.albums_people.findMany({
    where: {
      album_id: +album,
    },
    include: {
      people: true,
      type: true,
    }
  });

  return (
    <Suspense fallback={<Loading />}>
      <EditAlbum
        edit={true}
        user={user}
        albumTypes={albumTypes}
        albumData={albumData}
        albumGroupes={albumGroupes}
        albumPeople={albumPeople}
      />
    </Suspense>
  )
}

export default Page;