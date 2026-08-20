import searchArtist from "@/app/actions/searchArtist/searchArtist";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { FC, useEffect, useState } from "react";

interface ArtistProps {
  id: number;
  type: "groupes" | "people",
  name: string,
  href: string | null,
}

const Artist: FC<ArtistProps> = ({ id, type, name, href }) => {
  const staticURL = !process.env.NEXT_PUBLIC_BLOB_STORE_ID ? "" : process.env.NEXT_PUBLIC_STATIC_URL;
  const [tooltipIsShown, setTooltipIsShown] = useState(false);
  const [searchResult, setSearchResult] = useState<{
    name: string;
    id: number;
    year_of_foundation: number | null;
    country_id: number | null;
    description: string | null;
    image: string | null;
  } | {
    name: string;
    id: number;
    country_id: number | null;
    description: string | null;
    image: string | null;
    firstname: string | null;
    surname: string | null;
    nickname: string | null;
  } | null>(null);

  useEffect(() => {
    const search = async () => {
      const foundArtist = await searchArtist(id, type);

      setSearchResult(foundArtist);
    };

    search();
  }, [id])

  return (
    <div
      className="relative w-min"
      onMouseEnter={() => setTooltipIsShown(true)}
      onMouseLeave={() => setTooltipIsShown(false)}
    >
      <Link href={`/${type}/${href}`} className={clsx("text-4", {
        ["underline"]: !tooltipIsShown,
        ["no-underline"]: tooltipIsShown,
      })}>
        {name}
      </Link>
      <div className={clsx(`
        absolute
        top-5
        left-[calc(50%-156px)]
        w-78
        h-38
        p-5
        bg-white
        text-black
        text-[12px]
      `, {
        ["block"]: tooltipIsShown,
        ["hidden"]: !tooltipIsShown,
      })}>
        <div>
          <Link href={`/${type}/${href}`} className="flex flex-nowrap items-center gap-2">
            <Image
              className="border rounded-[50%] border-transparent"
              src={searchResult?.image
                ? `${staticURL}/backgrounds/groupes/${searchResult.image}`
                : "/noimage2.svg"
              }
              alt="artist image"
              width={44}
              height={44}
            />
            <div className="text-base">{searchResult?.name}</div>
          </Link>
        </div>
        <div
          className="
            h-14
            overflow-hidden
            text-ellipsis
            line-clamp-3
            mt-3
          "
        >
          {searchResult?.description}
        </div>
      </div>
    </div>
  );
}

export default Artist;