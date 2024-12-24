import { Context } from "hono";
import { sign } from "hono/utils/jwt/jwt";
import { setCookie } from "hono/cookie";

export function generateUsername(email: string): string {
  let baseusername = email
    .split("@")[0]
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
  const username = baseusername + Math.floor(Math.random() * 10000);
  return username;
}

const imageCollection = [
  "notionists-neutral",
  "adventurer-neutral",
  "fun-emoji",
];
const imageName = [
  "Garfield",
  "Tinkerbell",
  "Annie",
  "Loki",
  "Cleo",
  "Angel",
  "Bob",
  "Mia",
  "Coco",
  "Gracie",
  "Bear",
  "Bella",
  "Abby",
  "Harley",
  "Cali",
  "Leo",
  "Luna",
  "Jack",
  "Felix",
  "Kiki",
];

export function generateProfileImage(): string {
  const idx1 = Math.floor(Math.random() * imageCollection.length);
  const idx2 = Math.floor(Math.random() * imageName.length);
  return `https://api.dicebear.com/6.x/${imageCollection[idx1]}/svg?seed=${imageName[idx2]}`;
}

export async function generateAndSetCookie(
  c: Context,
  userId: string
): Promise<void> {
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
