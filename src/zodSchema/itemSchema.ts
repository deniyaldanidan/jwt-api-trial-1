import z from "zod";

export const addItemZodSchema = z.object(
  {
    name: z
      .string("name should be a string")
      .min(1, "should atleast have an 1 character")
      .max(45, "max 45 characters allowed")
      .regex(
        /^[a-zA-Z0-9 ,_-]+$/,
        "only allows alphanumeric characters, comma',', space, _ and -",
      ),
    price: z
      .int("Should be an Integer")
      .min(1, "Should be above or equal to 1"),
    description: z
      .string("Should be a string")
      .min(1, "Should atleast contains a single character")
      .max(1000, "Max 1000 characters are allowed"),
    item_qty: z
      .int("Should be an Integer")
      .min(1, "Should be above or equal to 1"),
    item_unit: z
      .string("should be an string")
      .min(1, "Atleast 1 character needed")
      .max(36, "max 36 characters allowed"),
    veg: z.boolean("Should be an Boolean").default(false),
    category_id: z.int("Should be an valid category id"),
  },
  { error: "item object is missing" },
);

export const editItemZodSchema = addItemZodSchema.extend({
  id: z.int("Id should be an Int"),
});
