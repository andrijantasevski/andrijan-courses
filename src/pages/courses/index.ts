import { cleanUpUrlFromContentAndMDX } from "@utils/generateCourseTree";
import type { APIRoute, MDXInstance } from "astro";
import type { Course } from "src/types/types";

export const get: APIRoute = ({ params, request }) => {
  const coursesData: MDXInstance<Course>[] = Object.values(
    import.meta.glob("./../../../content/courses/*/index.mdx", {
      eager: true,
    })
  );

  const courses = coursesData.map((course) => {
    return {
      courseUrl: cleanUpUrlFromContentAndMDX(course.url ?? "/"),
      courseTitle: course.frontmatter.courseTitle,
    };
  });

  return new Response(JSON.stringify(courses), {
    status: 200,
    statusText: "Success",
  });
};
