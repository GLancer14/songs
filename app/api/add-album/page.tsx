"use server"

import { Suspense } from "react"
import userIam from "@/app/actions/userIam"
import { prisma } from "@/app/lib/prisma"
import Loading from "./loading"
import EditAlbum from "@/app/(ui)/EditAlbum/EditAlbum"

const Page = async () => {
  const user = await userIam();
  const albumTypes = await prisma.album_types.findMany();

  return (
    <Suspense fallback={<Loading />}>
      <EditAlbum
        user={user}
        albumTypes={albumTypes}
      />
    </Suspense>
  )
}

export default Page;