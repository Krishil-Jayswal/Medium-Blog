import { z } from "zod";

export const signupInput = z.object({
  name: z
    .string()
    .min(3, "Name must be atleast 3 characters long.")
    .max(50, "Name must not exceed 50 characters."),
  email: z.string().email({ message: "Invalid email address format." }),
  password: z
    .string()
    .min(6, "Password must be atleast 6 characters long.")
    .max(20, "Password must not exceed 20 characters.")
    .regex(
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/,
      "Password must include atleast one uppercase letter, one lowercase letter and one digit."
    ),
});

export const signinInput = z.object({
  email: z.string().email({ message: "Invalid email address format." }),
  password: z
    .string()
    .min(6, "Password must be atleast 6 characters long.")
    .max(20, "Password must not exceed 20 characters.")
    .regex(
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/,
      "Password must include atleast one uppercase letter, one lowercase letter and one digit."
    ),
});

export const createBlogInput = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
});

export const updateBlogInput = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  id: z.string().length(36),
});

export type SignupInput = z.infer<typeof signupInput>;

export type SigninInput = z.infer<typeof signinInput>;

export type CreateBlogInput = z.infer<typeof createBlogInput>;

export type UpdateBlogInput = z.infer<typeof updateBlogInput>;

export function isZoderror(error: any): boolean {
  return error instanceof z.ZodError;
}
