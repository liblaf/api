import { newApp } from "@lib/bindings";
import HTML from "@lib/swagger-ui";
import { appBot } from "@route/bot";
import { appIp } from "@route/ip";
import { appProxy } from "@route/proxy";
import { appSub } from "@route/sub";
import { HTTPException } from "hono/http-exception";

const app = newApp();

app.get("/", (c) => c.html(HTML));
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
