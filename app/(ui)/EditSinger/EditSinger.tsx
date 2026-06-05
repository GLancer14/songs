"use client"

import userIam from "@/app/actions/userIam";
import Header from "../Header/Header"
import { album_types, Prisma, users } from "@/src/generated/prisma/client";
import SearchField from "../ui/SearchField/SearchField";
import Footer from "../Footer/Footer";
import { useActionState, useState } from "react";
import clsx from "clsx";
import editAlbum from "@/app/actions/EditAlbum/editAlbum";
import editSinger from "@/app/actions/EditSinger/editSinger";

const EditSinger = ({ user }: { user: users | null | undefined }) => {
  const [state, action, pending] = useActionState(editSinger, undefined)
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");

  return (
    <>
      <Header user={user} />
      <form
        className="flex flex-col justify-start p-8 bg-gray-800"
        action={action}
        method="post"
        encType="multipart/form-data"
      >
        <section className="flex flex-col justify-start mb-8">
          <article className="w-1/2">
            <label className="flex gap-4 cursor-pointer justify-between relative w-full mb-8">
              <span className="text-xl">Name</span>
              <input
                className="p-1 rounded-sm w-2/3"
                type="text"
                title={"имя альбома"}
                maxLength={128}
                name={"singer_name"}
                required={true}
                value={name}
                onInput={(e) => {
                  setName(e.currentTarget.value);
                }}
              />
            </label>
            <label className="flex gap-4 cursor-pointer justify-between relative w-full mb-8">
              <span className="text-xl">Country</span>
              <input
                className="p-1 rounded-sm w-2/3"
                type="text"
                title={"автор альбома"}
                maxLength={128}
                name={"singer_country"}
                required={true}
                value={country}
                onInput={(e) => {
                  setCountry(e.currentTarget.value);
                }}
              />
            </label>
          </article>
          <article className="w-1/2 mb-4">
            <h2 className="mb-4 text-xl">Biography</h2>
            <label className="">
              <textarea
                className="w-full resize-none"
                rows={5}
                maxLength={1024}
                name="biography"
                id="Biography"
              ></textarea>
            </label>
          </article>
        </section>
        <section className="mb-4">
          <img className="" />
          <div className="flex justify-between mb-8">
            <span className="">Image:</span>
            <input
              className="w-3/5"
              type="file"
              name="title_image"
              id="upload-title-image"
              accept="image/jpeg,image/gif,image/png"
              tabIndex={-1}
            />
          </div>
        </section>
        <button className="" value="Save" id="save_songs_lyrics">Add Singer</button>
      </form>
      <Footer />
    </>
  );
}

export default EditSinger;
