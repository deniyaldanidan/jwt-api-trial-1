import z from "zod";

const bearerTokenZodSchema = z.string().startsWith("Bearer ");
export default bearerTokenZodSchema;
