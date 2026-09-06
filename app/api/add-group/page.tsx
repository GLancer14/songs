"use server"

import { Suspense } from "react"
import userIam from "@/app/actions/userIam"
import Loading from "./loading"
import EditGroup from "@/app/(ui)/EditGroup/EditGroup"

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