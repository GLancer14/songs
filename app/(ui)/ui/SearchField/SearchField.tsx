import clsx from "clsx";
import s from "./SearchField.module.scss";

const SearchField = ({
  fieldName,
  required,
  title,
  maxLength = 128,
  className
}: {
  fieldName: string;
  required?: boolean;
  title?: string;
  maxLength?: number;
  className?: string;
}) => {
  return (
    <label
      className={clsx(
        className,
        "flex gap-4 cursor-pointer justify-between")}
    >
      <span className="text-xl">{fieldName}</span>
      <input
        className="p-1 rounded-sm"
        type="search"
        title={title}
        maxLength={maxLength}
        name={fieldName}
        list={`${fieldName}_options`}
        placeholder="Search"
        required={required}
      />
      <datalist id={`${fieldName}_options`}></datalist>
      <button
        className=""
        type="button"
      >add</button>
    </label>
  )
}
export default SearchField;