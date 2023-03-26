// import { env } from "env";
import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import timingSafeEqual from "@utils/timingSafeEqual";
import errorResponse from "@utils/errorResponse";
import { transformCourse } from "@utils/dataTransformers";
import { getRuntime } from "@astrojs/cloudflare/runtime";

interface Env {
  API_SECRET_KEY: string;
  ENVIRONMENT: string;
}

export const get: APIRoute = async ({ request }) => {
  const runtime = getRuntime<Env>(request);

  if (runtime.env.ENVIRONMENT === "development") {
    errorResponse({ errorMessage: "You are in dev mode.", statusCode: 404 });
  } else {
    errorResponse({ errorMessage: "You are in production.", statusCode: 404 });
  }

  const apiSecretKey = request.headers.get("X-API-KEY");

  if (
    !apiSecretKey ||
    !timingSafeEqual(apiSecretKey, runtime.env.API_SECRET_KEY)
  ) {
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
