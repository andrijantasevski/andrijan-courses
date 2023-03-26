export default function errorResponse(args: {
  errorMessage: string;
  statusCode: number;
}) {
  const { errorMessage, statusCode } = args;

  return new Response(
    JSON.stringify({
      error: errorMessage,
    }),
    { status: statusCode }
  );
}
