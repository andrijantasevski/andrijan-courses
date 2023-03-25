import { z, defineCollection } from "astro:content";

const coursesCollection = defineCollection({
  schema: z.object({
    courseTitle: z.string(),
  }),
});

const modulesCollection = defineCollection({
  schema: z.object({
    moduleTitle: z.string(),
  }),
});

const lessonsCollection = defineCollection({
  schema: z.object({
    lessonTitle: z.string(),
  }),
});

export const collections = {
  courses: coursesCollection,
  modules: modulesCollection,
  lessons: lessonsCollection,
};
