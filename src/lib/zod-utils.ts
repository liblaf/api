import { z } from "@hono/zod-openapi";

function preprocessBoolean<T>(val: T): boolean | T {
  const str = String(val).toLowerCase();

  if (str === "1") return true;
  if (str === "t") return true;
  if (str === "true") return true;
  if (str === "y") return true;
  if (str === "yes") return true;

  if (str === "0") return false;
  if (str === "f") return false;
  if (str === "false") return false;
  if (str === "n") return false;
  if (str === "no") return false;

  return val;
}

export function coerceBoolean() {
  return z.preprocess(preprocessBoolean, z.boolean());
}
