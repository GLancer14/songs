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
  const groupes = await prisma.groupes.findMany();

  return (
    <Suspense fallback={<Loading />}>
      <Header user={user} />
      <h2 className="flex justify-center mt-5 mb-5 self-center text-3xl">Albums</h2>
      <div className="songs flex flex-row flex-wrap gap-[2%] gap-y-2 py-8 px-16">
        {groupes.map(groupe => {
          return (
            <div className="flex w-[49%] flex-row">
              <a className="flex" href={`/albums/${groupe.id}`}>
                <img
                  className=""
                  src={groupe.image ? `/backgrounds/albums/${groupe.image}` : ""}
                  alt={groupe.image ?? "image"}
                  loading="lazy"
                  width={100}
                  height={100}
                />
                <div>
                  <div className="m-2">{groupe.name}</div>
                </div>
              </a>
            </div>
          )
        })}
      </div>
      <Footer />
    </Suspense>
  )
}

export default Page;