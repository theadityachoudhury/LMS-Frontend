import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email or Username is required")
    .refine(
      (value) => /\S+@\S+\.\S+/.test(value) || /^[a-zA-Z0-9]+$/.test(value),
      {
        message: "Must be a valid email or username",
      },
    ),
  password: z.string().min(1, "Password is required"),
});
