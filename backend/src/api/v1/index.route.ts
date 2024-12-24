import { Hono } from "hono";
import authRouter from "./auth.route";
import userRouter from "./user.route";

const V1Router = new Hono();

V1Router.route("/auth", authRouter);

V1Router.route("/user", userRouter);

export default V1Router;
