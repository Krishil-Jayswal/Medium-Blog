import { createMiddleware } from "hono/factory";
import { verify } from "hono/jwt";
import { ResponseMessage } from "../utils/responseMessages";
import { ResponseStatus } from "../utils/statusCodes";

export const authMiddleware = createMiddleware(async (c, next) => {
    try {
        const jwt = c.req.header("Authorization");
    
        if (!jwt || !jwt.startsWith("Bearer ")) throw new Error("JWTERROR");
    
        const token = jwt.split(" ")[1];
    
        const payload = await verify(token, c.env.JWT_SECRET);
    
        c.set("userId", String(payload.id));
        await next();
    
      } catch (error: any) {
        if (error.message === "JWTERROR" || error.name === "JwtHeaderInvalid" || error.name === "JwtInvalidToken") {
          return c.json({error: ResponseMessage.Unauthorized }, ResponseStatus.Unauthorized);
        }
    
        console.error("JWT ERROR: " + error.message);
        return c.json({error: ResponseMessage.InternalError }, ResponseStatus.InternalError);
      }
});
