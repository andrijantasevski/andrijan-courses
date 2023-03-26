import { z } from "zod";

function parseLocalEnv() {
  if (import.meta.env.MODE === "development") {
    const schema = z.object({
      API_SECRET_KEY: z.string(),
    });

    const safelyParsedSchema = schema.safeParse(import.meta.env);

    if (safelyParsedSchema.success === false) {
      console.error(
        "❌ Invalid environment variables:",
        JSON.stringify(safelyParsedSchema.error.format(), null, 4)
      );
      process.exit(1);
    }

    return safelyParsedSchema.data;
  }
}

export const localEnv = parseLocalEnv();
