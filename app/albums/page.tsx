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
  const albums = await prisma.albums.findMany();

  return (
    <Suspense fallback={<Loading />}>
      <Header user={user} />
      <h2 className="flex justify-center mt-5 mb-5 self-center text-3xl">Albums</h2>
      <div className="songs flex flex-row flex-wrap gap-[2%] gap-y-2 py-8 px-16">
        {albums.map(album => {
          return (
            <div className="flex w-[49%] flex-row">
              <a className="flex" href={`/albums/${album.id}`}>
                <img
                  className=""
                  src={album.image ? `/backgrounds/albums/${album.image}` : ""}
                  alt={album.image ?? "image"}
                  loading="lazy"
                  width={100}
                  height={100}
                />
                <div>
                  <div className="m-2">{album.name}</div>
                  <div className="m-2">{album.author}</div>
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