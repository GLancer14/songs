"use client"

import Link from "next/link";
import s from "./Header.module.scss";
import { users } from "@/src/generated/prisma/client";
import LogoutButton from "../LogoutButton/LogoutButton";
import clsx from "clsx";

const Header = ({ user }: { user: users | null | undefined }) => {
  return (
    <header className={clsx(s.header, "flex justify-between")}>
      <h1 className="flex w-full align-middle justify-start text-5xl">
        <Link href="/">
          My website
        </Link>
      </h1>
      <ul className={clsx(s.header__auth, "w-1/2 self-end")}>
        <li className="flex items-center">
          <Link href="/addSong">Add song</Link>
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