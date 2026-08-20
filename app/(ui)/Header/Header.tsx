"use client"

import Link from "next/link";
import s from "./Header.module.scss";
import { users } from "@/src/generated/prisma/client";
import LogoutButton from "../ui/LogoutButton/LogoutButton";
import clsx from "clsx";
import { useState } from "react";
import { usePathname } from "next/navigation";
import Modal from "../ui/Modal/Modal";
import SignIn from "../SignIn/SignIn";
import SignUp from "../SignUp/SignUp";
import Image from "next/image";

const Header = ({ user, imageColor }: { user: users | null | undefined, imageColor?: string }) => {
  const staticURL = !process.env.NEXT_PUBLIC_BLOB_STORE_ID ? "" : process.env.NEXT_PUBLIC_STATIC_URL;
  const [listVisibility, setListVisibility] = useState(false);
  const [signinShown, setSigninShown] = useState(false);
  const [signupShown, setSignupShown] = useState(false);

  return (
    <header
      className={clsx(s.header, "sticky top-0 flex justify-between items-baseline z-100")}
      style={{
        backgroundColor: imageColor || "rgb(255, 255, 100)",
        color: imageColor ? "rgb(235, 235, 235)" : "black",
      }}
    >
      <div className="flex flex-row items-baseline">
        <h1 className="flex w-min-content items-center text-2xl">
          <Link href="/">
            Songs
          </Link>
        </h1>
        <ul className={clsx(s.header__auth, "items-center ml-4")}>
          <Link className="flex items-center" href="/albums">Albums</Link>
          <Link className="flex items-center" href="/people">People</Link>
          <Link className="flex items-center" href="/groupes">Groupes</Link>
          <li className={clsx("flex items-center relative")}>
            <div
              // className="hover:text-black"
              onMouseEnter={() => {setListVisibility(true)}}
              onMouseLeave={() => {setListVisibility(false)}}
            >
              Add content
            </div>
            <ul
              className={clsx(`
                hidden
                flex-col
                text-black
                top-6
                -left-4
                absolute
                bg-white
                w-min-content
                text-nowrap
                p-4
                pt-0`,
                {
                  [s.listVisibility]: listVisibility
                })
              }
              style={{
                backgroundColor: imageColor || "rgb(255, 255, 100)",
                color: imageColor ? "rgb(235, 235, 235)" : "black",
              }}
              onMouseEnter={() => {setListVisibility(true)}}
              onMouseLeave={() => {setListVisibility(false)}}
            >
              <li>
                <Link href="/add-song">Add Song</Link>
              </li>
              <li>
                <Link href="/add-album">Add Albums</Link>
              </li>
              <li>
                <Link href="/add-group">Add Group</Link>
              </li>
              <li>
                <Link href="/add-people">Add People</Link>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <ul className={clsx(s.header__auth)}>
        {user && <li className="flex items-center">
          <Link
            className="h-min flex flex-nowrap g-2 justify-center align-middle"
            href="/profile"
          >
            {user && user.avatar &&
              <Image
                className="relative self-start border border-white rounded-[50%] object-cover object-center w-6 h-6"
                src={user.avatar
                  ? `${staticURL}/backgrounds/users/${user.avatar}`
                  : `${staticURL}/noimage2.svg`
                }
                alt={"обложка"}
                width={340}
                height={340}
              />}
            {!user.avatar &&
              <div
                className="
                  relative
                  flex
                  items-center
                  justify-center
                  text-[12px]
                  self-start
                  border
                  border-black
                  rounded-[50%]
                  w-6
                  h-6
                  mr-2
                  bg-amber-200
                  uppercase
                "
              >
                {user.email[0]}
              </div>
            }
            Hi, {user.name}
          </Link>
        </li>}
        {!user && <li className="flex items-center">
          <button
            type="button"
            onClick={() => setSignupShown(true)}
          >
            Sign Up
          </button>
          <Modal
            className="flex flex-row items-center justify-center h-full"
            isOpen={signupShown}
            onClose={() => setSignupShown(false)}
          >
            <SignUp />
          </Modal>
        </li>}
        {!user && <li className="flex items-center">
          <button
            type="button"
            onClick={() => setSigninShown(true)}
          >
            Sign In
          </button>
          <Modal
            className="flex flex-row items-center justify-center h-full"
            isOpen={signinShown}
            onClose={() => setSigninShown(false)}
          >
            <SignIn />
          </Modal>
        </li>}
        {user && <li className="flex items-center">
          <LogoutButton />
        </li>}
      </ul>
    </header>
  );
};

export default Header;