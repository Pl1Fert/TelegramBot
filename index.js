import { Telegraf } from "telegraf";
import { COMMANDS_LIST } from "./constants.js";
import dotenv from "dotenv";
dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) =>
    ctx.reply(`Welcome ${ctx.message.from.first_name ? ctx.message.from.first_name : `stranger`}!`)
);
bot.help((ctx) => ctx.reply(COMMANDS_LIST));
bot.launch();

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
