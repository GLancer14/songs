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
  params: Promise<{ people: number }>
}) {
  const { people } = await params;

  const userData = await userIam();
  const peopleData = await prisma.people.findFirst({
    where: {
      id: +people,
    },
  });

  const country = await prisma.countries.findFirst({
    where: {
      country_id: peopleData?.country_id ? peopleData?.country_id : 0,
    },
  });

  if (!userData) return null;

  return (
    <>
      <Header user={userData} />
      <div className="flex flex-col flex-1">
        {people && 
          (<div>
            <div>
              <img
                src={`/backgrounds/people/${peopleData?.image}`}
                width={100}
                height={100}
                alt="Обложка"
              />
            </div>
            <div>{peopleData?.name}</div>
            <div>{peopleData?.nickname}</div>
            <div>{peopleData?.surname}</div>
            <div>{peopleData?.description}</div>
            <div>{peopleData?.type}</div>
            <div>{country?.country}</div>
          </div>)
        }
      </div>
      <Footer />
    </>
  )
}