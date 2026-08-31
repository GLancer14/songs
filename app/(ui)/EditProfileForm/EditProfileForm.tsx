"use client"

import Header from "../Header/Header"
import { users } from "@/src/generated/prisma/client";
import Footer from "../Footer/Footer";
import { useActionState, useState } from "react";
import editPeople from "@/app/actions/editPeople/editPeople";
import AddImage from "../ui/AddImage/AddImage";
import { useRouter } from "next/navigation";
import { ProfileData } from "../Profile/Profile";

const EditProfileForm = ({ profileData }: { profileData: ProfileData }) => {
  const router = useRouter()
  const [state, action, pending] = useActionState(editPeople, undefined)
  const [name, setName] = useState(profileData.name);
  const [email, setEmail] = useState(profileData.email);
  const [bio, setBio] = useState(profileData.bio);

  return (
    <form
      className="flex flex-col self-center p-8 max-w-200 mx-auto bg-white"
      action={action}
      method="POST"
      encType="multipart/form-data"
      onSubmit={() => router.push(`/people`)}
    >
      <h2 className="text-4xl capitalize mb-4 w-300">Add People</h2>
      <section className="flex flex-col flex-1 justify-start mb-8">
        <article className="flex flex-col flex-wrap gap-8 justify-start items-start mb-8 w-1/2">
          <label className="flex gap-4 cursor-pointer justify-between relative w-full mb-8">
            <span className="text-xl">Name</span>
            <input
              className="p-1 rounded-sm w-2/3"
              type="text"
              title={"полное имя человека"}
              maxLength={128}
              name={"name"}
              value={name}
              onInput={(e) => {
                setName(e.currentTarget.value);
              }}
            />
          </label>
        </article>
        <article className="flex flex-col flex-wrap gap-8 justify-start items-start mb-8 w-1/2">
          <label className="flex gap-4 cursor-pointer justify-between relative w-full mb-8">
            <span className="text-xl">Email</span>
            <input
              className="p-1 rounded-sm w-2/3"
              type="text"
              title={"email"}
              maxLength={128}
              name={"email"}
              value={email}
              onInput={(e) => {
                setEmail(e.currentTarget.value);
              }}
            />
          </label>
        </article>
        <section className="flex gap-4 justify-between mb-4">
          <article className="w-1/2">
            <h3>Add avatar</h3>
            <AddImage name="avatar" previousImage={profileData.avatar} />
          </article>
          <article className="w-1/2">
            <h3>Add Cover Art</h3>
            <AddImage name="coverart" previousImage={profileData.coverart} />
          </article>
        </section>
        <article className="w-full mb-4">
          <h2 className="mb-4 text-xl">Change Bio</h2>
          <label className="">
            <textarea
              className="w-full resize-none"
              rows={5}
              maxLength={1024}
              name="description"
              id="description"
              placeholder="Do you like long walks on the beach?"
              onInput={(e) => setBio(e.currentTarget.value)}
            >{bio}</textarea>
          </label>
        </article>
      </section>
      
      <button className="" value="Save" id="save_songs_lyrics">Save</button>
    </form>
  );
}

export default EditProfileForm;
