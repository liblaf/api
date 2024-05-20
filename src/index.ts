import { OpenAPIHono } from "@hono/zod-openapi";
import HTML from "@lib/swagger-ui";
import { appBot } from "@route/bot";
import { appIp } from "@route/ip";
import { appProxy } from "@route/proxy";
import { appSub } from "@route/sub";
import { cors } from "hono/cors";
import { HTTPException } from "hono/http-exception";

const app = new OpenAPIHono();

app.use(cors());

app.get("/", (c) => {
  console.log(c.env?.MY_SUB_URLS);
  return c.html(HTML);
});
app.route("/bot", appBot);
app.route("/ip", appIp);
app.route("/proxy", appProxy);
app.route("/sub", appSub);

app.doc("/openapi.json", {
  openapi: "3.1.0",
  info: { title: "liblaf's API", version: "v0" },
  externalDocs: { description: "GitHub", url: "https://github.com/liblaf/api" },
});

app.onError((err, c) => {
  console.error(err);
  if (err instanceof HTTPException) return err.getResponse();
  return c.text(`${err}`, 500);
});

export default app;
