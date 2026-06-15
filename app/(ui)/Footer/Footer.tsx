"use client"

import Link from "next/link";
import s from "./Footer.module.scss";
import clsx from "clsx";

const Footer = () => {
  return (
    <footer className={s.footer}>
      <ul className={clsx(s.footer__links, "w-1/2")}>
        <li>
          <Link href="/conditions">Условия использования</Link>
        </li>
        <li>
          <Link href="/secure">Безопасность</Link>
        </li>
        <li>
          <Link href="/cookies">Cookies</Link>
        </li>
      </ul>
    </footer>
  );
};

export default Footer;