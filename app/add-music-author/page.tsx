"use server"

import { Suspense } from "react"
import userIam from "../actions/userIam"
import { prisma } from "../lib/prisma"
import Loading from "./loading"
import EditAuthor from "../(ui)/EditAuthor/EditAuthor"

const Page = async () => {
  const user = await userIam();

  return (
    <Suspense fallback={<Loading />}>
      <EditAuthor
        user= {user}
        authorType="music"
      />
    </Suspense>
  )
}

export default Page;