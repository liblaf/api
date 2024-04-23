import { OpenAPIHono } from "@hono/zod-openapi";
import { appIp } from "./ip";
import { appProxy } from "./proxy";
import { appSub } from "./sub";
import SWAGGER_UI from "./swagger-ui";

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

export default app;
