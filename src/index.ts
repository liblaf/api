import { OpenAPIHono } from "@hono/zod-openapi";
import HTML from "@lib/swagger-ui";
import { appProxy } from "@route/proxy";
import { cors } from "hono/cors";

const app = new OpenAPIHono();

app.use(cors());
app.doc("/openapi.json", {
  openapi: "3.1.0",
  info: { title: "liblaf's API", version: "v0" },
  externalDocs: { description: "GitHub", url: "https://github.com/liblaf/api" },
});
app.get("/", (c) => {
  return c.html(HTML);
});
app.route("/proxy", appProxy);

export default app;
