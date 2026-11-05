import clsx from "clsx";
import { FC, useEffect, useState } from "react";

interface ExternalLinkProps {
  firstDisplayData?: {
    song_id: number;
    id: number;
    url: string;
    url_name: string;
    url_type: string;
  }[];
}

const ExternalLinks: FC<ExternalLinkProps> = ({ firstDisplayData }) => {
  const [links, setLinks] = useState(firstDisplayData?.map(data => {
    return {
      url: data.url,
      name: data.url_name,
      type: data.url_type,
    }
  }) || []);

  return (
    <section className={clsx(
      "w-[53.5%] flex flex-row flex-wrap items-center justify-start gap-x-4 mb-2 border p-2",
      {
        ["gap-y-4"]: links && links.length > 0,
      }
      )}>
      <h2 className="w-min">External Links:</h2>
      <div className="w-min flex flex-row gap-8">
        <button 
          className="w-10 h-10 border border-black"
          type="button"
          id="add-url"
          onClick={() => setLinks([...links, {
              url: "",
              name: "",
              type: ""
          }])}
        > + </button>
        <button 
          className="w-10 h-10 border border-black"
          type="button"
          id="add-url"
          onClick={() => setLinks(links.filter((_, ind) => {
            return ind !== links.length - 1;
          }))}
        > - </button>
      </div>
      {links
        && links.length > 0
        && <div className="flex justify-start gap-8 w-full">
            <div className="w-54.75">Name</div>
            <div className="w-[calc(50%-18px)]">URL</div>
          </div>
      }
      <div className="w-full flex flex-col gap-y-4" id="urls">
        {links.length > 0 && links.map((link, ind) => {
          return (
            <div
              className="flex gap-8"
              key={ind}
            >
              <input
                className="bg-white"
                type="text"
                name="url_name"
                required
                value={link.name}
                onInput={e => setLinks(links.map((linkData, i) => {
                  if (i === ind) {
                    return {
                      ...linkData,
                      name: e.currentTarget.value,
                    };
                  }
                  
                  return linkData;
                }))}
              />
              <input
                className="bg-white"
                type="text"
                name="url"
                required
                value={link.url}
                onInput={e => setLinks(links.map((linkData, i) => {
                  if (i === ind) {
                    return {
                      ...linkData,
                      url: e.currentTarget.value,
                    };
                  }
                  
                  return linkData;
                }))}
              />
              <select
                className="border border-black"
                name="url_type"
                value={link.type}
                onChange={e => setLinks(links.map((linkData, i) => {
                  if (i === ind) {
                    return {
                      ...linkData,
                      type: e.currentTarget.value,
                    };
                  }
                  
                  return linkData;
                }))}
              >
                <option value="youtube">Youtube</option>
                <option value="other">Other</option>
              </select>
            </div>
          )
        })}
      </div>
    </section>
  );
}

export default ExternalLinks;