import { SetStateAction } from "react";

interface ShowButtonProps {
  show: boolean;
  setShow: (value: SetStateAction<boolean>) => void;
}

const ShowButton: React.FC<ShowButtonProps> = ({ show, setShow }) => {
  return (
    <button
      className="cursor-pointer"
      type="button"
      onClick={() => setShow(prev => !prev)}
    >
      {show
        ? <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 18" width="14px" height="14px">
          <path d="M0 0h18v18H0V0Z"></path>
          <path d="M3.857 8.143h10.286v1.714H3.857V8.143Z" fill="white"></path>
        </svg>
        : <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 18" width="14px" height="14px">
          <path d="M0 0h18v18H0V0Z"></path>
          <path d="M14.143 8.143H9.857V3.857H8.143v4.286H3.857v1.714h4.286v4.286h1.714V9.857h4.286V8.143Z" fill="white"></path>
        </svg>}
    </button>
  )
}

export default ShowButton;