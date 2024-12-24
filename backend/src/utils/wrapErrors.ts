import { ZodError } from "zod";

export const wrapError = (error: ZodError) => {
  const detailedErrors = error.errors.map((err) => ({
    field: err.path.join("."),
    message: err.message,
  }));

  return detailedErrors;
};
