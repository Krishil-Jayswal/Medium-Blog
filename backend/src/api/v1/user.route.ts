import { Hono } from "hono";
import { userBindings, userVariables } from "../../types/hono.type";
import prismaClient from "../../middlewares/prismaClient.middleware";

const userRouter = new Hono<{
  Bindings: userBindings;
  Variables: userVariables;
}>();

userRouter.use("*", prismaClient);

export default userRouter;
