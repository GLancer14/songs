"use client"

import userIam from "@/app/actions/userIam";
import Header from "../Header/Header"
import { album_types, Prisma, users } from "@/src/generated/prisma/client";
import SearchField from "../ui/SearchField/SearchField";
import Footer from "../Footer/Footer";
import { useActionState, useState } from "react";
import clsx from "clsx";
import editAuthor from "@/app/actions/EditAuthor/editAuthor";

const EditAuthor = ({ user, authorType }: { user: users | null | undefined; authorType: "music" | "lyrics" }) => {
  const [state, action, pending] = useActionState(editAuthor, undefined)
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [nickname, setNickname] = useState("");
  const [authorTypeVariable, setAuthorTypeVariable] = useState(authorType)

  return (
    <>
      <Header user={user} />
      <form
        className="flex flex-col justify-start p-8 bg-gray-800 grow"
        action={action}
        method="POST"
        encType="multipart/form-data"
      >
        <h2 className="text-4xl capitalize mb-4">Add {authorType} author</h2>
        <section className="flex flex-col justify-start mb-8">
          <article className="w-1/2">
            <label className="flex gap-4 cursor-pointer justify-between relative w-full mb-8">
              <span className="text-xl">Name</span>
              <input
                className="p-1 rounded-sm w-2/3"
                type="text"
                title={"имя автора"}
                maxLength={128}
                name={"author_name"}
                required={true}
                value={name}
                onInput={(e) => {
                  setName(e.currentTarget.value);
                }}
              />
            </label>
            <label className="flex gap-4 cursor-pointer justify-between relative w-full mb-8">
              <span className="text-xl">Surname</span>
              <input
                className="p-1 rounded-sm w-2/3"
                type="text"
                title={"фамилия автора"}
                maxLength={128}
                name={"author_surname"}
                required={true}
                value={surname}
                onInput={(e) => {
                  setSurname(e.currentTarget.value);
                }}
              />
            </label>
            <label className="flex gap-4 cursor-pointer justify-between relative w-full mb-8">
              <span className="text-xl">Nickname</span>
              <input
                className="p-1 rounded-sm w-2/3"
                type="text"
                title={"никнейм автора"}
                maxLength={128}
                name={"author_nickname"}
                required={true}
                value={nickname}
                onInput={(e) => {
                  setNickname(e.currentTarget.value);
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
                maxLength={1024}
                name="author_description"
                id="description"
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
        <input
          className="h-0"
          type="text"
          value={authorTypeVariable}
          name="author_type"
          readOnly
        />
        <button
          className="min-w-max px-2 capitalize"
          value="Save"
          id="save_songs_lyrics"
        >
          Add {authorType} Author
        </button>
      </form>
      <Footer />
    </>
  );
}

export default EditAuthor;
