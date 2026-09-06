"use server"

import { Suspense } from "react"
import userIam from "@/app/actions/userIam"
import { prisma } from "@/app/lib/prisma"
import Loading from "./loading"
import Header from "@/app/(ui)/Header/Header"
import Footer from "@/app/(ui)/Footer/Footer"
import Link from "next/link"
import Image from "next/image"

const Page = async () => {
  const user = await userIam();
  const groupes = await prisma.groupes.findMany();
  const staticURL = !process.env.NEXT_PUBLIC_BLOB_STORE_ID ? "" : process.env.NEXT_PUBLIC_STATIC_URL;

  return (
    <Suspense fallback={<Loading />}>
      <Header user={user} />
      <div className="flex flex-col flex-1 max-w-300 w-300 mx-auto">
        <h2 className="flex justify-center mt-5 mb-5 self-center text-3xl">Groupes</h2>
        <div className="songs flex flex-row flex-wrap gap-[2%] gap-y-2 py-8 px-16">
          {groupes.map(group => {
            return (
              <div
                className="flex w-[49%] flex-row bg-white"
                key={group.id}
              >
                <Link className="flex" href={`/api/groupes/${group.id}`}>
                  <Image
                    className=""
                    src={group.image
                      ? `${staticURL}/backgrounds/groupes/${group.image}`
                      : `${staticURL}/noimage2.svg`}
                    alt={group.image ?? "image"}
                    loading="lazy"
                    width={100}
                    height={100}
                  />
                  <div>
                    <div className="m-2">{group.name}</div>
                  </div>
                </Link>
              </div>
            )
          })}
        </div>
      </div>
      <Footer />
    </Suspense>
  )
}

export default Page;