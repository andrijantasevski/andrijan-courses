// import { env } from "env";
import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import timingSafeEqual from "@utils/timingSafeEqual";
import errorResponse from "@utils/errorResponse";
import { transformCourse } from "@utils/dataTransformers";

export const get: APIRoute = async ({ request }) => {
  const apiSecretKey = request.headers.get("X-API-KEY");

  if (!import.meta.env.API_SECRET_KEY) {
    return errorResponse({ errorMessage: "No env variable.", statusCode: 404 });
  }

  if (
    !apiSecretKey ||
    !timingSafeEqual(apiSecretKey, import.meta.env.API_SECRET_KEY)
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
