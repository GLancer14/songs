"use server"

import { Suspense } from "react"
import EditSong from "../(ui)/EditSong/EditSong"
import userIam from "../actions/userIam"
import { prisma } from "../lib/prisma"
import Loading from "./loading"
import { creators, dataGroupes, requiredFields } from "../lib/searchFields"
import EditAlbum from "../(ui)/EditAlbum/EditAlbum"

const Page = async () => {
  const user = await userIam();
  const albumTypes = await prisma.album_types.findMany();


  return (
    <Suspense fallback={<Loading />}>
      <EditAlbum
        user= {user}
        albumTypes={albumTypes}
      />
    </Suspense>
  )
}

export default Page;