"use client"

import Link from "next/link";
import s from "./Footer.module.scss";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className={s.footer}>
      <Image
        className={s.footer__logo}
        src="/vercel.svg"
        alt="Vercel logomark"
        width={16}
        height={16}
      />
      <ul className={s.footer__links}>
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