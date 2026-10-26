"use client"

import Header from "../Header/Header"
import { mood, Prisma, users } from "@/src/generated/prisma/client";
import Languages from "./Languages/Languages";
import Mood from "./Mood/Mood";
import SearchField from "../ui/SearchField/SearchField";
import Footer from "../Footer/Footer";
import ExternalLink from "./ExternalLink/ExternalLink";
import Lyrics from "./Lyrics/Lyrics";
import { FC, useActionState, useEffect, useRef, useState } from "react";
import clsx from "clsx";
import addSong from "@/app/actions/addSong/addSong";
import { redirect } from "next/navigation";
import { fieldsNames, TableNames } from "../lib/fieldsNames";
import AddImage from "../ui/AddImage/AddImage";
import editSong from "@/app/actions/editSong/editSong";

interface EditSongProps {
  user: users | null | undefined;
  languages: string[];
  moods: mood[];
  creators: Array<{
    name: TableNames;
    title: string;
    fields: string;
  }>;
  dataGroupes:  Array<{
    name: TableNames;
    title: string;
    fields: string;
  }>;
  requiredFields: Array<{
    name: Prisma.ModelName;
    title: string;
    fields: string;
  }>;
  lyricsLanguages: string[];
  edit: boolean;
  songData?: {
    name: string;
    user_id: number;
    mood_id: number;
    description: string | null;
    file: string | null;
    release_date: Date;
    bpm: number | null;
    title: string;
    artists: string;
    addition_date: Date | null;
    rank: string | null;
    bitrate_audio: bigint | null;
    track_gain: number | null;
    image: string | null;
    song_id: number;
  } | null;
  lyrics?: {
    languages: {
      language_id: number;
      lang: string;
    };
    lyrics_text: string;
    original: boolean;
  }[];
  album?: {
    albums: {
      name: string;
      description: string | null;
      release_date: Date | null;
      image: string | null;
      album_id: number;
      author: string;
      album_type: number | null;
    };
  } | null;
  group?: {
    groupes: {
      name: string;
      description: string | null;
      image: string | null;
      id: number;
      country_id: number | null;
      year_of_foundation: number | null;
    };
    type: {
      name: string;
      type_id: number;
    };
  }[]
  people?: ({
    type: {
      name: string;
      type_id: number;
    };
    people: {
      name: string;
      description: string | null;
      image: string | null;
      id: number;
      country_id: number | null;
      firstname: string | null;
      surname: string | null;
      nickname: string | null;
    };
  } & {
    song_id: number;
    id: number;
    type_id: number;
  })[];
  songLinks?: {
    song_id: number;
    id: number;
    url: string;
    url_name: string;
    url_type: string;
  }[];
}

const EditSong: FC<EditSongProps> = ({
  user,
  languages,
  moods,
  creators,
  dataGroupes,
  requiredFields,
  lyricsLanguages,
  edit = false,
  songData,
  lyrics,
  album,
  group,
  people,
  songLinks,
}) => {
  const formRef = useRef<HTMLFormElement | null>(null)
  const [state, action, pending] = useActionState(edit ? editSong : addSong, undefined)
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
    title: songData?.title || "",
    name: songData?.name || "",
    artists: songData?.artists || "",
  });
  const [description, setDescription] = useState(songData?.description || "");
  const [peopleData, setPeopleData] = useState([]);
  const [groupesData, setGroupesData] = useState([]);

  useEffect(() => {

  }, [])

  return (
    <>
      <Header user={user} />
      <form
        className="flex flex-col flex-1 justify-start p-8 max-w-300 mx-auto bg-white"
        action={action}
        method="POST"
        encType="multipart/form-data"
        ref={formRef}
      >
        <section className="flex flex-col justify-start mb-8">
          <h2 className="text-4xl capitalize mb-4">add song</h2>
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
                value={description}
                onChange={e => setDescription(e.currentTarget.value)}
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
                  firstShowData={lyricsLanguage === "original"
                    ? lyrics?.find(lyric => lyric.original)?.lyrics_text
                    : lyrics?.find(lyric => lyric.languages.lang === lyricsLanguage)?.lyrics_text
                  }
                />
              );
            })}
            <div className=""></div>
          </article>
        </section>
        <section className="mb-8">
          <h2 className="text-4xl w-full mb-4">additional meta data</h2>
          <article className="flex flex-row flex-wrap gap-8 justify-start items-start mb-8">
            <h3 className="text-2xl w-full">Creators</h3>
            {creators.map((creator, ind) => {
              return (
                <SearchField
                  className="flex flex-col justify-start gap-2 mb-2 w-[calc(50%-16px)]"
                  required={true}
                  key={ind}
                  fieldName={fieldsNames[creator.name]}
                  tableData={creator}
                  firstShowData={
                    creator.name === "people"
                      ? people?.map(value => {
                          return {
                            name: value.people.name,
                            type: value.type.name,
                          }
                        })
                      : group?.map(value => {
                          return {
                            name: value.groupes.name,
                            type: value.type.name,
                          }
                        })
                  }
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
              <span className="text-black">Mood:</span>
              <select className="border border-black" name="mood" size={1}>
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
          <div className="flex justify-between w-full">
            {/* <span className="">Song Art:</span> */}
            <AddImage />
          </div>
          <img className="" />
          <div className="flex justify-between">
            <span className="">Audio:</span>
            <input
              className="w-3/5"
              type="file"
              name="orig_audio"
              id="upload-orig-audio"
              accept="audio/mp3,audio/flac,audio/aac"
              tabIndex={-1}
            />
            {/* <div className="" tabIndex={0}>Add</div> */}
            {/* <span className=""></span> */}
          </div>
        </section>
        <section className="w-0 h-0 opacity-0">
          {edit && 
            <input
              type="text"
              className="h-0 w-0"
              value={songData?.song_id}
              name="song_id"
              readOnly
            />
          }
        </section>
        <ExternalLink form={formRef.current} />
        <button className="border border-black py-2" value="Save" id="save_songs_lyrics" onSubmit={(e) => {
          e.preventDefault();
          redirect(`/`)
        }}>Add Song</button>
      </form>
      <Footer />
    </>
  );
}

export default EditSong;
