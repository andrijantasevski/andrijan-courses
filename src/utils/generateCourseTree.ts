import type { MDXInstance } from "astro";
import type { Course, Lesson, Module } from "src/types/types";

interface GenerateCourseTreeProps {
  courses: MDXInstance<Course>[];
  modules: MDXInstance<Module>[];
  lessons: MDXInstance<Lesson>[];
}

export function cleanUpUrlFromContentAndMDX(url: string) {
  return url.replace(/^content\/|(\/index)?\.mdx$/g, "/");
}

export function generateCourseTree(props: GenerateCourseTreeProps) {
  const { courses, modules, lessons } = props;

  const coursesObjects = courses.map((course) => {
    return {
      courseUrl: cleanUpUrlFromContentAndMDX(course.url ?? ""),
      courseTitle: course.frontmatter.courseTitle,
    };
  });

  const modulesObjects = modules.map((module) => {
    return {
      moduleUrl: cleanUpUrlFromContentAndMDX(module.url ?? ""),
      moduleTitle: module.frontmatter.moduleTitle,
    };
  });

  const lessonsObjects = lessons.map((lesson) => {
    if (!lesson.url?.includes("index.mdx")) {
      return {
        lessonUrl: cleanUpUrlFromContentAndMDX(lesson.url ?? ""),
        lessonTitle: lesson.frontmatter.lessonTitle,
      };
    }
  });

  const coursesData = coursesObjects.map((course) => {
    const modulesPerCourse = modulesObjects.filter((module) =>
      module.moduleUrl.includes(course.courseUrl)
    );

    const modules = modulesPerCourse.map((module) => {
      const filteredLessons = lessonsObjects.filter((lesson) =>
        lesson?.lessonUrl?.includes(module.moduleUrl)
      );

      return {
        ...module,
        lessons: filteredLessons,
      };
    });

    return {
      course,
      modules,
    };
  });

  return coursesData;
}
