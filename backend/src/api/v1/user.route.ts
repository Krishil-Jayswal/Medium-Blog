import { Hono } from "hono";
import { userBindings, userVariables } from "@generics/hono.generic";
import prismaClient from "@middlewares/prismaClient.middleware";
import protectRoute from "@middlewares/auth.middleware";

const userRouter = new Hono<{
  Bindings: userBindings;
  Variables: userVariables;
}>();

userRouter.use("*", prismaClient);
userRouter.use("*", protectRoute);

userRouter.get("/profile", async (c) => {
  
});

export default userRouter;
