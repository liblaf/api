import { swaggerUI } from "@hono/swagger-ui";
import { OpenAPIHono } from "@hono/zod-openapi";
import { appDelay } from "./delay";
import { appIp } from "./ip";

const app = new OpenAPIHono();

app.get("/", swaggerUI({ url: "/openapi.json" }));
app.route("/delay", appDelay);
app.route("/ip", appIp);

app.doc("/openapi.json", {
  openapi: "3.1.0",
  info: { title: "liblaf's API", version: "v0" },
  externalDocs: { description: "GitHub", url: "https://github.com/liblaf/api" },
});

export default app;
