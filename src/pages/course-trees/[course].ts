import { env } from "env";
import type { APIRoute } from "astro";
import { getCollection, getEntryBySlug } from "astro:content";
import timingSafeEqual from "@utils/timingSafeEqual";
import errorResponse from "@utils/errorResponse";
import {
  transformCourse,
  transformLessonLight,
  transformModule,
} from "@utils/dataTransformers";

export const get: APIRoute = async ({ params, request }) => {
  const apiSecretKey = request.headers.get("X-API-KEY");

  if (!apiSecretKey || !timingSafeEqual(apiSecretKey, env.API_SECRET_KEY)) {
    return errorResponse({
      statusCode: 403,
      errorMessage: "Unauthorized access.",
    });
  }

  const { course } = params;

  if (!course) {
    return errorResponse({
      errorMessage: "Content not found.",
      statusCode: 404,
    });
  }

  const courseData = await getEntryBySlug("courses", course);

  if (!courseData) {
    return errorResponse({
      errorMessage: "No such course exists.",
      statusCode: 404,
    });
  }

  const transformedCourse = transformCourse(courseData);

  const [modulesPerCourse, lessonsPerCourse] = await Promise.all([
    await getCollection("modules", ({ slug }) => slug.includes(course)),
    await getCollection("lessons", ({ slug }) => slug.includes(course)),
  ]);

  const sortedModulesPerCourse = [...modulesPerCourse].sort(
    (a, b) => a.data.moduleOrder - b.data.moduleOrder
  );

  const transformedModules = sortedModulesPerCourse.map(transformModule);

  const modules = transformedModules.map((module) => {
    const lessonsPerModule = lessonsPerCourse.filter((lesson) =>
      lesson.slug.includes(module.slug)
    );

    const sortedLessonsPerModule = [...lessonsPerModule].sort(
      (a, b) => a.data.lessonOrder - b.data.lessonOrder
    );

    const transformedLessons = sortedLessonsPerModule.map(transformLessonLight);

    return {
      ...module,
      lessons: transformedLessons,
    };
  });

  const courseTree = {
    course: transformedCourse,
    modules,
  };

  return new Response(JSON.stringify(courseTree), {
    status: 200,
    statusText: "Success",
  });
};
