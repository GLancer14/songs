import { Profile } from "../(ui)/Profile/Profile"
import userIam from "../actions/userIam"
import { Suspense } from "react";
import Header from "../(ui)/Header/Header";
import Footer from "../(ui)/Footer/Footer";
import { prisma } from "../lib/prisma";
import SongPage from "../(ui)/SongPage/SongPage";

export default async function Page({
  params,
}: {
  params: Promise<{ song_id: number }>
}) {
  const { song_id } = await params;

  const userData = await userIam();
  const songData = await prisma.songs.findUnique({
    where: {
      song_id: song_id
    }
  })

  if (!userData) return null;

  return (
    <>
      <Header user={userData} />
      <div className="flex flex-col flex-1">
        <SongPage songData={songData!}/>
      </div>
      <Footer />
    </>
    
  )
}