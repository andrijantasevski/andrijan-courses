import type { CollectionEntry } from "astro:content";

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
  };
}

export function transformLessonLight(lesson: CollectionEntry<"lessons">) {
  return {
    id: lesson.id,
    slug: lesson.slug,
    collection: lesson.collection,
    lessonUrl: `/courses/${lesson.slug}`,
    lessonTitle: lesson.data.lessonTitle,
  };
}
