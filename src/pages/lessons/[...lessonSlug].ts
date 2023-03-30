import { env } from "env";
import type { APIRoute } from "astro";
import { getEntryBySlug } from "astro:content";
import timingSafeEqual from "@utils/timingSafeEqual";
import errorResponse from "@utils/errorResponse";
import { transformLesson } from "@utils/dataTransformers";
import getPreviousNextPage from "@utils/paginationHelpers";

export const get: APIRoute = async ({ params, request }) => {
  const apiSecretKey = request.headers.get("X-API-KEY");

  if (!apiSecretKey || !timingSafeEqual(apiSecretKey, env.API_SECRET_KEY)) {
    return errorResponse({
      statusCode: 403,
      errorMessage: "Unauthorized access.",
    });
  }

  const { lessonSlug } = params;

  if (!lessonSlug) {
    return errorResponse({
      statusCode: 404,
      errorMessage: "Content not found.",
    });
  }

  const lessonData = await getEntryBySlug("lessons", lessonSlug);

  if (!lessonData) {
    return errorResponse({
      statusCode: 404,
      errorMessage: "Content not found.",
    });
  }

  const transformedLesson = await transformLesson(lessonData);

  const { prevPage, nextPage } = await getPreviousNextPage(transformedLesson);

  const lesson = {
    ...transformedLesson,
    prevPage,
    nextPage,
  };

  return new Response(JSON.stringify(lesson), {
    status: 200,
  });
};
