import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { sign } from "hono/jwt";
import { z } from "zod";

const signupInput = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().optional()
});

const signinInput = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export const userRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string,
        JWT_SECRET: string
    }
}>();

userRouter.post('/signup', async (c) => {
    
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate());

    try {
        const body = await c.req.json();

        const { success } = signupInput.safeParse(body);

        if(!success) {
          c.status(400);
          return c.json({
            error: 'Invalid input.'
          });
        }

        const user = await prisma.user.create({
          data: {
            email: body.email,
            password: body.password,
            name: body.name
          }
        });
    
        const token = await sign({id:user.id}, c.env.JWT_SECRET);
    
        return c.json({
          token
        });
    
    } catch (error) {
        console.error(error);
    
        c.status(403);
        return c.json({
          error: 'Error while signing up.'
        });
    } 
});

userRouter.post('/signin', async (c) => {
    
  const primsa = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL
  }).$extends(withAccelerate());

  try {
    const body = await c.req.json();

    const { success } = signinInput.safeParse(body);

    if(!success) {
      c.status(400);
      return c.json({
        error: 'Invalid input.'
      });
    }

    const user = await primsa.user.findUnique({
      where: {
        email: body.email,
        password: body.password
      }
    });

    if(!user) throw new Error();

    const token = await sign({id:user.id}, c.env.JWT_SECRET);

    return c.json({
      token
    });
  } catch(error) {
    console.error(error);

    c.status(403);
    return c.json({
      error: 'User not found'
    });
  }
});
