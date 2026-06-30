"use client"

import Link from "next/link";
import s from "./Header.module.scss";
import { users } from "@/src/generated/prisma/client";
import LogoutButton from "../LogoutButton/LogoutButton";
import clsx from "clsx";
import { useState } from "react";
import { usePathname } from "next/navigation";

const Header = ({ user, imageColor }: { user: users | null | undefined, imageColor?: string }) => {
  const [listVisibility, setListVisibility] = useState(false);

  return (
    <header
      className={clsx(s.header, "sticky flex justify-between items-baseline z-100")}
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
                left-0
                absolute
                bg-white
                w-min-content
                text-nowrap
                p-4`,
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
            className="h-min flex flex-nowrap justify-center align-middle"
            href="/profile"
          >
            Hi, {user.name}
          </Link>
        </li>}
        {!user && <li className="flex items-center">
          <Link href="/signup">Sign Up</Link>
        </li>}
        {!user && <li className="flex items-center">
          <Link href="/signin">Sign In</Link>
        </li>}
        {user && <li className="flex items-center">
          <LogoutButton />
        </li>}
      </ul>
    </header>
  );
};

export default Header;