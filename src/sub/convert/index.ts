import { OpenAPIHono } from "@hono/zod-openapi";
import { appSubConvertSingbox } from "./sing-box";

export const appSubConvert = new OpenAPIHono();

appSubConvert.route("/sing-box", appSubConvertSingbox);
