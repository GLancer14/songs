"use server";

import { Profile } from "../../(ui)/Profile/Profile"
import userIam from "../../actions/userIam"
import { Suspense } from "react";
import Header from "../../(ui)/Header/Header";
import Footer from "../../(ui)/Footer/Footer";
import { prisma } from "../../lib/prisma";
import SongPage from "../../(ui)/SongPage/SongPage";

export default async function Page({
  params,
}: {
  params: Promise<{ song: number }>
}) {
  const { song } = await params;

  const userData = await userIam();
  const songData = await prisma.songs.findFirst({
    where: {
      song_id: +song,
    },
  });


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