import { z } from "zod";

export const SignUpSchema = z.object({
  fullname: z
    .string()
    .min(6, { message: "Fullname must me atleast 6 characters long" })
    .max(255, { message: "Fullname cannot be more than 255 characters long" }),

  email: z.string().email({ message: "Invalid email address" }),

  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" })
    .max(20, { message: "Password cannot be more than 20 characters long" }),
});

export const SignInSchema = z.object({
  email: z.string().min(1, "Email is required").max(255),
  password: z.string().min(1, "password is required").max(255)
});
