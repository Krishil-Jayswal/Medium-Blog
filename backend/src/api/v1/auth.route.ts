import { Hono } from "hono";
import { authBindings, authVariables } from "../../types/hono.type";
import prismaClient from "../../middlewares/prismaClient.middleware";
import { SignInSchema, SignUpSchema } from "../../utils/zod";
import { wrapError } from "../../utils/wrapErrors";
import { hashPassword, verifyPassword } from "../../utils/crypto";
import {
  generateAndSetCookie,
  generateProfileImage,
  generateUsername,
} from "../../utils/generator";
import { ZodError } from "zod";
import { deleteCookie } from "hono/cookie";
import { protectRoute } from "../../middlewares/auth.middleware";

const authRouter = new Hono<{
  Bindings: authBindings;
  Variables: authVariables;
}>();

authRouter.use("*", prismaClient);
authRouter.use("/me", protectRoute);

authRouter.post("/signup", async (c) => {
  try {
    // Input validation
    const body = await c.req.json();
    const response = SignUpSchema.parse(body);
    // Hashing the password
    const hashedPassword = await hashPassword(response.password);
    // Creating the username
    const username = generateUsername(response.email);
    // Creating the profile picture
    const profilePicture = generateProfileImage();
    // Creating the user
    const user = await c.get("client").user.create({
      data: {
        email: response.email,
        username,
        password: hashedPassword,
        fullname: response.fullname,
        profile_image: profilePicture,
      },
    });
    // Set Cookie
    await generateAndSetCookie(c, user.id);
    // return
    return c.json(
      {
        message: "User registered successfully",
        username,
        fullname: response.fullname,
        profile_image: profilePicture,
      },
      201
    );
  } catch (error: any) {
    if (error instanceof ZodError) {
      const errors = wrapError(error);
      return c.json(
        {
          message: "Invalid Input Format",
          errors,
        },
        400
      );
    }

    if (error.code === "P2002") {
      return c.json({ message: "Email already registered" }, 409);
    }

    console.log("Error in signup endpoint: ", error.message);
    return c.json({ message: "Internal Server Error" }, 500);
  }
});

authRouter.post("/signin", async (c) => {
  try {
    // Input validation
    const body = await c.req.json();
    const response = SignInSchema.parse(body);
    // Finding the user
    const user = await c.get("client").user.findUnique({
      where: {
        email: response.email,
      },
    });
    if (!user) {
      return c.json({ message: "Invalid email or password" }, 400);
    }
    // Password verification
    const isPasswordValid = await verifyPassword(
      response.password,
      user.password
    );
    if (!isPasswordValid) {
      return c.json({ message: "Invalid email or password" }, 400);
    }
    // Set Cookie
    await generateAndSetCookie(c, user.id);
    // return
    return c.json({
      message: "Logged in successfully",
      username: user.username,
      fullname: user.fullname,
      profile_image: user.profile_image,
    });
  } catch (error: any) {
    if (error instanceof ZodError) {
      const errors = wrapError(error);
      return c.json({ message: "Invalid input format", errors }, 400);
    }
    console.log("Error in signin endpoint: ", error.message);
    return c.json({ message: "Internal server error" }, 500);
  }
});

authRouter.post("/signout", (c) => {
  // Clear the cookie
  deleteCookie(c, "jwt_medium");
  // return
  return c.json({ message: "Logged out successfully" });
});

authRouter.get("/me", async (c) => {
  const user = await c.get("client").user.findUnique({
    where: {
      id: c.get("userId"),
    },
    select: {
      username: true,
      fullname: true,
      profile_image: true,
    },
  });

  return c.json(user);
});

export default authRouter;
