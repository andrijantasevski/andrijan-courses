import { env } from "env";
import type { APIRoute } from "astro";
import { getCollection, getEntryBySlug } from "astro:content";
import timingSafeEqual from "@utils/timingSafeEqual";
import errorResponse from "@utils/errorResponse";
import { transformModule } from "@utils/dataTransformers";

export const get: APIRoute = async ({ params, request }) => {
  const { module } = params;

  const apiSecretKey = request.headers.get("X-API-KEY");

  if (!apiSecretKey || !timingSafeEqual(apiSecretKey, env.API_SECRET_KEY)) {
    return errorResponse({
      statusCode: 403,
      errorMessage: "Unauthorized access.",
    });
  }

  if (!module) {
    return errorResponse({
      statusCode: 404,
      errorMessage: "Content not found.",
    });
  }

  const moduleData = await getEntryBySlug("modules", module);

  const lessonsPerModule = await getCollection("lessons", ({ slug }) =>
    slug.includes(module)
  );

  if (!moduleData || lessonsPerModule.length === 0) {
    return errorResponse({
      statusCode: 404,
      errorMessage: "Content not found.",
    });
  }

  const transformedModule = transformModule(moduleData);

  return new Response(JSON.stringify(transformedModule), {
    status: 200,
  });
};
