import type { Bindings } from "@lib/bindings";
import { type Info, fetchInfoSafe } from "@lib/sub/info";
import { Bot } from "grammy";

export function newBot(env: Bindings) {
	const bot = new Bot(env.BOT_TOKEN);
	bot.command("chatid", async (ctx) => {
		await ctx.reply(`<code>${ctx.chat.id.toString()}</code>`, {
			parse_mode: "HTML",
		});
	});
	bot.command("sub", async (ctx) => {
		if (ctx.chat.id.toString() !== env.MY_CHAT_ID) {
			await ctx.reply("🚫 Forbidden");
			return;
		}
		const urls: URL[] = env.MY_SUB_URLS.split("\n").map(
			(url: string) => new URL(url),
		);
		const info: Info[] = await fetchInfoSafe(urls);
		const message: string = prettySubInfo(info);
		await ctx.reply(message, { parse_mode: "HTML" });
	});
	return bot;
}

function prettySubInfo(info: Info[]): string {
	const message: string = info
		.map((i: Info): string => {
			let item = `<a href="${i.url}"><b>${i.name}</b></a>:`;
			if (i.download && i.upload && i.total) {
				const usage: number = i.download + i.upload;
				const ratio: number = usage / i.total;
				const emoji = ratio < 0.6 ? "🟢" : ratio < 0.8 ? "🟡" : "🔴";
				item += ` ${emoji} ${prettyBytes(usage)} / ${prettyBytes(i.total)}`;
			}
			if (i.expire) {
				const expire = new Date(i.expire * 1000);
				const remain: number = i.expire * 1000 - Date.now();
				const days: number = Math.floor(remain / 1000 / 86400);
				const emoji = days < 7 ? "🔴" : days < 14 ? "🟡" : "🟢";
				item += ` ${emoji} ${prettyDate(expire)}`;
			}
			if (i.error) item += i.error;
			return item;
		})
		.join("\n");
	return message;
}

function prettyBytes(bytes: number, precision = 3): string {
	if (!+bytes) return "0 Bytes";
	const K = 1024;
	const SIZES = [
		"Bytes",
		"KiB",
		"MiB",
		"GiB",
		"TiB",
		"PiB",
		"EiB",
		"ZiB",
		"YiB",
	];
	const i = Math.floor(Math.log(bytes) / Math.log(K));
	return `${(bytes / K ** i).toPrecision(precision)} ${SIZES[i]}`;
}

function prettyDate(date: Date): string {
	return date.toISOString().slice(0, 10);
}
