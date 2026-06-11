"use server"

import { Suspense } from "react"
import EditSong from "../(ui)/EditSong/EditSong"
import userIam from "../actions/userIam"
import { prisma } from "../lib/prisma"
import Loading from "./loading"
import { creators, dataGroupes, requiredFields } from "../lib/searchFields"
import EditPeople from "../(ui)/EditPeople/EditPeople"

const Page = async () => {
  const user = await userIam();

  return (
    <Suspense fallback={<Loading />}>
      <EditPeople
        user={user}
      />
    </Suspense>
  )
}

export default Page;