import clsx from "clsx";
import s from "./SearchField.module.scss";
import findSearchFieldValue from "@/app/actions/SearchField/searchFields";
import { Prisma } from "@/src/generated/prisma/client";
import React, { useRef, useState } from "react";
import { debounce } from "@/app/lib/decorators";

const SearchField = ({
  tableData,
  required,
  title,
  maxLength = 128,
  className
}: {
  tableData: {
    name: Prisma.ModelName;
    fields: string;
    title: string;
  };
  required?: boolean;
  title?: string;
  maxLength?: number;
  className?: string;
}) => {
  const [searchResults, setSearchResults] = useState<Array<any> | null>(null);
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [searchVisible, setSearchVisible] = useState(false);
  const listRef = useRef(null)

  return (
    <label
      className={clsx(
        className,
        "flex gap-4 cursor-pointer justify-between relative"
      )}
    >
      <span className="text-xl">{tableData.name + ` ${tableData.fields}`}</span>
      <input
        className="p-1 rounded-sm"
        type="text"
        title={title}
        maxLength={maxLength}
        name={tableData.name + `_${tableData.fields}-input`}
        list={`${tableData}_options`}
        placeholder="Search"
        required={required}
        value={searchValue}
        onFocus={() => {
          setSearchVisible(true);
        }}
        onInput={async (e: React.InputEvent<HTMLInputElement>) => {
          if (e.currentTarget) {
            setSearchValue(e.currentTarget.value);
            if (e.currentTarget.value === "") {
              return setSearchResults(null);
            }

            const currentSearchResults = await findSearchFieldValue(searchValue, tableData.fields, tableData.name);
            if (currentSearchResults && currentSearchResults.length > 0) {
              setSearchResults(currentSearchResults)
            }
          }
        }}
      />
      <ul
        ref={listRef}
        className="absolute mt-20 text-white bg-gray-800 w-full"
        id={`${tableData.fields}_options`}
      >
        {searchVisible && searchResults && searchResults.length > 0 && 
          searchResults.map((searchOption, ind) => {
            return (
              <li
                key={ind}
                className="border-2 border-gray-600 p-1"
                onClick={() => {
                  setSearchVisible(true);
                  setSelectedFields([
                    ...selectedFields,
                    searchOption[tableData.fields],
                  ]);
                  setSearchValue("");
                  setSearchResults(null);
                }}
              >
                {searchOption[tableData.fields]}
              </li>
            )
          })
        }
      </ul>
      <div>
        {selectedFields.map((selectedField, ind) => {
          return (
            <div key={ind} className="inline w-min">
              <input
                className="bg-gray-900 w-min text-white"
                disabled={true}
                value={selectedField}
                name={tableData.name + `_${tableData.fields}`}
              />
              <span onClick={() => {
                setSelectedFields(selectedFields.filter(droppedSelectedField => {
                  return selectedField !== droppedSelectedField;
                }))
              }}>x</span>
            </div>
          )
        })}
      </div>
      <button
        className=""
        type="button"
        onClick={() => {
          if (searchValue !== "") {
            setSelectedFields([
              ...selectedFields,
              searchValue,
            ]);
          }
        }}
      >Добавить</button>
    </label>
  )
}
export default SearchField;