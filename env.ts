import { z } from "zod";

const schema = z.object({
  API_SECRET_KEY: z.string(),
});

const safelyParsedSchema = schema.safeParse(import.meta.env);

if (safelyParsedSchema.success === false) {
  console.error(
    "❌ Invalid environment variables:",
    JSON.stringify(safelyParsedSchema.error.format(), null, 4)
  );
  throw new Error();
}

export const env = safelyParsedSchema.data;
