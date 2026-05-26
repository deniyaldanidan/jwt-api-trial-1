import z from "zod";

const signUpZodSchema = z.object(
  {
    username: z
      .string("username should be a string")
      .trim()
      .min(3, "minimum 3 characters needed")
      .max(36, "max only 36 characters are allowed")
      .regex(
        /^[a-zA-Z0-9_-]+$/g,
        "Should only contain alphanumeric characters, _ and -",
      ),
    email: z.email({ error: "Should be an valid email" }),
    password: z.string("password should be a string").min(8),
  },
  { error: "User object is missing!" },
);

export default signUpZodSchema;
