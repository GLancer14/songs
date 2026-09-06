"use server"

import { Suspense } from "react"
import userIam from "@/app/actions/userIam"
import { prisma } from "@/app/lib/prisma"
import Loading from "./loading"
import Header from "@/app/(ui)/Header/Header"
import Footer from "@/app/(ui)/Footer/Footer"
import Image from "next/image"
import Link from "next/link"

const Page = async () => {
  const user = await userIam();
  const albums = await prisma.albums.findMany();
  const staticURL = !process.env.NEXT_PUBLIC_BLOB_STORE_ID ? "" : process.env.NEXT_PUBLIC_STATIC_URL;

  return (
    <Suspense fallback={<Loading />}>
      <Header user={user} />
      <div className="flex flex-col flex-1 max-w-300 mx-auto">
        <h2 className="flex justify-center mt-5 mb-5 self-center text-3xl">Albums</h2>
        <div className="songs flex flex-row flex-wrap gap-[2%] gap-y-2 py-8 px-16">
          {albums.map(album => {
            return (
              <div
                className="flex w-[49%] flex-row bg-white"
                key={album.id}
              >
                <Link className="flex" href={`/api/albums/${album.id}`}>
                  <Image
                    className=""
                    src={album.image
                      ? `${staticURL}/backgrounds/albums/${album.image}`
                      : `${staticURL}/noimage2.svg`}
                    alt={album.image ?? "image"}
                    loading="lazy"
                    width={100}
                    height={100}
                  />
                  <div>
                    <div className="m-2">{album.name}</div>
                    <div className="m-2">{album.author}</div>
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