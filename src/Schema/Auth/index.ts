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

export const registerSchema = z
  .object({
    email: z
      .string()
      .nonempty("Email is required")
      .email("Invalid email address"),
    username: z
      .string()
      .nonempty("Username is required")
      .min(3, "Username must be at least 3 characters long")
      .max(20, "Username must be at most 20 characters long"),
    firstname: z
      .string()
      .nonempty("First name is required")
      .min(2, "First name must be at least 2 characters long")
      .max(50, "First name must be at most 50 characters long"),
    lastname: z
      .string()
      .nonempty("Last name is required")
      .min(2, "Last name must be at least 2 characters long")
      .max(50, "Last name must be at most 50 characters long"),
    password: z
      .string()
      .nonempty("Password is required")
      .min(8, "Password must be at least 8 characters long")
      .max(50, "Password must be at most 50 characters long")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[!@#$%^&*(),.?":{}|<>]/,
        "Password must contain at least one special character",
      ),
    confirmPassword: z
      .string()
      .nonempty("Confirm password is required")
      .min(8, "Confirm password must be at least 8 characters long")
      .max(50, "Confirm password must be at most 50 characters long")
      .regex(
        /[A-Z]/,
        "Confirm password must contain at least one uppercase letter",
      )
      .regex(
        /[a-z]/,
        "Confirm password must contain at least one lowercase letter",
      )
      .regex(/[0-9]/, "Confirm password must contain at least one number")
      .regex(
        /[!@#$%^&*(),.?":{}|<>]/,
        "Confirm password must contain at least one special character",
      ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });
