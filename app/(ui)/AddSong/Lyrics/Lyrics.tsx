import clsx from "clsx"
import s from "./Lyrics.module.scss"

const Lyrics = ({
  lyricsName,
  className,
  required,
  available,
  width,
}: {
  lyricsName: string,
  className?: string,
  required?: boolean,
  available?: boolean,
  width?: string,
}) => {

  return (
    <label
      className={clsx(className, s.hidden, {
          [s.visibility]: !available ? true : false,
        },
        "flex flex-col text-xl gap-1"
      )}
      style={{
        width: width,
      }}
    >
      <span className="">{lyricsName}</span>
      <textarea
        className="resize-none"
        name={`${lyricsName}Text`}
        wrap="soft"
        rows={20}
        maxLength={4096}
        required={required}
      ></textarea>
    </label>
  )
}

export default Lyrics;