import { env } from "../config/index.js";
import type { CookieOptions } from "express";

export const cookiesConfig: CookieOptions = {
    httpOnly: true,
    secure: env.IN_PROD,
    sameSite: env.IN_PROD ? "none" : "lax",
    maxAge: 2 * 60 * 60 * 1000,
}
