import { createMiddleware } from "hono/factory";
import { verify } from "hono/jwt";
import { getCookie } from "hono/cookie";
import {
  JWTPayload,
  JwtTokenExpired,
  JwtTokenInvalid,
  JwtTokenSignatureMismatched,
} from "hono/utils/jwt/types";

const protectRoute = createMiddleware(async (c, next) => {
  try {
    const token = getCookie(c, "jwt_medium");

    if (!token) {
      return c.json({ message: "Unauthorized: No token provided" });
    }

    const secret = c.env.JWT_SECRET! || "JWT_SECRET";

    const payload = (await verify(token, secret)) as JWTPayload & {
      id: string;
    };
    c.set("userId", payload.id);
    await next();
  } catch (error: any) {
    if (
      error instanceof JwtTokenExpired ||
      error instanceof JwtTokenInvalid ||
      error instanceof JwtTokenSignatureMismatched
    ) {
      console.log(error.message)
      return c.json({ message: "Unauthorized: Invalid token" }, 400);
    }

    console.log('Error in auth middleware: ' + error.message);
  }
});

export default protectRoute;
