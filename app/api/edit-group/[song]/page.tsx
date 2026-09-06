"use server"

import { Suspense } from "react"
import userIam from "@/app/actions/userIam"
import { prisma } from "@/app/lib/prisma"
import Loading from "./loading"
import EditGroup from "@/app/(ui)/EditGroup/EditGroup"

const Page = async ({
  params,
}: {
  params: Promise<{ song: number }>
}) => {
  const user = await userIam();
  const { song } = await params;
  const groupData = await prisma.groupes.findFirst({
    where: {
      id: +song,
    },
  });

  let country;
  if (groupData) {
    country = await prisma.countries.findFirst({
      where: {
        country_id: groupData.country_id || 1,
      }
    })

    console.log(country)
  }


  return (
    <Suspense fallback={<Loading />}>
      <EditGroup
        user={user}
        edit={true}
        groupData={groupData}
        groupCountry={country?.country}
      />
    </Suspense>
  )
}

export default Page;