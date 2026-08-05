"use client";

import clsx from "clsx";
import s from "./About.module.scss";
import { FC, useState } from "react";

interface AboutProps {
  showAbout: boolean;
  aboutText: string | null;
  type: "people" | "Albums" | "Songs"
}

const About: FC<AboutProps> = ({ showAbout, aboutText, type }) => {
  const [showText, setShowText] = useState(false);

  return (
    <div
      className={clsx(s.aboutContainer, {
        [s.isOpen]: showAbout,
      })}
    >
      <div className={s.aboutInner}>
        <div className="font-bold mb-2 text-[12px]">{type} Bio</div>
        <div className={clsx("aboutText h-30 overflow-hidden w-full", {
          [s.isShowing]: showText,
        })}>
          {aboutText || "About is missing"}
        </div>
        {!showText && (
          <button
            className="
              relative
              flex
              flex-row
              items-center
              justify-center
              mx-auto
              h-8
              w-26
              bg-transparent
              px-4
              py-2
              rounded-2xl
              border
              border-black
              cursor-pointer
              hover:bg-black/5
              transition-colors
            "
            type="button"
            onClick={() => {
              setShowText(true);
            }}
          >
            Expand
            <span>
              <svg width={10} height={20} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 6.6 16">
                <path d="M1.6 8.8l.6-.6 1 1 .5.7V6H0v-.8h4.5v4.6l.5-.6 1-1 .6.5L4 11.3 1.6 8.8z"></path>
              </svg>
            </span>
          </button>
        )}
      </div>
    </div>
  );
}

export default About;