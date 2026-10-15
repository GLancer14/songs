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
  const albumTypes = await prisma.album_types.findMany();

  const albumData = await prisma.albums.findFirst({
    where: {
      album_id: +(await params).album,
    }
  });

  return (
    <Suspense fallback={<Loading />}>
      <EditAlbum
        edit={true}
        user={user}
        albumTypes={albumTypes}
        albumData={albumData}
      />
    </Suspense>
  )
}

export default Page;