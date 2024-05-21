import { appBotWebhook } from "./webhook";
import { appBotSend } from "./send";
import { newApp } from "@lib/bindings";

export const appBot = newApp();

appBot.route("/send", appBotSend);
appBot.route("/webhook", appBotWebhook);
