import z from "zod";

const userLocationZodSchema = z.object(
  {
    pincode: z.string("Pincode should be a string"),
    city: z.string("City should be a string"),
    doorno: z.string("doorno should be a string"),
    street: z.string("street should be a string"),
    state: z.string("state should be a string"),
    country: z.string("country should be a string"),
    district: z.string("district should be a string"),
    locality: z.string("locality should be a string").optional(),
    contact: z.string("contact should be a string"),
  },
  { error: "User Location object is missing" },
);

export default userLocationZodSchema;
