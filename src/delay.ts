import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";

export const appDelay = new OpenAPIHono();

const DEFAULT_DELAY_MILLISECONDS = 5000;

appDelay.openapi(
  createRoute({
    tags: ["IP"],
    summary: `Return after ${DEFAULT_DELAY_MILLISECONDS}ms delay`,
    method: "head",
    path: "/",
    responses: {
      204: {
        description: "OK",
      },
    },
  }),
  async (c) => {
    await new Promise((resolve) =>
      setTimeout(resolve, DEFAULT_DELAY_MILLISECONDS),
    );
    c.status(204);
    return c.newResponse(null);
  },
);

appDelay.openapi(
  createRoute({
    tags: ["IP"],
    summary: `Return after ${DEFAULT_DELAY_MILLISECONDS}ms delay`,
    method: "get",
    path: "/",
    responses: {
      204: {
        description: "OK",
      },
    },
  }),
  async (c) => {
    await new Promise((resolve) =>
      setTimeout(resolve, DEFAULT_DELAY_MILLISECONDS),
    );
    c.status(204);
    return c.newResponse(null);
  },
);

const paramsSchema = z.object({
  milliseconds: z.coerce
    .number()
    .nonnegative()
    .int()
    .openapi({ example: DEFAULT_DELAY_MILLISECONDS }),
});

appDelay.openapi(
  createRoute({
    tags: ["IP"],
    summary: "Return after a delay",
    method: "head",
    path: "/{milliseconds}",
    request: {
      params: paramsSchema,
    },
    responses: {
      204: {
        description: "OK",
      },
    },
  }),
  async (c) => {
    const { milliseconds } = c.req.valid("param");
    await new Promise((resolve) => setTimeout(resolve, milliseconds));
    c.status(204);
    return c.newResponse(null);
  },
);

appDelay.openapi(
  createRoute({
    tags: ["IP"],
    summary: "Return after a delay",
    method: "get",
    path: "/{milliseconds}",
    request: {
      params: paramsSchema,
    },
    responses: {
      204: {
        description: "OK",
      },
    },
  }),
  async (c) => {
    const { milliseconds } = c.req.valid("param");
    await new Promise((resolve) => setTimeout(resolve, milliseconds));
    c.status(204);
    return c.newResponse(null);
  },
);
