import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

export const get: APIRoute = async ({ params, request }) => {
  const coursesCollection = await getCollection("courses");

  const courses = coursesCollection.map((course) => {
    return {
      id: course.id,
      courseUrl: `/courses/${course.slug}`,
      courseTitle: course.data.courseTitle,
    };
  });

  return new Response(JSON.stringify(courses), {
    status: 200,
    statusText: "Success",
  });
};
