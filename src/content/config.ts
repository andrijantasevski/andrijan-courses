import { z, defineCollection } from "astro:content";

const coursesCollection = defineCollection({
  schema: z.object({
    courseTitle: z.string(),
  }),
});

const modulesCollection = defineCollection({
  schema: z.object({
    moduleTitle: z.string(),
    moduleOrder: z.number(),
  }),
});

const lessonsCollection = defineCollection({
  schema: z.object({
    lessonTitle: z.string(),
    lessonOrder: z.number(),
  }),
});

export const collections = {
  courses: coursesCollection,
  modules: modulesCollection,
  lessons: lessonsCollection,
};
