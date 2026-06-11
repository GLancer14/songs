"use client"

import Link from "next/link";
import s from "./Header.module.scss";
import { users } from "@/src/generated/prisma/client";
import LogoutButton from "../LogoutButton/LogoutButton";
import clsx from "clsx";
import { useState } from "react";

const Header = ({ user }: { user: users | null | undefined }) => {
  const [listVisibility, setListVisibility] = useState(false);

  return (
    <header className={clsx(s.header, "flex justify-between")}>
      <h1 className="flex w-full align-middle justify-start text-5xl">
        <Link href="/">
          Songs
        </Link>
      </h1>
      <ul className={clsx(s.header__auth, "w-1/2 self-end")}>
        <li className={clsx("flex items-center relative")}>
          <div
            className="hover:text-black"
            onMouseEnter={() => {setListVisibility(true)}}
            onMouseLeave={() => {setListVisibility(false)}}
          >
            Add content
          </div>
          <ul
            className={clsx("hidden flex-col top-6 left-0 absolute bg-white", {
              [s.listVisibility]: listVisibility
            })}
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
        {user && <li>
          <LogoutButton />
        </li>}
      </ul>
    </header>
  );
};

export default Header;