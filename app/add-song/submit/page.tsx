"use server"

import { Suspense } from "react"
// import Loading from "./loading"
import { Prisma } from "@/src/generated/prisma/client"
import { redirect } from "next/navigation"

const Page = async () => {
  return redirect("/")
}

export default Page;