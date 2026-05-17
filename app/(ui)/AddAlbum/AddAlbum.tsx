"use client"

import userIam from "@/app/actions/userIam";
import Header from "../Header/Header"
import { users } from "@/src/generated/prisma/client";
import SearchField from "../ui/SearchField/SearchField";
import Footer from "../Footer/Footer";
import { useState } from "react";
import clsx from "clsx";

const AddAlbum = ({
  user,
  languages,
  moods,
  creators,
  dataGroupes,
  requiredFields,
  lyricsLanguages,
}: {
  user: users | null | undefined;
  languages: string[];
  moods: string[];
  creators: string[];
  dataGroupes: string[];
  requiredFields: string[][];
  lyricsLanguages: string[];
}) => {
  const [lyricsOn, setLyricsOn] = useState<{
    english: boolean,
    russian: boolean,
  }>({
    english: true,
    russian: true,
  })

  return (
    <>
      <Header user={user} />
      <form
        className="flex flex-col justify-start p-8 bg-gray-800"
        action="/add_song/submit"
        method="post"
        encType="multipart/form-data"
      >
        <section className="flex flex-col justify-start mb-8">
          <h2 className="text-4xl capitalize mb-4">general data</h2>
          <article className="">
            {requiredFields.map((requiredField, ind) => {
              return (
                <SearchField
                  key={ind}
                  fieldName={requiredField[0]}
                  required={true}
                  title={requiredField[1]}
                  className="flex flex-col justify-start w-1/2 gap-2 mb-8"
                />
              )
            })}
          </article>
          <article className="w-1/2">
            <h2 className="mb-4 text-xl">Description</h2>
            <label className="">
              <textarea
                className="w-full resize-none"
                rows={5}
                maxLength={1024}
                name="description"
                id="description"
              ></textarea>
            </label>
          </article>
        </section>
        <section className="mb-8">
          <h2 className="text-4xl mb-4">lyrics</h2>
          <article className="">
            <h3 className="text-2xl">Translation language(s):</h3>
            <label className="flex text-xl gap-2" htmlFor="english_translation_input">
              <input
                className=""
                type="checkbox"
                name="lyricsLangs[]"
                id="english_translation_input"
                value="english"
                checked={lyricsOn.english}
                onChange={() => {
                  setLyricsOn({
                    ...lyricsOn,
                    english: !lyricsOn.english,
                  })
                }}
              />
              <span className="">english</span>
            </label>
            <label className="flex text-xl gap-2" htmlFor="russian_translation_input">
              <input
                className=""
                type="checkbox"
                name="lyricsLangs[]"
                id="russian_translation_input"
                value="russian"
                checked={lyricsOn.russian}
                onChange={() => {
                  setLyricsOn({
                    ...lyricsOn,
                    russian: !lyricsOn.russian,
                  })
                }}
              />
              <span className="">russian</span>
            </label>
          </article>
          <article className="flex flex-row justify-center gap-8">
            {/* {lyricsLanguages.map((lyricsLanguage, ind) => {
              const allLyricsOn = Object.values(lyricsOn).filter(lyrics => lyrics);
              return (
                <Lyrics
                  key={ind}
                  lyricsName={lyricsLanguage}
                  required={lyricsLanguage === "original" && true}
                  available={lyricsLanguage !== "original" ? lyricsOn[lyricsLanguage as "english" | "russian"] : true}
                  width={allLyricsOn.length === 2
                    ? "30%"
                    : allLyricsOn.length === 1
                      ? "40%"
                      : "50%"
                  }
                />
              );
            })} */}
            <div className=""></div>
          </article>
        </section>
        <section className="mb-8">
          <h2 className="text-4xl w-full mb-4">additional meta data</h2>
          <article className="flex flex-row flex-wrap gap-8 justify-start items-center mb-8">
            <h3 className="text-2xl w-full">Creators</h3>
            {creators.map((creator, ind) => {
              return (
                <SearchField
                  key={ind}
                  fieldName={creator}
                  className={clsx("flex w-[calc(50%-16px)]")}
                />
              );
            })}
          </article>
          <article className="flex flex-row flex-wrap gap-8 justify-center items-center">
            <h3 className="text-2xl w-full">Info</h3>
            <div className="flex flex-row flex-wrap">
              <h4 className="w-full">Original language(s):</h4>
              {/* {languages.map((language, ind) => {
                return <Languages key={ind} language={language} />
              })} */}
            </div>
            {dataGroupes.map((dataGroup, ind) => {
              return (
                <SearchField
                  key={ind}
                  fieldName={dataGroup}
                  className={dataGroup}
                />
              )
            })}
            <label className="flex w-full justify-center gap-2">
              <span className="text-white">Mood:</span>
              <select className="" name="mood" size={1}>
                <option className="text-white" value="none" defaultChecked>none </option>
                {/* {moods.map((mood, ind) => {
                  return <Mood key={ind} mood={mood} />
                })} */}
              </select>
            </label>
            <label className="flex gap-2">
              <span className="">Release date:</span>
              <input
                className=""
                type="date"
                name="releaseDate"
                id="release-date"
              />
            </label>
            <label className="flex gap-2">
              <span className="">BPM:</span>
              <input
                className=""
                type="number"
                name="bpm" id="bpm"
                max="1015"
                min="20"
                step="0.01"
              />
            </label>
          </article>
        </section>
        <section className="flex flex-col mb-8 w-1/2 gap-2">
          <h2 className="text-4xl w-full mb-4">media</h2>
          <div className="flex justify-between">
            <span className="">Song Art:</span>
            <input
              className="w-3/5"
              type="file"
              name="titleImage"
              id="upload-title-image"
              accept="image/jpeg,image/gif,image/png"
              tabIndex={-1}
            />
            {/* <div className="" tabIndex={0}>Add</div> */}
            {/* <span className=""></span> */}
          </div>
          <img className="" />
          <div className="flex justify-between">
            <span className="">Audio:</span>
            <input
              className="w-3/5"
              type="file"
              name="origAudio"
              id="upload-orig-audio"
              accept="audio/mp3"
              tabIndex={-1}
            />
            {/* <div className="" tabIndex={0}>Add</div> */}
            {/* <span className=""></span> */}
          </div>
        </section>
        {/* <ExternalLink /> */}
        <button className="" value="Save" id="save_songs_lyrics">Add Song</button>
      </form>
      <Footer />
    </>
  );
}

export default AddAlbum;
