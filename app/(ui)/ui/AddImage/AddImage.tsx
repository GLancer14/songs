import clsx from "clsx";
import s from "./SearchField.module.scss";
import findSearchFieldValue from "@/app/actions/SearchField/searchFields";
import { Prisma } from "@/src/generated/prisma/client";
import React, { useRef, useState } from "react";
import { debounce } from "@/app/lib/decorators";
import Image from "next/image";

const AddImage = () => {
  const [image, setImage] = useState("");
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImage(url)
    }
  };

  return (
    <div>
      {image !== "" && 
        <Image
          className=""
          src={image || ""}
          alt={image || ""}
          width={100}
          height={100}
        />}
      <div className="flex justify-between mb-8">
        <span className="">Image:</span>
        <input
          className="w-3/5"
          type="file"
          name="title_image"
          id="upload-title-image"
          accept="image/jpeg,image/gif,image/png"
          onChange={handleImageChange}
          tabIndex={-1}
        />
      </div>
    </div>
  )
}

export default AddImage;