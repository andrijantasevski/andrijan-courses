import type { CollectionEntry } from "astro:content";
import type { AsyncReturnType } from "type-fest";

export function transformCourse(course: CollectionEntry<"courses">) {
  return {
    id: course.id,
    slug: course.slug,
    collection: course.collection,
    courseUrl: `/courses/${course.slug}`,
    courseTitle: course.data.courseTitle,
  };
}

export function transformModule(module: CollectionEntry<"modules">) {
  return {
    id: module.id,
    slug: module.slug,
    collection: module.collection,
    moduleUrl: `/courses/${module.slug}`,
    moduleTitle: module.data.moduleTitle,
    moduleOrder: module.data.moduleOrder,
  };
}

export function transformLessonLight(lesson: CollectionEntry<"lessons">) {
  return {
    id: lesson.id,
    slug: lesson.slug,
    collection: lesson.collection,
    lessonUrl: `/courses/${lesson.slug}`,
    lessonTitle: lesson.data.lessonTitle,
    lessonOrder: lesson.data.lessonOrder,
  };
}

export async function transformLesson(lesson: CollectionEntry<"lessons">) {
  const { headings } = await lesson.render();

  const [courseSlug, moduleSlug] = lesson.slug.split("/");

  return {
    id: lesson.id,
    slug: lesson.slug,
    collection: lesson.collection,
    courseSlug,
    courseUrl: `/courses/${courseSlug}`,
    moduleSlug: `${courseSlug}/${moduleSlug}`,
    moduleUrl: `/courses/${courseSlug}/${moduleSlug}`,
    lessonUrl: `/courses/${courseSlug}`,
    lessonTitle: lesson.data.lessonTitle,
    lessonOrder: lesson.data.lessonOrder,
    lessonContent: lesson.body,
    lessonHeadings: headings,
  };
}

export type TransformedCourse = ReturnType<typeof transformCourse>;
export type TransformedModule = ReturnType<typeof transformModule>;
export type TransformedLightLesson = ReturnType<typeof transformLessonLight>;
export type TransformedLesson = AsyncReturnType<typeof transformLesson>;
