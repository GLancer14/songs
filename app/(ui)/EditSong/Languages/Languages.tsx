const Languages = ({ language }: { language: string }) => {
  return (
    <label className="w-1/6 gap-4">
      <input
        className=""
        type="radio"
        maxLength={64}
        name="orig_lang"
        value={language}
        defaultChecked={language === "english_orig"}
      />
      <span className="">{language}</span>
    </label>
  )
}

export default Languages;