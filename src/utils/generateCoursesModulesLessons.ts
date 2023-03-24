import type { MDXInstance } from "astro";
import type { Course, Lesson, Module } from "src/types/types";
import fs from "node:fs";
import chokidar from "chokidar";

const courses: MDXInstance<Course>[] = Object.values(
  import.meta.glob("/content/courses/*/index.mdx", { eager: true })
);
const modules: MDXInstance<Module>[] = Object.values(
  import.meta.glob("/content/courses/*/*/index.mdx", { eager: true })
);
const lessons: MDXInstance<Lesson>[] = Object.values(
  import.meta.glob(
    ["/content/courses/*/*/*.mdx", "!/content/courses/*/*/index.mdx"],
    { eager: true }
  )
);

const data = {
  courses,
  modules,
  lessons,
};

export function createFile() {
  fs.writeFileSync(
    "src/utils/generated-data.json",
    JSON.stringify(data),
    "utf-8"
  );
}

chokidar.watch("content/courses/**/*.mdx").on("change", async () => {
  createFile()
})