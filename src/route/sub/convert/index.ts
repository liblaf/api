import { appSubConvertSingBox } from "./sing-box";
import { newApp } from "@lib/bindings";

export const appSubConvert = newApp();

appSubConvert.route("/sing-box", appSubConvertSingBox);
