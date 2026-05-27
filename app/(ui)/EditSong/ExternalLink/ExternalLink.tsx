import { useState } from "react";

const ExternalLink = () => {
  const [links, setLinks] = useState(0);

  return (
    <section className="flex flex-col gap-y-4 mb-2 border-2 p-2">
      <h2 className="w-full">External Links:</h2>
      <div className="flex flex-row gap-8">
        <button 
          className="" 
          type="button"
          id="add-url"
          onClick={() => setLinks(prev => prev + 1)}
        > + </button>
        <button 
          className="" 
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
      <div className="flex flex-col gap-y-4" id="urls">
        {(Array.from({length: links})).map((link, ind) => {
          return (
            <div
              className="flex gap-8"
              key={ind}
            >
              <input
                className="bg-blue-200"
                type="text"
                name="url-name"
              />
              <input
                className="bg-blue-200"
                type="text"
                name="url"
              />
              <select name="url-type">
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