import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { verify } from "hono/jwt";
import { z } from "zod";

const createBlogInput = z.object({
    title: z.string().min(1),
    content: z.string().min(1),
});

const updateBlogInput = z.object({
    title: z.string().min(1),
    content: z.string().min(1),
    id: z.string().length(36)
});

export const blogRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string,
        JWT_SECRET: string
    },
    Variables: {
        userId: string
    }
}>();

blogRouter.use('/*', async (c, next) => {

    const jwt = c.req.header('Authorization');
  
    if(!jwt) {
      c.status(401);
      return c.json({
        error: 'unauthorized'
      });
    }
  
    const token = jwt.split(' ')[1];
  
    const payload = await verify(token, c.env.JWT_SECRET);
  
    if(!payload) {
      c.status(401);
      return c.json({
        error: 'unauthorized'
      });
    }
    
    c.set('userId', String(payload.id));
    await next();
});

blogRouter.post('/', async (c) => {

    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate());

    try {
        const body = await c.req.json();

        const { success } = createBlogInput.safeParse(body);
        
        if(!success) {
            c.status(400);
            return c.json({
                error: 'Invalid input.'
            });
        }

        const blog = await prisma.post.create({
            data: {
                title: body.title,
                content: body.content,
                authorId: c.get('userId')
            }
        });

        return c.json({id: blog.id});
    } catch(errror) {
        c.status(500);
        return c.json({error: 'Error while creating blog.'});
    }
});

blogRouter.put('/', async (c) => {

    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate());

    try {
        const body = await c.req.json();

        const { success } = updateBlogInput.safeParse(body);

        if(!success) {
            c.status(400);
            return c.json({
                error: 'Invalid input.'
            });
        }

        const blog = await prisma.post.update({
            where: {
                id: body.id
            },
            data: {
                title: body.title,
                content: body.content
            }
        });

        return c.json({
            id: blog.id
        });
    } catch(error) {
        c.status(500);
        return c.json({
            error: 'Error while updating blog.'
        });
    }
});

blogRouter.get('/bulk', async (c) => {
    
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate());

    try {
        const blogs = await prisma.post.findMany({
            select: {
                id: true,
                title: true,
                content: true,
                author: {
                    select: {
                        name: true
                    }
                }
            }
        });

        return c.json({
            blogArray: blogs
        });
    } catch(error) {
        c.status(500);
        return c.json({
            error: 'Error while fetching blogs.'
        });
    }
});

blogRouter.get('/:id', async (c) => {
    
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate());

    const id = c.req.param('id');
    try {
        if(id.length !== 36) {
            c.status(400);
            return c.json({
                error: 'Invalid blog ID.'
            });
        }

        const blog = await prisma.post.findFirst({
            where: {
                id: id
            },
            select: {
                id: true,
                title: true,
                content: true,
                author: {
                    select: {
                        name: true
                    }
                }
            }
        });

        return c.json({
            blog
        });
    } catch(error) {
        c.status(500);
        return c.json({
            error: 'Error while fetching the blog.'
        });
    }
});
