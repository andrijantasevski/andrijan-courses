import { localEnv } from "env";
import type { APIRoute } from "astro";
import { getCollection, getEntryBySlug } from "astro:content";
import timingSafeEqual from "@utils/timingSafeEqual";
import errorResponse from "@utils/errorResponse";
import { transformLesson } from "@utils/dataTransformers";
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

  const lessonsPerModule = await getCollection("lessons", ({ slug }) =>
    slug.includes(transformedLesson.moduleSlug)
  );

  const sortedLessonsPerModule = [...lessonsPerModule].sort(
    (a, b) => a.data.lessonOrder - b.data.lessonOrder
  );

  const transformedLessonIndex = sortedLessonsPerModule.findIndex(
    (lesson) => lesson.slug === transformedLesson.slug
  );

  const prevLesson =
    transformedLessonIndex - 1 >= 0
      ? sortedLessonsPerModule[transformedLessonIndex - 1]
      : null;

  const nextLesson =
    sortedLessonsPerModule.length === transformedLessonIndex + 1
      ? null
      : sortedLessonsPerModule[transformedLessonIndex + 1];

  const lesson = {
    ...transformedLesson,
    prevLesson,
    nextLesson,
  };

  return new Response(JSON.stringify(lesson), {
    status: 200,
  });
};
