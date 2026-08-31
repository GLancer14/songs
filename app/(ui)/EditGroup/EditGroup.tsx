"use client"

import userIam from "@/app/actions/userIam";
import Header from "../Header/Header"
import { album_types, Prisma, users } from "@/src/generated/prisma/client";
import Footer from "../Footer/Footer";
import { useActionState, useState } from "react";
import addGroup from "@/app/actions/addGroup/addGroup";
import AddImage from "../ui/AddImage/AddImage";
import editGroup from "@/app/actions/editGroup/editGroup";

const EditGroup = ({
  user,
  edit,
  groupData,
  groupCountry,
}: {
  user: users | null | undefined;
  edit?: boolean;
  groupData?: {
    name: string;
    description: string | null;
    year_of_foundation: number | null;
    image: string | null;
    id: number;
    country_id: number | null;
  } | null;
  groupCountry?: string | null;
}) => {
  const [state, action, pending] = useActionState(edit ? editGroup : addGroup, undefined)
  const [name, setName] = useState(edit ? groupData?.name : "");
  const [country, setCountry] = useState(groupCountry || "");
  const [year, setYear] = useState(groupData?.year_of_foundation || 2000);
  const [desc, setDesc] = useState(groupData?.description || "");

  return (
    <>
      <Header user={user} />
      <form
        className="flex flex-col flex-1 justify-start p-8 w-300 min-w-3xl mx-auto bg-white"
        action={action}
        method="POST"
        encType="multipart/form-data"
      >
        <h2 className="text-4xl capitalize mb-4">{edit ? `Edit ${groupData?.name}` : "Add"} Group</h2>
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
                value={desc}
                onInput={(e) => setDesc(e.currentTarget.value)}
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
                value={year}
                onInput={(e) => setYear(+e.currentTarget.value)}
              />
            </label>
          </article>
          <article className="w-0 h-0 opacity-0">
            {edit && 
              <input
                type="text"
                className="h-0 w-0"
                value={groupData?.id}
                name="group_id"
              />
            }
          </article>
        </section>
        <section className="mb-4">
          <AddImage previousImage={`/backgrounds/groupes/${groupData?.image}`} />
        </section>
        <button className="" value="Save" id="save_songs_lyrics">{!edit ? "Add" : "Edit"} Group</button>
      </form>
      <Footer />
    </>
  );
}

export default EditGroup;
