import { Markup, Telegraf } from "telegraf";
import { COMMANDS_LIST, GET_RANDOM_DOG_URL, GET_RANDOM_CAT_URL } from "./constants.js";
import dotenv from "dotenv";
import { sendRequest } from "./sender.js";
dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN);
bot.use();

bot.start(async (ctx) => {
    try {
        await ctx.reply(
            `Welcome ${ctx.message.from.first_name ? ctx.message.from.first_name : `stranger`}!`
        );
    } catch (e) {
        console.log(e);
    }
});

bot.help(async (ctx) => {
    try {
        await ctx.reply(COMMANDS_LIST);
    } catch (e) {
        console.log(e);
    }
});

//TODO: refactor to return data

bot.command("dog", async (ctx) => {
    await ctx.reply("Searching picture...");
    const response = await sendRequest(GET_RANDOM_DOG_URL, "get");
    await ctx.replyWithPhoto({ url: response.data.message });
});

bot.command("cat", async (ctx) => {
    await ctx.reply("Searching picture...");
    const response = await sendRequest(GET_RANDOM_CAT_URL, "get");
    await ctx.replyWithPhoto({ url: response.data[0].url });
});

bot.launch();

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
