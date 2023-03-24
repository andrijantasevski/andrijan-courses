import { describe, it, expect } from "vitest";
import { cleanUpUrlFromContentAndMDX } from "./generateCourseTree";

describe("clean up url from content and .mdx", () => {
  it("should return a url without content and index.mdx in it", () => {
    const cleanUrlCourse = cleanUpUrlFromContentAndMDX(
      "content/courses/deploying-an-ubuntu-server/index.mdx"
    );
    const cleanUrlModule = cleanUpUrlFromContentAndMDX(
      "content/courses/deploying-an-ubuntu-server/part1/index.mdx"
    );
    const clearnUrlLesson = cleanUpUrlFromContentAndMDX(
      "content/courses/deploying-an-ubuntu-server/part1/introduction.mdx"
    );

    expect(cleanUrlCourse).toBe("/courses/deploying-an-ubuntu-server/");
    expect(cleanUrlModule).toBe("/courses/deploying-an-ubuntu-server/part1/");
    expect(clearnUrlLesson).toBe(
      "/courses/deploying-an-ubuntu-server/part1/introduction/"
    );
  });
});