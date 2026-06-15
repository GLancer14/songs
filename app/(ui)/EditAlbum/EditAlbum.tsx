"use client"

import userIam from "@/app/actions/userIam";
import Header from "../Header/Header"
import { album_types, Prisma, users } from "@/src/generated/prisma/client";
import SearchField from "../ui/SearchField/SearchField";
import Footer from "../Footer/Footer";
import { useActionState, useState } from "react";
import clsx from "clsx";
import editAlbum from "@/app/actions/EditAlbum/editAlbum";
import Image from "next/image";
import AddImage from "../ui/AddImage/AddImage";

const EditAlbum = ({ user, albumTypes }: { user: users | null | undefined; albumTypes: album_types[] }) => {
  const [state, action, pending] = useActionState(editAlbum, undefined)
  const [lyrics, setLyrics] = useState("");
  const [author, setAuthor] = useState("");


  return (
    <>
      <Header user={user} />
      <form
        className="flex flex-col justify-start p-8 bg-gray-800 grow"
        action={action}
        method="POST"
        encType="multipart/form-data"
      >
        <h2 className="text-4xl capitalize mb-4">Add Album</h2>
        <section className="flex flex-col justify-start mb-8">
          <article className="w-1/2">
            <label className="flex gap-4 cursor-pointer justify-between relative w-full mb-8">
              <span className="text-xl">Name</span>
              <input
                className="p-1 rounded-sm w-2/3"
                type="text"
                title={"имя альбома"}
                maxLength={128}
                name={"album_name"}
                required={true}
                value={lyrics}
                onInput={(e) => {
                  setLyrics(e.currentTarget.value);
                }}
              />
            </label>
            <SearchField
              tableData={{
                name: "people",
                fields: "name",
                title: "Авторы альбома"
              }}
              className="flex flex-col justify-start gap-2 mb-2 w-[calc(50%-16px)]"
            />
            <label className="flex gap-4 cursor-pointer justify-between relative w-full mb-8">
              <span className="text-xl">Author</span>
              <input
                className="p-1 rounded-sm w-2/3"
                type="text"
                title={"автор альбома"}
                maxLength={128}
                name={"album_author"}
                required={true}
                value={author}
                onInput={(e) => {
                  setAuthor(e.currentTarget.value);
                }}
              />
            </label>
          </article>
          <article className="w-1/2 mb-4">
            <h2 className="mb-4 text-xl">Description</h2>
            <label className="">
              <textarea
                className="w-full resize-none"
                rows={5}
                maxLength={2048}
                name="album_description"
                id="description"
              ></textarea>
            </label>
          </article>
          <label className="flex gap-2">
            <span className="">Album Type:</span>
            <select name="album_type" id="album_type">
              <option className="text-black" value="none" defaultChecked>none</option>
              {albumTypes.map((type, ind) => {
                return (
                  <option className="text-black" key={ind} value={type.album_type_id}>{type.album_type}</option>
                )
              })}
            </select>
          </label>
        </section>
        <section className="mb-4">
          <label className="flex gap-2 mb-4">
            <span className="">Release date:</span>
            <input
              className=""
              type="date"
              name="release_date"
              id="release_date"
            />
          </label>
          <AddImage />
        </section>
        <button className="" value="Save" id="save_songs_lyrics">Add Album</button>
      </form>
      <Footer />
    </>
  );
}

export default EditAlbum;
