import clsx from "clsx";
import s from "./SearchField.module.scss";
import findSearchFieldValue from "@/app/actions/SearchField/searchFields";
import { Prisma } from "@/src/generated/prisma/client";
import React, { useRef, useState } from "react";
import { debounce } from "@/app/lib/decorators";
import Image from "next/image";

const AddImage = ({ name, previousImage }: { name?: string, previousImage?: string | null }) => {
  const staticURL = !process.env.NEXT_PUBLIC_BLOB_STORE_ID ? "" : process.env.NEXT_PUBLIC_STATIC_URL;
  const [image, setImage] = useState(`${staticURL}${previousImage}` || null);
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImage(staticURL + url)
    }
  };

  return (
    <div className="w-full">
      {image &&
        <div className="relative inline-block">
          <Image
            className="object-contain"
            src={image}
            alt={image}
            width={150}
            height={150}
          />
          <button
            className="
              absolute
              -right-3
              -top-3
              flex
              items-center
              justify-center
              w-6
              h-6
              bg-white
              rounded-[50%]
              border-[#677582]
              border
              cursor-pointer
            "
            type="button"
            onClick={() => {
              setImage(null);
            }}
          >
            <img
              className="w-2 h-2"
              src={`${staticURL}/close.svg`}
              alt="close"
            />
          </button>
        </div>
      }
      <label className="flex w-min justify-between mb-8 cursor-pointer">
        <span className="text-center w-30 border border-gray-500">Choose Image</span>
        <input
          className="w-3/5 hidden"
          type="file"
          name={name ? name : "title_image"}
          id="upload-title-image"
          accept="image/jpeg,image/gif,image/png"
          onChange={handleImageChange}
          tabIndex={-1}
        />
      </label>
    </div>
  )
}

export default AddImage;