

const Mood = ({ mood }: { mood: string }) => {
  return (
    <option
      className="text-black"
      value={mood}
    >
      {mood}
    </option>
  )
}

export default Mood;