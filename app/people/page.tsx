"use server"

import { Suspense } from "react"
import EditSong from "../(ui)/EditSong/EditSong"
import userIam from "../actions/userIam"
import { prisma } from "../lib/prisma"
import Loading from "./loading"
import { creators, dataGroupes, requiredFields } from "../lib/searchFields"
import EditAlbum from "../(ui)/EditAlbum/EditAlbum"
import Header from "../(ui)/Header/Header"
import Footer from "../(ui)/Footer/Footer"

const Page = async () => {
  const user = await userIam();
  const people = await prisma.people.findMany();

  return (
    <Suspense fallback={<Loading />}>
      <Header user={user} />
      <div className="flex flex-col flex-1 max-w-300 mx-auto">
        <h2 className="flex justify-center mt-5 mb-5 self-center text-3xl">People</h2>
        <div className="songs flex flex-row flex-wrap gap-[2%] gap-y-2 py-4 px-4 justify-between max-w-300">
          {people.map(people => {
            return (
              <div className="flex w-[32%] flex-row bg-white">
                <a className="flex flex-1" href={`/people/${people.id}`}>
                  <img
                    className=""
                    src={people.image ? `/backgrounds/people/${people.image}` : "/noimage2.svg"}
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