import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { createMiddleware } from "hono/factory";

const prismaClient = createMiddleware(async (c, next) => {
    const client = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL!
    }).$extends(withAccelerate());

    c.set('client', client);
    await next();
});

export default prismaClient;
