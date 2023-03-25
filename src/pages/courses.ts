import type { APIRoute } from 'astro';

export const get: APIRoute = ({ params, request }) => {
    console.log(request);

  return {
    body: JSON.stringify({
      hi: "hi"
    })
  };
}