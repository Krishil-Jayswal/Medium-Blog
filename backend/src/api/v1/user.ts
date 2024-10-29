import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { sign } from "hono/jwt";
import { z } from "zod";
import { hashPassword, verifyPassword } from "../../utils/crypto";

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

        const hashedPassword = await hashPassword(body.password);

        const user = await prisma.user.create({
          data: {
            email: body.email,
            password: hashedPassword,
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
      }
    });

    if(!user) throw new Error();

    const isPasswordValid = await verifyPassword(body.password, user.password);

    if(!isPasswordValid) {
      c.status(401);
      return c.json({
        error: 'Invalid password.'
      });
    }

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
