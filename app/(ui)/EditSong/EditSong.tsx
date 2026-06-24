"use client"

import userIam from "@/app/actions/userIam";
import Header from "../Header/Header"
import { mood, Prisma, users } from "@/src/generated/prisma/client";
// import "./EditSong";
import Languages from "./Languages/Languages";
import Mood from "./Mood/Mood";
import SearchField from "../ui/SearchField/SearchField";
import Footer from "../Footer/Footer";
import ExternalLink from "./ExternalLink/ExternalLink";
import Lyrics from "./Lyrics/Lyrics";
import { useActionState, useState } from "react";
import clsx from "clsx";
import editSong from "@/app/actions/EditSong/editSong";
import { redirect } from "next/navigation";
import { fieldsNames } from "../lib/fieldsNames";

const EditSong = ({
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
  moods: mood[];
  creators: Array<{
    name: Prisma.ModelName;
    title: string;
    fields: string;
  }>;
  dataGroupes:  Array<{
    name: Prisma.ModelName;
    title: string;
    fields: string;
  }>;
  requiredFields: Array<{
    name: Prisma.ModelName;
    title: string;
    fields: string;
  }>;
  lyricsLanguages: string[];
}) => {
  const [state, action, pending] = useActionState(editSong, undefined)
  const [lyricsOn, setLyricsOn] = useState<{
    english: boolean,
    russian: boolean,
  }>({
    english: true,
    russian: true,
  });
  const [generalData, setGeneralData] = useState<{
    [n: string]: string
  }>({
    title: "",
    name: "",
    artists: "",
  });

  return (
    <>
      <Header user={user} />
      <form
        className="flex flex-col flex-1 justify-start p-8 max-w-300 mx-auto bg-white"
        action={action}
        method="POST"
        encType="multipart/form-data"
      >
        <section className="flex flex-col justify-start mb-8">
          <h2 className="text-4xl capitalize mb-4">general data</h2>
          <article className="flex flex-col flex-wrap gap-8 justify-start items-start mb-8 w-1/2">
            {requiredFields.map((requiredField, ind) => {
              return (
                <label
                  key={ind}
                  className="flex gap-4 cursor-pointer justify-between relative w-full"
                >
                  <span className="text-xl">{requiredField.name + ` ${requiredField.fields}`}</span>
                  <input
                    className="p-1 rounded-sm w-2/3"
                    type="text"
                    title={requiredField.title}
                    maxLength={128}
                    name={requiredField.name + `_${requiredField.fields}`}
                    list={`${requiredField}_options`}
                    required={true}
                    value={generalData[requiredField.fields]}
                    onInput={(e) => {setGeneralData({
                      ...generalData,
                      [requiredField.fields]: e.currentTarget.value,
                    })}}
                  />
                </label>
                // <SearchField
                //   key={ind}
                //   tableData={requiredField}
                //   required={true}
                //   title={requiredField.title}
                //   className="flex flex-col justify-start w-1/2 gap-2 mb-8"
                // />
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
                name="lyrics_translation_langs"
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
                name="lyrics_translation_langs"
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
            {lyricsLanguages.map((lyricsLanguage, ind) => {
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
            })}
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
                  fieldName={fieldsNames[creator.name]}
                  tableData={creator}
                  className="flex flex-col justify-start gap-2 mb-2 w-[calc(50%-16px)]"
                />
              );
            })}
          </article>
          <article className="flex flex-row flex-wrap gap-8 justify-center items-start">
            <h3 className="text-2xl w-full">Info</h3>
            <div className="flex flex-row flex-wrap">
              <h4 className="w-full">Original language(s):</h4>
              {languages.map((language, ind) => {
                if (language !== "english") {
                  return <Languages key={ind} language={language} />
                }
              })}
            </div>
            {dataGroupes.map((dataGroup, ind) => {
              return (
                <SearchField
                  key={ind}
                  fieldName={fieldsNames[dataGroup.name]}
                  tableData={dataGroup}
                  className="flex flex-col justify-start gap-2 mb-2 w-[calc(50%-16px)]"
                />
              )
            })}
            <label className="flex w-full justify-center gap-2">
              <span className="text-white">Mood:</span>
              <select className="" name="mood" size={1}>
                <option className="text-white" value="none" defaultChecked>none</option>
                {moods.map((mood, ind) => {
                  return <Mood key={ind} mood={mood} />
                })}
              </select>
            </label>
            <label className="flex gap-2">
              <span className="">Release date:</span>
              <input
                className=""
                type="date"
                name="release_date"
                id="release_date"
              />
            </label>
            <label className="flex gap-2">
              <span className="">BPM:</span>
              <input
                className=""
                type="number"
                name="bpm"
                id="bpm"
                max="1015"
                min="20"
                step="0.01"
              />
            </label>
            <label className="flex gap-2">
              <span className="">Track №:</span>
              <input
                className=""
                type="number"
                name="track"
                id="track"
                min="1"
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
              name="title_image"
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
              name="orig_audio"
              id="upload-orig-audio"
              accept="audio/mp3,audio/flac,audio/aac/mp3"
              tabIndex={-1}
            />
            {/* <div className="" tabIndex={0}>Add</div> */}
            {/* <span className=""></span> */}
          </div>
        </section>
        {/* <ExternalLink /> */}
        <button className="" value="Save" id="save_songs_lyrics" onSubmit={(e) => {
          e.preventDefault();
          redirect(`/`)
        }}>Add Song</button>
      </form>
      <Footer />
    </>
  );
}

export default EditSong;
