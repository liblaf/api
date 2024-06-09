import { newApp } from "@lib/bindings";
import { appBotSend } from "./send";
import { appBotWebhook } from "./webhook";

export const appBot = newApp();

appBot.route("/send", appBotSend);
appBot.route("/webhook", appBotWebhook);
