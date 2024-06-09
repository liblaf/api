import { newApp } from "@lib/bindings";
import { appSubConvert } from "./convert";
import { appSubInfo } from "./info";

export const appSub = newApp();

appSub.route("/convert", appSubConvert);
appSub.route("/info", appSubInfo);
