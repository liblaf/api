import { OpenAPIHono } from "@hono/zod-openapi";
import { appConvertSingBox } from "./sing-box";

export const appConvert = new OpenAPIHono();

appConvert.route("/sing-box", appConvertSingBox);
