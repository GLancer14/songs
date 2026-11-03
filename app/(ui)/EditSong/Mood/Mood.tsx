import { mood } from "@/src/generated/prisma/client";


const Mood = ({ mood, defaultChecked }: { mood: mood; defaultChecked?: boolean }) => {
  return (
    <option
      className="text-black"
      value={mood.mood_id}
      defaultChecked={defaultChecked}
    >
      {mood.mood}
    </option>
  )
}

export default Mood;