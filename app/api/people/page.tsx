"use server"

import { Suspense } from "react"
import userIam from "@/app/actions/userIam"
import { prisma } from "@/app/lib/prisma"
import Loading from "./loading"
import Header from "@/app/(ui)/Header/Header"
import Footer from "@/app/(ui)/Footer/Footer"
import Image from "next/image"

const Page = async () => {
  const user = await userIam();
  const people = await prisma.people.findMany();
  const staticURL = !process.env.NEXT_PUBLIC_BLOB_STORE_ID ? "" : process.env.NEXT_PUBLIC_STATIC_URL;

  return (
    <Suspense fallback={<Loading />}>
      <Header user={user} />
      <div className="flex flex-col flex-1 max-w-300 w-300 mx-auto">
        <h2 className="flex justify-center mt-5 mb-5 self-center text-3xl">People</h2>
        <div className="flex flex-row flex-wrap gap-[2%] gap-y-2 py-4 px-4 justify-between">
          {people.map(people => {
            return (
              <div className="flex w-[32%] flex-row bg-white" key={people.id}>
                <a className="flex" href={`/api/people/${people.id}`}>
                  <Image
                    className="contain"
                    src={people.image
                      ? `${staticURL}/backgrounds/people/${people.image}`
                      : `${staticURL}/noimage2.svg`}
                    alt={people.image ?? "image"}
                    loading="lazy"
                    width={100}
                    height={100}
                  />
                  <div>
                    <div className="m-2">{people.name}</div>
                  </div>
                </a>
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