import { getCollection, getEntryBySlug } from "astro:content";
import {
  TransformedLesson,
  transformLesson,
  transformModule,
} from "./dataTransformers";

export async function getCurrentModule(transformedLesson: TransformedLesson) {
  const currentModule = await getEntryBySlug(
    "modules",
    transformedLesson.moduleSlug
  );

  return currentModule ? transformModule(currentModule) : null;
}

export async function getNextModule(transformedLesson: TransformedLesson) {
  const modules = await getCollection("modules", ({ slug }) =>
    slug.includes(transformedLesson.courseSlug)
  );

  const sortedModules = [...modules].sort(
    (a, b) => a.data.moduleOrder - b.data.moduleOrder
  );

  const sortedModuleIndex = sortedModules.findIndex(
    (module) => module.slug === transformedLesson.moduleSlug
  );

  const nextModule = sortedModules[sortedModuleIndex + 1];

  return nextModule ? transformModule(nextModule) : null;
}

export default async function getPreviousNextPage(
  transformedLesson: TransformedLesson
) {
  const lessonsPerModule = await getCollection("lessons", ({ slug }) =>
    slug.includes(transformedLesson.moduleSlug)
  );

  const sortedLessonsPerModule = [...lessonsPerModule].sort(
    (a, b) => a.data.lessonOrder - b.data.lessonOrder
  );

  const transformedLessonIndex = sortedLessonsPerModule.findIndex(
    (lesson) => lesson.slug === transformedLesson.slug
  );

  const prevPage =
    transformedLessonIndex - 1 >= 0
      ? await transformLesson(
          sortedLessonsPerModule[transformedLessonIndex - 1]
        )
      : await getCurrentModule(transformedLesson);

  const nextPage =
    sortedLessonsPerModule.length === transformedLessonIndex + 1
      ? await getNextModule(transformedLesson)
      : await transformLesson(
          sortedLessonsPerModule[transformedLessonIndex + 1]
        );

  return {
    prevPage,
    nextPage,
  };
}
