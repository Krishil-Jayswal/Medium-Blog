import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { verify } from "hono/jwt";
import { ResponseMessage } from "../../utils/responseMessages";
import { ResponseStatus } from "../../utils/statusCodes";
import { protectedBlogBindings, protectedBlogVariables, publicBlogBindings } from "../../types/types";
import { createBlogInput, updateBlogInput } from "@jkrishil/medium-blog-common";

export const publicBlogRouter = new Hono<{
  Bindings: publicBlogBindings,
}>();

export const protectedBlogRouter = new Hono<{
  Bindings: protectedBlogBindings,
  Variables: protectedBlogVariables,
}>();

publicBlogRouter.get('/bulk', async (c) => {
  
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const blogs = await prisma.post.findMany({
      select: {
        id: true,
        title: true,
        content: true,
        author: {
          select: {
            name: true,
          },
        },
      },
    });

    return c.json({blogArray: blogs}, ResponseStatus.Success);

  } catch(error: any) {
    console.error('BULK ERROR: ' + error.message);
    return c.json({error: ResponseMessage.InternalError, msg: ResponseMessage.IEBulk}, ResponseStatus.InternalError);
  }
});

publicBlogRouter.get('/:blogId', async (c) => {

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const id = c.req.param("blogId");
  try {
    if (id.length !== 36) throw new Error('InvalidBlogId');

    const blog = await prisma.post.findFirst({
      where: {
        id: id,
      },
      select: {
        id: true,
        title: true,
        content: true,
        author: {
          select: {
            name: true,
          },
        },
      },
    });

    if(!blog) throw new Error('BlogNotFound');

    return c.json({blog}, ResponseStatus.Success);

  } catch (error: any) {
    if(error.message === 'InvalidBlogId') {
      return c.json({error: ResponseMessage.InvalidBlogId}, ResponseStatus.InvalidInput);
    }

    if(error.message === 'BlogNotFound') {
      return c.json({error: ResponseMessage.BlogNotFound}, ResponseStatus.NotFound);
    }

    console.error(':BLOGID ERROR ' + error.message);
    return c.json({error: ResponseMessage.InternalError, msg: ResponseMessage.IEBlog}, ResponseStatus.InternalError);
  }
});

protectedBlogRouter.use("*", async (c, next) => {
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

protectedBlogRouter.post('/', async (c) => {
  
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const body = await c.req.json();

    const { success } = createBlogInput.safeParse(body);

    if (!success) throw new Error('InvalidInput');

    const blog = await prisma.post.create({
      data: {
        title: body.title,
        content: body.content,
        authorId: c.get("userId"),
      },
    });

    return c.json({id: blog.id, msg: ResponseMessage.BlogCreated}, ResponseStatus.Success);

  } catch (error: any) {
    if(error.message === 'InvalidInput') {
      return c.json({error: ResponseMessage.InvalidInput}, ResponseStatus.InvalidInput);
    }

    console.error('Post Blog Error: ' + error.message);
    return c.json({error: ResponseMessage.InternalError, msg: ResponseMessage.IECreateBlog}, ResponseStatus.InternalError);
  }
});

protectedBlogRouter.put('/', async (c) => {
  
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const body = await c.req.json();

    const { success } = updateBlogInput.safeParse(body);

    if (!success) throw new Error('InvalidInput');

    if(body.id.length !== 36) throw new Error('InvalidBlogId');

    const blog = await prisma.post.update({
      where: {
        id: body.id,
        authorId: c.get('userId')
      },
      data: {
        title: body.title,
        content: body.content,
      },
    });

    return c.json({msg: ResponseMessage.BlogUpdated}, ResponseStatus.Success);

  } catch (error: any) {
    if(error.message === 'InvalidInput') {
      return c.json({error: ResponseMessage.InvalidInput}, ResponseStatus.InvalidInput);
    }

    if(error.message === 'InvalidBlogId') {
      return c.json({error: ResponseMessage.InvalidBlogId}, ResponseStatus.InvalidInput);
    }

    if(error.code === 'P2025') {
      return c.json({error: ResponseMessage.BlogNotFound}, ResponseStatus.NotFound);
    }

    console.error('Update Blog Error: ' + error.message);
    return c.json({error: ResponseMessage.InternalError, msg: ResponseMessage.IEBlogUpdate}, ResponseStatus.InternalError);
  }
});
