import { z } from "zod";

export interface CloudflareEnv {
  API_SECRET_KEY: string;
}

function parseLocalEnv() {
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

export const localEnv =
  import.meta.env.MODE === "development" ? parseLocalEnv() : null;
