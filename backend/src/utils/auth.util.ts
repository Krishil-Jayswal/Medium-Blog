import { Context } from "hono";
import { deleteCookie, setCookie } from "hono/cookie";
import { sign } from "hono/jwt";

export async function generateAndSetCookie(c: Context, userId: string): Promise<void> {
  const secret = c.env.JWT_SECRET! || "JWT_SECRET";
  const token = await sign(
    { id: userId, exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60 },
    secret
  );
  setCookie(c, "jwt_medium", token, {
    maxAge: 7 * 24 * 60 * 60, // Max 7 days
    sameSite: "Lax", // CSRF protection
    httpOnly: true, // XSS protection
    path: "/",
  });
}

export function clearCookie(c: Context) {
    deleteCookie(c, "jwt_medium");
}
