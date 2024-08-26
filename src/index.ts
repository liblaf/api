import { createApp } from "@lib/app";
import HTML from "@lib/swagger";
import appBot from "@route/bot";
import appProxy from "@route/proxy";
import appRuleSet from "@route/rule-set";
import appSub from "@route/sub";
import { HTTPException } from "hono/http-exception";

const app = createApp();

app.get("/", (c) => c.html(HTML));
app.route("/bot", appBot);
app.route("/proxy", appProxy);
app.route("/rule-set", appRuleSet);
app.route("/sub", appSub);

app.doc("/openapi.json", {
  openapi: "3.1.0",
  info: { title: "liblaf's API", version: "v0" },
  externalDocs: { description: "GitHub", url: "https://github.com/liblaf/api" },
});

app.onError((err, c) => {
  console.error(err);
  if (err instanceof HTTPException) return err.getResponse();
  return c.text(`${err}`, 500, { error: `${err}` });
});

export default app;
