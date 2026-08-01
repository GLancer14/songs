import findSearchFieldValue from "@/app/actions/SearchField/searchFields";
import { Prisma } from "@/src/generated/prisma/client";
import { FC, useState } from "react";

interface SearchTypeProps {
  tableData: {
    name: Prisma.ModelName;
    fields: string;
    title: string;
  };
  maxLength?: number;
}

const SearchType: FC<SearchTypeProps> = ({ tableData, maxLength }) => {
  const [selectedTypeFields, setSelectedTypeFields] = useState<string[]>([]);
  const [searchTypeValue, setSearchTypeValue] = useState("");
  const [searchTypeVisible, setSearchTypeVisible] = useState(false);
  const [searchTypeResults, setSearchTypeResults] = useState<Array<any> | null>(null);

  return (
    <div className="relative">
      <span className="mr-4">as</span>
      <input
        className="bg-gray-900 w-min text-white"
        type="text"
        maxLength={maxLength}
        name={tableData.name + `_${tableData.fields}-input-as`}
        list={`${tableData}_options`}
        placeholder="Search"
        value={searchTypeValue}
        onFocus={() => {
          setSearchTypeVisible(true);
        }}
        onInput={async (e: React.InputEvent<HTMLInputElement>) => {
          if (e.currentTarget) {
            setSearchTypeValue(e.currentTarget.value);
            if (e.currentTarget.value === "") {
              return setSearchTypeResults(null);
            }
            const currentSearchResults = await findSearchFieldValue(searchTypeValue, tableData.fields, "type");
            if (currentSearchResults && currentSearchResults.length > 0) {
              setSearchTypeResults(currentSearchResults)
            }
          }
        }}
      />
      <ul
        className="absolute text-white bg-gray-800 w-full"
        id={`${tableData.fields}_options`}
        onBlur={() => {
          setSearchTypeVisible(false);
        }}
      >
        {searchTypeVisible && searchTypeResults && searchTypeResults.length > 0 && 
          searchTypeResults.map((searchOption, ind) => {
            return (
              <li
                key={ind}
                className="border-2 border-gray-600 p-1"
                onClick={() => {
                  setSearchTypeVisible(true);
                  setSelectedTypeFields([
                    ...selectedTypeFields,
                    searchOption[tableData.fields],
                  ]);
                  setSearchTypeValue(searchOption.name);
                  setSearchTypeResults(null);
                }}
              >
                {searchOption[tableData.fields]}
              </li>
            )
          })
        }
      </ul>
    </div>
  );
}

export default SearchType;