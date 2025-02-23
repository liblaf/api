import { createApp } from "@/utils";
import { apiReference } from "@scalar/hono-api-reference";
import { HTTPException } from "hono/http-exception";
import inspect from "object-inspect";
import { UAParser } from "ua-parser-js";
import appAssets from "./assets";
import appBot from "./bot";
import appProxy from "./proxy";
import appRules from "./rules";
import appSub from "./sub";

const app = createApp();

app.doc("/openapi.json", {
  openapi: "3.1.0",
  info: { title: "liblaf's API", version: "v0" },
  externalDocs: { description: "GitHub", url: "https://github.com/liblaf/api" },
});

app.onError(async (err, c) => {
  console.error(inspect(err));
  if (err instanceof HTTPException) return err.getResponse();
  return c.text(inspect(err), 500);
});

app.get("/", async (c) => {
  const ua = UAParser(c.req.header("User-Agent"));
  if (ua.browser.name) return c.redirect("/reference");
  return c.newResponse(null, 204);
});

app.get(
  "/reference",
  apiReference({
    spec: { url: "/openapi.json" },
    pageTitle: "liblaf's API Reference",
  }),
);

app.route("/assets", appAssets);
app.route("/bot", appBot);
app.route("/proxy", appProxy);
app.route("/rules", appRules);
app.route("/sub", appSub);

export default app;
