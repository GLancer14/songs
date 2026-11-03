import clsx from "clsx";
import s from "./SearchField.module.scss";
import findSearchFieldValue from "@/app/actions/SearchField/searchFields";
import { Prisma } from "@/src/generated/prisma/client";
import React, { useEffect, useRef, useState } from "react";
import { debounce } from "@/app/lib/decorators";
import SearchType from "../SearchType/SearchType";

const SearchField = ({
  tableData,
  edit,
  firstShowData,
  fieldName,
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
  edit?: boolean;
  firstShowData?: {
    name: string;
    type?: string;
    track?: string;
  }[];
  fieldName: string;
  required?: boolean;
  title?: string;
  maxLength?: number;
  className?: string;
}) => {
  const [searchResults, setSearchResults] = useState<Array<any> | null>(null);
  const [selectedFields, setSelectedFields] = useState<{
    name: string;
    type?: string;
  }[]>(firstShowData || []);
  const [searchValue, setSearchValue] = useState("");
  const [searchVisible, setSearchVisible] = useState(false);
  const [albums, setAlbums] = useState<{
    name: string;
    track?: string;
  }[]>(firstShowData ? firstShowData : []);
  const listRef = useRef(null);

  useEffect(() => {
    if (edit && firstShowData) {
      setSelectedFields(firstShowData?.map(value => {
        return {
          name: value.name,
          type: value.type,
        };
      }));
    }
  }, []);

  return (
    <label
      className={clsx(
        className,
        "flex gap-4 cursor-pointer justify-between relative"
      )}
      onBlur={() => {
        setSearchVisible(false);
      }}
    >
      <span className="text-xl">{fieldName}</span>
      <input
        className="p-1 rounded-sm"
        type="text"
        title={title}
        maxLength={maxLength}
        name={tableData.name + `_${tableData.fields}-input`}
        list={`${tableData}_options`}
        placeholder="Search"
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
        className="absolute mt-20 text-white bg-gray-800 w-full z-50"
        id={`${tableData.fields}_options`}
        // onBlur={() => {
        //   setSearchVisible(false);
        // }}
      >
        {searchVisible && searchResults && searchResults.length > 0 && 
          searchResults.map((searchOption, ind) => {
            return (
              <li
                key={ind}
                className="border-2 border-gray-600 p-1"
                onClick={() => {
                  // setSearchVisible(true);
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
      <div className="flex flex-column flex-wrap gap-2">
        {selectedFields.map((selectedField, ind) => {
          return (
            <div key={ind} className="flex flex-row flex-nowrap gap-4 justify-between">
              <input
                className="w-min bg-white text-black"
                type="text"
                readOnly={true}
                value={selectedField.name}
                name={tableData.name}
                required={required}
              />
              {(fieldName.toLowerCase() === "люди" || fieldName.toLowerCase() === "группа") ?
                <SearchType
                  tableData={tableData}
                  maxLength={maxLength}
                  required={true}
                  firstViewData={selectedField.type}
                />
                : fieldName.toLowerCase() === "альбомы"
                  ? albums && albums?.length > 0 && <div>
                      <span>Track №: </span>
                      <input
                        className="w-12"
                        type="number"
                        min={1}
                        max={999}
                        name="track"
                        id="track"
                        value={String(albums.find(value => {
                          if (value.name === selectedField.name) {
                            return true;
                          }
                        })?.track)}
                        onInput={e => {
                          const newValue = albums.map(value => {
                            if (value.name === selectedField.name) {
                              return {
                                name: value.name,
                                track: e.currentTarget.value,
                              }
                            }

                            return value
                          });

                          setAlbums(newValue)
                        }}
                      />
                    </div>
                  : null
              }
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
        className="border-black border"
        type="button"
        onClick={() => {
          if (searchValue !== "") {
            setSelectedFields([
              ...selectedFields,
              {
                name: searchValue
              },
            ]);
          }
        }}
      >Добавить</button>
    </label>
  )
}
export default SearchField;