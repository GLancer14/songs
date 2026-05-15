const Languages = ({ language }: { language: string }) => {
  return (
    <label className="w-1/6 gap-4">
      <input
        className=""
        type="checkbox"
        maxLength={64}
        name="origLangs[]"
        value={language}
      />
      <span className="">{language}</span>
    </label>
  )
}

export default Languages;