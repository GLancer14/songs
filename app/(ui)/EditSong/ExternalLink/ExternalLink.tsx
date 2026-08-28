import clsx from "clsx";
import { FC, useState } from "react";

interface ExternalLinkProps {
  form: HTMLFormElement | null;
}

const ExternalLink: FC<ExternalLinkProps> = ({ form }) => {
  const [links, setLinks] = useState(0);

  return (
    <section className={clsx(
      "w-[53.5%] flex flex-row flex-wrap items-center justify-start gap-x-4 mb-2 border p-2",
      {
        ["gap-y-4"]: links > 0,
      }
      )}>
      <h2 className="w-min">External Links:</h2>
      <div className="w-min flex flex-row gap-8">
        <button 
          className="w-10 h-10 border border-black"
          type="button"
          id="add-url"
          onClick={() => setLinks(prev => prev + 1)}
        > + </button>
        <button 
          className="w-10 h-10 border border-black"
          type="button"
          id="add-url"
          onClick={() => (setLinks(prev => {
            if (links > 0) {
              return prev - 1;
            }

            return 0;
          }))}
        > - </button>
      </div>
      {links > 0 && <div className="flex justify-start gap-8 w-full">
        <div className="w-54.75">Name</div>
        <div className="w-[calc(50%-18px)]">URL</div>
      </div>}
      <div className="w-full flex flex-col gap-y-4" id="urls">
        {(Array.from({length: links})).map((link, ind) => {
          return (
            <div
              className="flex gap-8"
              key={ind}
            >
              <input
                className="bg-white"
                type="text"
                name={`${ind}-url-name`}
              />
              <input
                className="bg-white"
                type="text"
                name={`${ind}-url`}
              />
              <select className="border border-black" name={`${ind}-url-type`}>
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

export default ExternalLink;