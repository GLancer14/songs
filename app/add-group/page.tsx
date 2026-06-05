"use server"

import { Suspense } from "react"
import EditSong from "../(ui)/EditSong/EditSong"
import userIam from "../actions/userIam"
import { prisma } from "../lib/prisma"
import Loading from "./loading"
import { creators, dataGroupes, requiredFields } from "../lib/searchFields"
import EditSinger from "../(ui)/EditSinger/EditSinger"
import EditProducer from "../(ui)/EditProducer/EditProducer"
import EditGroup from "../(ui)/EditGroup/EditGroup"

const Page = async () => {
  const user = await userIam();

  return (
    <Suspense fallback={<Loading />}>
      <EditGroup
        user={user}
      />
    </Suspense>
  )
}

export default Page;