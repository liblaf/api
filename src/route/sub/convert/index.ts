import { newApp } from "@lib/bindings";
import { appSubConvertSingBox } from "./sing-box";

export const appSubConvert = newApp();

appSubConvert.route("/sing-box", appSubConvertSingBox);
