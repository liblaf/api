import { OpenAPIHono } from "@hono/zod-openapi";
import { HTTPException } from "hono/http-exception";

import SWAGGER_UI from "@/lib/swagger-ui";
import { appIp } from "@/route/ip";
import { appProxy } from "@/route/proxy";
import { appSub } from "@/route/sub";

const app = new OpenAPIHono();

app.get("/", (c) => c.html(SWAGGER_UI));
app.doc("/openapi.json", {
  openapi: "3.1.0",
  info: { title: "liblaf's API", version: "v0" },
  externalDocs: { description: "GitHub", url: "https://github.com/liblaf/api" },
});
app.route("/ip", appIp);
app.route("/proxy", appProxy);
app.route("/sub", appSub);

app.onError((err, c) => {
  console.error(err);
  if (err instanceof HTTPException) return err.getResponse();
  return c.text(`${err}`, 500);
});

export default app;
