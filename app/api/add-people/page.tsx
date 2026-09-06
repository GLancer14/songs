"use server"

import { Suspense } from "react"
import userIam from "@/app/actions/userIam"
import Loading from "./loading"
import EditPeople from "@/app/(ui)/EditPeople/EditPeople"

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