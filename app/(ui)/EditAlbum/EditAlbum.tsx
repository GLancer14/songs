"use client"

import Header from "../Header/Header";
import { album_types, users } from "@/src/generated/prisma/client";
import SearchField from "../ui/SearchField/SearchField";
import Footer from "../Footer/Footer";
import { FC, useActionState, useEffect, useState } from "react";
import editAlbum from "@/app/actions/EditAlbum/editAlbum";
import addAlbum from "@/app/actions/addAlbum/addAlbum";
import AddImage from "../ui/AddImage/AddImage";
import searchAlbumType from "@/app/actions/searchAblumType/searchAlbumType";
import formatDateForForm from "../utils/formatDateForForm";

interface EditAlbumProps {
  user: users | null | undefined;
  albumTypes: album_types[];
  edit?: boolean;
  albumData?: {
    name: string;
    album_type: number | null;
    release_date: Date | null;
    author: string;
    description: string | null;
    image: string | null;
    album_id: number;
  } | null;
}

const EditAlbum: FC<EditAlbumProps> = ({ user, albumTypes, edit, albumData }) => {
  const [state, action, pending] = useActionState(addAlbum, undefined)
  const [name, setName] = useState(albumData?.name || "");
  const [author, setAuthor] = useState(albumData?.author || "");
  const [desc, setDesc] = useState(albumData?.description || "");
  const [albumTypeId, setAlbumTypeId] = useState<number | undefined>();
  const [date, setDate] = useState<Date>(albumData?.release_date || new Date());

  useEffect(() => {
    const albumTypeFunc = async () => {
      if (albumData?.album_type) {
        const type = await searchAlbumType(albumData?.album_type || 4);
        if (type && type.status === "ok") {
          setAlbumTypeId(type.album_type_id);
        }
      }
    }

    albumTypeFunc();
  }, [albumData?.album_type])

  return (
    <>
      <Header user={user} />
      <form
        className="flex flex-col flex-1 justify-start p-8 w-300 min-w-3xl mx-auto bg-white"
        action={action}
        method="POST"
        encType="multipart/form-data"
      >
        <h2 className="text-4xl capitalize mb-4">{edit ? `Edit ${albumData?.name}` : "Add Album"}</h2>
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
                value={name}
                onInput={(e) => {
                  setName(e.currentTarget.value);
                }}
              />
            </label>
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
                value={desc}
                onInput={(e) => {
                  setDesc(e.currentTarget.value)
                }}
              ></textarea>
            </label>
          </article>
          <label className="flex gap-2">
            <span className="">Album Type:</span>
            <select
              name="album_type"
              id="album_type"
              value={albumTypeId}
              onChange={(e) => {
                setAlbumTypeId(+e.currentTarget.value)
              }}
            >
              <option className="text-black" value="none" defaultChecked>none</option>
              {albumTypes.map((type, ind) => {
                return (
                  <option
                    className="text-black"
                    key={ind}
                    value={type.album_type_id}
                  >
                    {type.album_type}
                  </option>
                );
              })}
            </select>
          </label>
        </section>
        <section className="flex flex-row gap-4 w-full mb-4">
          <SearchField
            edit={edit}
            firstShowData={
              [
                {
                  name: "",
                }
              ]
            }
            tableData={{
              name: "groupes",
              fields: "name",
              title: "Авторы альбома"
            }}
            fieldName="Группа"
            className="flex flex-col justify-start gap-2 mb-2 w-[calc(50%-16px)]"
          />
        </section>
        <section>
          <SearchField
            edit={edit}
            firstShowData={
              [
                {
                  name: "",
                  type: "joe",
                }
              ]
            }
            tableData={{
              name: "people",
              fields: "name",
              title: "Авторы альбома"
            }}
            fieldName="Люди"
            className="flex flex-col justify-start gap-2 mb-2 w-[calc(50%-16px)]"
          />
        </section>
        <section className="mb-4">
          <label className="flex gap-2 mb-4">
            <span className="">Release date:</span>
            <input
              className=""
              type="date"
              name="release_date"
              id="release_date"
              value={formatDateForForm(date)}
              onInput={(e) => {
                setDate(new Date(e.currentTarget.value))
              }}
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
