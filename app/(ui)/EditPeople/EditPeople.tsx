"use client"

import Header from "../Header/Header"
import { users } from "@/src/generated/prisma/client";
import Footer from "../Footer/Footer";
import { useActionState, useState } from "react";
import editPeople from "@/app/actions/EditPeople/editPeople";
import AddImage from "../ui/AddImage/AddImage";

const EditPeople = ({ user }: { user: users | null | undefined }) => {
  const [state, action, pending] = useActionState(editPeople, undefined)
  const [name, setName] = useState("");
  const [firstname, setFirstname] = useState("");
  const [surname, setSurname] = useState("");
  const [country, setCountry] = useState("");
  const [nickname, setNickname] = useState("");
  const [type, setType] = useState("");

  return (
    <>
      <Header user={user} />
      <form
        className="flex flex-col justify-start p-8 max-w-300 mx-auto bg-white"
        action={action}
        method="POST"
        encType="multipart/form-data"
        onSubmit={() => window.location.replace(`/people`)}
      >
        <h2 className="text-4xl capitalize mb-4">Add People</h2>
        <section className="flex flex-col justify-start mb-8">
          <article className="flex flex-col flex-wrap gap-8 justify-start items-start mb-8 w-1/2">
            <label className="flex gap-4 cursor-pointer justify-between relative w-full mb-8">
              <span className="text-xl">Name</span>
              <input
                className="p-1 rounded-sm w-2/3"
                type="text"
                title={"полное имя человека"}
                maxLength={128}
                name={"people_name"}
                required={true}
                value={name}
                onInput={(e) => {
                  setName(e.currentTarget.value);
                }}
              />
            </label>
            <label className="flex gap-4 cursor-pointer justify-between relative w-full mb-8">
              <span className="text-xl">First Name</span>
              <input
                className="p-1 rounded-sm w-2/3"
                type="text"
                title={"имя человека"}
                maxLength={128}
                name={"people_firstname"}
                required={true}
                value={firstname}
                onInput={(e) => {
                  setFirstname(e.currentTarget.value);
                }}
              />
            </label>
            <label className="flex gap-4 cursor-pointer justify-between relative w-full mb-8">
              <span className="text-xl">Surname</span>
              <input
                className="p-1 rounded-sm w-2/3"
                type="text"
                title={"фамилия человека"}
                maxLength={128}
                name={"people_surname"}
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
                title={"ник человека"}
                maxLength={128}
                name={"people_nickname"}
                value={nickname}
                onInput={(e) => {
                  setNickname(e.currentTarget.value);
                }}
              />
            </label>
            <label className="flex gap-4 cursor-pointer justify-between relative w-full mb-8">
              <span className="text-xl">Type</span>
              <input
                className="p-1 rounded-sm w-2/3"
                type="text"
                title={"тип"}
                maxLength={128}
                name={"people_type"}
                required={true}
                value={type}
                onInput={(e) => {
                  setType(e.currentTarget.value);
                }}
              />
            </label>
            <label className="flex gap-4 cursor-pointer justify-between relative w-full mb-8">
              <span className="text-xl">Country</span>
              <input
                className="p-1 rounded-sm w-2/3"
                type="text"
                title={"страна человека"}
                maxLength={128}
                name={"people_country"}
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
        </section>
        <section className="mb-4">
          <AddImage />
        </section>
        <button className="" value="Save" id="save_songs_lyrics">Add People</button>
      </form>
      <Footer />
    </>
  );
}

export default EditPeople;
