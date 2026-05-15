"use client"

import logout from "@/app/actions/logout";
import { refresh } from "next/cache";
import { redirect } from "next/navigation";

const LogoutButton = () => {
  const handleLogout = async () => {
    try {
      await logout();
      window.location.replace("/")
    } catch(e) {
      if (e instanceof Error) return console.error(e.message);
    }
  }

  return (
    <button type="button" onClick={handleLogout}>
      Logout
    </button>
  )
}

export default LogoutButton;