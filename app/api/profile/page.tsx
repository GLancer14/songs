import { Profile } from "@/app/(ui)/Profile/Profile"
import userIam from "@/app/actions/userIam"
import { Suspense } from "react";
import Loading from "./loading";
import Header from "@/app/(ui)/Header/Header";
import Footer from "@/app/(ui)/Footer/Footer";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const userData = await userIam();
  
  if (!userData) return null;

  const clearProfile = {
    email: userData.email,
    name: userData?.name,
    avatar: userData?.avatar,
    coverart: userData?.coverart,
    bio: userData?.bio,
  };

  return (
    <>
      <Header user={userData} />
      <div className="flex flex-col flex-1">
        <Suspense fallback={<Loading />}>
          <Profile profileData={clearProfile}/>
        </Suspense>
      </div>
      <Footer />
    </>
    
  )
}