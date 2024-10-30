import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { sign } from "hono/jwt";
import { z } from "zod";
import { hashPassword, verifyPassword } from "../../utils/crypto";
import { ResponseMessage } from "../../utils/responseMessages";
import { ResponseStatus } from "../../utils/statusCodes";
import { userBindings } from "../../types/types";

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
    Bindings: userBindings,
}>();

userRouter.post('/signup', async (c) => {
    
  const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL
  }).$extends(withAccelerate());

  try {
      const body = await c.req.json();

      const { success } = signupInput.safeParse(body);

      if(!success) throw new Error('InvalidInput');

      const hashedPassword = await hashPassword(body.password);

      const user = await prisma.user.create({
        data: {
          email: body.email,
          password: hashedPassword,
          name: body.name
        }
      });
  
      const token = await sign({id:user.id}, c.env.JWT_SECRET);
  
      return c.json({token, msg: ResponseMessage.NewResourceCreation}, ResponseStatus.NewResourceCreation);

  } catch (error: any) {
      if(error.message === 'InvalidInput') {
        return c.json({error: ResponseMessage.InvalidInput}, ResponseStatus.InvalidInput);
      }

      if(error.code === 'P2002') {
        return c.json({error: ResponseMessage.CredentialConflict}, ResponseStatus.CredentialConflict);
      }

      console.error('SIGNUP ERROR: ' + error.message);
      return c.json({error: ResponseMessage.InternalError, msg: ResponseMessage.IESignUp}, ResponseStatus.InternalError);
  }
});

userRouter.post('/signin', async (c) => {
    
  const primsa = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL
  }).$extends(withAccelerate());

  try {
    const body = await c.req.json();

    const { success } = signinInput.safeParse(body);

    if(!success) throw new Error('InvalidInput');

    const user = await primsa.user.findUnique({
      where: {
        email: body.email,
      }
    });

    if(!user) throw new Error('UserNotFound');

    const isPasswordValid = await verifyPassword(body.password, user.password);

    if(!isPasswordValid) throw new Error('InvalidCredentials');

    const token = await sign({id:user.id}, c.env.JWT_SECRET);

    return c.json({token, msg: ResponseMessage.LoggedIn}, ResponseStatus.Success);

  } catch(error: any) {
      if(error.message === 'InvalidInput') {
        return c.json({error: ResponseMessage.InvalidInput}, ResponseStatus.InvalidInput);
      }

      if(error.message === 'UserNotFound') {
        return c.json({error: ResponseMessage.UserNotFound}, ResponseStatus.UserNotFound);
      }

      if(error.message === 'InvalidCredentials') {
        return c.json({error: ResponseMessage.InvalidCredentials}, ResponseStatus.InvalidCredentials);
      }

    console.error('SIGNIN ERROR: ' + error.message);
    return c.json({error: ResponseMessage.InternalError, msg: ResponseMessage.IESignIn}, ResponseStatus.InternalError);
  }
});
