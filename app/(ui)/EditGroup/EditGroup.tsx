"use client"

import userIam from "@/app/actions/userIam";
import Header from "../Header/Header"
import { album_types, Prisma, users } from "@/src/generated/prisma/client";
import Footer from "../Footer/Footer";
import { useActionState, useState } from "react";
import editGroup from "@/app/actions/EditGroup/editGroup";

const EditGroup = ({ user }: { user: users | null | undefined }) => {
  const [state, action, pending] = useActionState(editGroup, undefined)
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");

  return (
    <>
      <Header user={user} />
      <form
        className="flex flex-col justify-start p-8 bg-gray-800"
        action={action}
        method="POST"
        encType="multipart/form-data"
      >
        <h2 className="text-4xl capitalize mb-4">Add Group</h2>
        <section className="flex flex-col justify-start mb-8">
          <article className="w-1/2">
            <label className="flex gap-4 cursor-pointer justify-between relative w-full mb-8">
              <span className="text-xl">Name</span>
              <input
                className="p-1 rounded-sm w-2/3"
                type="text"
                title={"имя группы"}
                maxLength={128}
                name={"group_name"}
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
                title={"страна группы"}
                maxLength={128}
                name={"group_country"}
                required={true}
                value={country}
                onInput={(e) => {
                  setCountry(e.currentTarget.value);
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
                name="description"
                id="description"
              ></textarea>
            </label>
          </article>
          <article className="w-1/2 mb-4">
            <label className="flex gap-2">
              <span className="">Year of Foundation:</span>
              <input
                className=""
                type="number"
                name="year_of_foundation"
                id="year_of_foundation"
                max="2100"
                min="1900"
                step="1"
              />
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
        <button className="" value="Save" id="save_songs_lyrics">Add Group</button>
      </form>
      <Footer />
    </>
  );
}

export default EditGroup;
