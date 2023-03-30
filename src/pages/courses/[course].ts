import { env } from "env";
import type { APIRoute } from "astro";
import { getEntryBySlug } from "astro:content";
import timingSafeEqual from "@utils/timingSafeEqual";
import errorResponse from "@utils/errorResponse";
import { transformCourse } from "@utils/dataTransformers";

export const get: APIRoute = async ({ params, request }) => {
  const { course } = params;

  const apiSecretKey = request.headers.get("X-API-KEY");

  if (!apiSecretKey || !timingSafeEqual(apiSecretKey, env.API_SECRET_KEY)) {
    return errorResponse({
      statusCode: 403,
      errorMessage: "Unauthorized access.",
    });
  }

  if (!course) {
    return errorResponse({
      statusCode: 404,
      errorMessage: "Content not found.",
    });
  }

  const courseData = await getEntryBySlug("courses", course);

  if (!courseData) {
    return errorResponse({
      statusCode: 404,
      errorMessage: "Content not found.",
    });
  }

  const transformedCourse = transformCourse(courseData);

  return new Response(JSON.stringify(transformedCourse), {
    status: 200,
  });
};
