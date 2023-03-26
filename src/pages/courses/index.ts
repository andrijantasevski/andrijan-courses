import { localEnv } from "env";
import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import timingSafeEqual from "@utils/timingSafeEqual";
import errorResponse from "@utils/errorResponse";
import { transformCourse } from "@utils/dataTransformers";
import { getRuntime } from "@astrojs/cloudflare/runtime";

interface Env {
  API_SECRET_KEY: string;
}

export const get: APIRoute = async ({ request }) => {
  const runtime = getRuntime<Env>(request);

  const apiSecretKeyEnv =
    localEnv?.API_SECRET_KEY ?? runtime.env.API_SECRET_KEY;

  const apiSecretKey = request.headers.get("X-API-KEY");

  if (!apiSecretKey || !timingSafeEqual(apiSecretKey, apiSecretKeyEnv)) {
    return errorResponse({
      statusCode: 403,
      errorMessage: "Unauthorized access.",
    });
  }

  const coursesCollection = await getCollection("courses");

  if (coursesCollection.length === 0) {
    return errorResponse({
      statusCode: 404,
      errorMessage: "Content not found.",
    });
  }

  const courses = coursesCollection.map(transformCourse);

  return new Response(JSON.stringify(courses), {
    status: 200,
    statusText: "Success",
  });
};
