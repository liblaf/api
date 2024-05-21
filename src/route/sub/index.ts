import { appSubConvert } from "./convert";
import { appSubInfo } from "./info";
import { newApp } from "@lib/bindings";

export const appSub = newApp();

appSub.route("/convert", appSubConvert);
appSub.route("/info", appSubInfo);
