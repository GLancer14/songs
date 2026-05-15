"use server"

import { refresh } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const logout = async () => {
  const cookieStore = await cookies();
  cookieStore.delete('session');
}

export default logout;