export function cleanUpUrlFromContentAndIndex(url: string) {
  return url.replace(/^content\/|\/index\.mdx$/g, "/");
}

export function cleanUpUrlFromContentAndMDX(url: string) {
  return url.replace(/^content\/|(\/index)?\.mdx$/g, "/");
}
