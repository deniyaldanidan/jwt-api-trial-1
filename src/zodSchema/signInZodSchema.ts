import z from "zod";

const signInZodSchema = z.object({
  unameOrEmail: z.string("unameOrEmail must be a string"),
  pwd: z.string("password must be a string"),
});

export default signInZodSchema;
