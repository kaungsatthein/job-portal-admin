"use server";

import { cookies } from "next/headers";

export const getCookieStore = async (key: string): Promise<string | null> => {
  const storeCookie = await cookies();
  return storeCookie.get(key)?.value || null;
};

export const setCookieStore = async (key: string, value: string) => {
  const storeCookie = await cookies();
  storeCookie.set(key, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
};

export const removeCookieStore = async (key: string) => {
  const storeCookie = await cookies();
  storeCookie.delete(key);
};
