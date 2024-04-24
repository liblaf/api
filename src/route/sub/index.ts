import { OpenAPIHono } from "@hono/zod-openapi";

import { appSubConvert } from "./convert";
import { appSubInfo } from "./info";

export const appSub = new OpenAPIHono();

appSub.route("/convert", appSubConvert);
appSub.route("/info", appSubInfo);
