"use client"

import Header from "@/app/(ui)/Header/Header"
import { users } from "@/src/generated/prisma/client";
import Footer from "@/app/(ui)/Footer/Footer";
import { useActionState, useState } from "react";
import editPeople from "@/app/actions/editPeople/editPeople";
import AddImage from "@/app/(ui)/ui/AddImage/AddImage";
import { useRouter } from "next/navigation";
import addPeople from "@/app/actions/addPeople/addPeople";

const EditPeople = ({
  user,
  edit,
  peopleData,
  peopleCountry,
}: {
  user: users | null | undefined;
  edit?: boolean;
  peopleData?: {
    name: string;
    id: number;
    firstname: string | null;
    surname: string | null;
    nickname: string | null;
    description: string | null;
    image: string | null;
    country_id: number | null;
} | null;
  peopleCountry?: string | null;
}) => {
  const router = useRouter()
  const [state, action, pending] = useActionState(edit ? editPeople : addPeople, undefined)
  const [name, setName] = useState(peopleData?.name || "");
  const [firstname, setFirstname] = useState(peopleData?.firstname || "");
  const [surname, setSurname] = useState(peopleData?.surname || "");
  const [country, setCountry] = useState(peopleCountry || "");
  const [nickname, setNickname] = useState(peopleData?.nickname || "");
  const [type, setType] = useState("");
  const [description, setDescription] = useState(peopleData?.description || "");

  return (
    <>
      <Header user={user} />
      <form
        className="flex flex-col justify-start p-8 max-w-300 mx-auto bg-white"
        action={action}
        method="POST"
        encType="multipart/form-data"
        onSubmit={() => router.push(`/api/people`)}
      >
        <h2 className="text-4xl capitalize mb-4 w-300">{edit ? `Edit ${peopleData?.name}` : "Add"}</h2>
        <section className="flex flex-col flex-1 justify-start mb-8">
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
                value={description}
                onInput={(e) => setDescription(e.currentTarget.value)}
              ></textarea>
            </label>
          </article>
          <article className="w-0 h-0 opacity-0">
            {edit && 
              <input
                type="text"
                className="h-0 w-0"
                value={peopleData?.id}
                name="people_id"
                readOnly
              />
            }
          </article>
        </section>
        <section className="mb-4">
          <AddImage previousImage={`/backgrounds/people/${peopleData?.image}`} />
        </section>
        <button className="" value="Save" id="save_songs_lyrics">{!edit ? "Add" : "Edit"} People</button>
      </form>
      <Footer />
    </>
  );
}

export default EditPeople;
