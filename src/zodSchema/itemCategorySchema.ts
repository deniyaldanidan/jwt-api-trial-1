import z from "zod";

export const addItemCategoryZodSchema = z.object(
  {
    name: z
      .string("name should be string")
      .trim()
      .min(1, "Need atleast one character")
      .max(32, "Max 32 characters allowed")
      .toLowerCase()
      .regex(/^[a-z ]+$/, "Only alphabets and spaces are allowed"),
  },
  { error: "Category object is missing" },
);
