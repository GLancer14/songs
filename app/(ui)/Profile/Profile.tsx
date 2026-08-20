"use client";

import { Suspense, useEffect, useState } from "react";
import s from "./Profile.module.scss";
import Image from "next/image";
import clsx from "clsx";
import About from "../ui/About/About";
import Modal from "../ui/Modal/Modal";
import EditProfileForm from "../EditProfileForm/EditProfileForm";

export interface ProfileData {
    email: string;
    name?: string;
    avatar?: string | null;
    coverart?: string | null;
    bio?: string | null;
}

export const Profile = ({ profileData }: { profileData: ProfileData }) => {
  const staticURL = !process.env.NEXT_PUBLIC_BLOB_STORE_ID ? "" : process.env.NEXT_PUBLIC_STATIC_URL;
  const [editProfileisShown, setEditProfileisShown] = useState(false);

  return (
    // <></>
    <div className="flex flex-col flex-1 items-center">
      <header
        className={`flex items-center relative h-82.5 w-full justify-center bg-no-repeat bg-cover bg-center`}
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 0, 0, 0.1) 0%,
            rgba(0, 0, 0, 0.5) 100%),
            url(${staticURL}/backgrounds/users/${profileData.avatar})
          `,
        }}
      >
        <div className="relative colum flex flex-row max-w-344 w-344 py-4 px-10.5">
          {profileData && profileData.avatar &&
            <Image
              className="relative top-12 self-start mr-11 ml-15 border-4 border-white rounded-[50%] object-cover object-center w-85 h-85"
              src={profileData.avatar
                ? `${staticURL}/backgrounds/users/${profileData.avatar}`
                : `${staticURL}/noimage2.svg`
              }
              alt={"обложка"}
              width={340}
              height={340}
            />}
          {!profileData.avatar &&
            <div
              className="
                relative
                top-12
                flex
                items-center
                justify-center
                text-9xl
                self-start
                mr-11 ml-15
                border-4
                border-white
                rounded-[50%]
                w-85
                h-85
                bg-amber-200
                uppercase
              "
            >
              {profileData.email[0]}
            </div>
          }
        </div>
        <div
          className={clsx(`
            absolute
            w-full
            h-full
            top-0
            left-0
            bg-cover
            bg-no-repeat
            bg-center
            z-[-1]
          `)}
        ></div>
      </header>
      <div className="relative top-16 flex flex-row gap-17 w-300 max-w-300 mb-8">
        <div className="w-130 max-w-130">
          <h3 className="text-center text-[24px]">@{profileData.name}</h3>
          <button
            className="flex gap-0.5 justify-between items-center mx-auto my-2 border-2 border-black p-1.5 cursor-pointer"
            type="button"
            onClick={() => setEditProfileisShown(true)}
          >
            <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 19">
              <path d="M17.51 5.827c.654-.654.654-1.636 0-2.29L14.563.59c-.655-.655-1.637-.655-2.291 0L0 12.864V18.1h5.236L17.51 5.827Zm-4.092-4.09 2.946 2.945-2.455 2.454-2.945-2.945 2.454-2.455ZM1.636 16.463v-2.946l8.182-8.182 2.946 2.946-8.182 8.182H1.636Z">
              </path>
            </svg>
            Edit
          </button>
          <div className="bg-white p-4">
            {profileData.bio
              ? <About
                  className={s.about}
                  showAbout={true}
                  aboutText={profileData?.bio || null}
                  type="Bio"
                />
              : `${profileData.name} is keeping quiet for now`
            }
          </div>
          
        </div>
        <div className="w-263 max-w-263">
          Nothing is here
        </div>
      </div>
      <Modal
        className="flex items-center justify-center"
        isOpen={editProfileisShown}
        onClose={() => setEditProfileisShown(false)}
      >
        <EditProfileForm profileData={profileData} />
      </Modal>
    </div>
  );
}