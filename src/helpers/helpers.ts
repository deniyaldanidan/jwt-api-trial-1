import { CookieOptions } from "express";

export function slugify(data: string) {
  return data.split(" ").join("_");
}

export function addDaysFromToday(days: number) {
  return new Date(new Date().getTime() + days * 24 * 60 * 60 * 1000);
}

export function daysInMilliSeconds(days: number) {
  return days * 24 * 60 * 60 * 1000;
}

export function signInSuccessObj(token: string) {
  return { success: true, auth: token } as const;
}

export function signInRefreshCookieOptions(maxAge: number): CookieOptions {
  return { httpOnly: true, secure: true, sameSite: "none", maxAge };
}
