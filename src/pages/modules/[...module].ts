import { localEnv } from "env";
import type { APIRoute } from "astro";
import { getCollection, getEntryBySlug } from "astro:content";
import timingSafeEqual from "@utils/timingSafeEqual";
import errorResponse from "@utils/errorResponse";
import { transformLessonLight, transformModule } from "@utils/dataTransformers";
import { getRuntime } from "@astrojs/cloudflare/runtime";
import type { CloudflareEnv } from "env";

export const get: APIRoute = async ({ params, request }) => {
  const runtime = getRuntime<CloudflareEnv>(request);

  const apiSecretKeyEnv =
    localEnv?.API_SECRET_KEY ?? runtime.env.API_SECRET_KEY;

  if (!apiSecretKeyEnv) {
    return errorResponse({
      statusCode: 500,
      errorMessage: "Missing API_SECRET_KEY environment variable",
    });
  }

  const apiSecretKey = request.headers.get("X-API-KEY");

  if (!apiSecretKey || !timingSafeEqual(apiSecretKey, apiSecretKeyEnv)) {
    return errorResponse({
      statusCode: 403,
      errorMessage: "Unauthorized access.",
    });
  }

  const { module } = params;

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

  const transformedLessonsPerModule =
    lessonsPerModule.map(transformLessonLight);

  return new Response(
    JSON.stringify({ ...transformedModule, transformedLessonsPerModule }),
    {
      status: 200,
    }
  );
};
