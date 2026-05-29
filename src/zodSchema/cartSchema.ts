import z from "zod";

export const addItemToCartZodSchema = z.object(
  {
    item_id: z.int("Item-ID should be an Integer"),
    count: z
      .int("Count should be an Integer")
      .min(1, "Count should always equals or above 1"),
  },
  { error: "Cart Item Object is missing" },
);

export const removeItemFromCartZodSchema = addItemToCartZodSchema
  .omit({
    count: true,
  })
  .extend({ count: z.int("Count should be an Integer") });
