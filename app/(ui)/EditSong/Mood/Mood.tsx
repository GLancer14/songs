import { mood } from "@/src/generated/prisma/client";


const Mood = ({ mood }: { mood: mood }) => {
  return (
    <option
      className="text-black"
      value={mood.mood_id}
    >
      {mood.mood}
    </option>
  )
}

export default Mood;