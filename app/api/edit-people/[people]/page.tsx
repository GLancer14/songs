"use server"

import { Suspense } from "react"
import userIam from "@/app/actions/userIam"
import { prisma } from "@/app/lib/prisma"
import Loading from "./loading"
import EditPeople from "@/app/(ui)/EditPeople/EditPeople"

const Page = async ({
  params,
}: {
  params: Promise<{ people: number }>
}) => {
  const user = await userIam();
  const { people } = await params;
  const peopleData = await prisma.people.findFirst({
    where: {
      id: +people,
    },
  });

  let country;
  if (peopleData) {
    country = await prisma.countries.findFirst({
      where: {
        country_id: peopleData.country_id || 1,
      }
    })
  }

  return (
    <Suspense fallback={<Loading />}>
      <EditPeople
        user={user}
        edit={true}
        peopleData={peopleData}
        peopleCountry={country?.country}
      />
    </Suspense>
  )
}

export default Page;