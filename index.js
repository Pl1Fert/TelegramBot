import telegraf from "telegraf";
import dotenv from "dotenv";
dotenv.config();

import { COMMANDS_LIST, GET_RANDOM_DOG_URL, GET_RANDOM_CAT_URL } from "./constants.js";
import {
    weatherHandler,
    placesRecommendationHandler,
    weatherSubscribeHandler,
    userPurposeHandler,
    cancelScheduleJob,
} from "./handlers.js";
import { sendRequest } from "./axios.js";

const {
    Telegraf,
    session,
    Scenes: { WizardScene, Stage },
} = telegraf;

const bot = new Telegraf(process.env.BOT_TOKEN);

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

bot.command("dog", async (ctx) => {
    try {
        await ctx.reply("Searching picture...");
    } catch (e) {
        console.log(e);
    }

    const data = await sendRequest(GET_RANDOM_DOG_URL, "get");

    try {
        await ctx.replyWithPhoto({ url: data.message });
    } catch (e) {
        console.log(e);
    }
});

bot.command("cat", async (ctx) => {
    try {
        await ctx.reply("Searching picture...");
    } catch (e) {
        console.log(e);
    }

    const data = await sendRequest(GET_RANDOM_CAT_URL, "get");

    try {
        await ctx.replyWithPhoto({ url: data[0].url });
    } catch (e) {
        console.log(e);
    }
});

//TODO: need to relocate
const askCity = async (ctx) => {
    try {
        await ctx.reply("Enter your city in english");
    } catch (e) {
        console.log(e);
    }

    return ctx.wizard.next();
};

const notifyAboutError = async (ctx) => {
    try {
        await ctx.reply(`City ${ctx.message.text} not found!`);
    } catch (e) {
        console.log(e);
    }

    return ctx.scene.leave();
};

const weatherSubscribeScene = new WizardScene(
    "weatherSubscribeScene",
    askCity,
    weatherSubscribeHandler,
    notifyAboutError
);
const weatherScene = new WizardScene("weatherScene", askCity, weatherHandler, notifyAboutError);
const placesRecommendationScene = new WizardScene(
    "placesRecommendationScene",
    askCity,
    placesRecommendationHandler,
    notifyAboutError
);

const stage = new Stage([weatherScene, placesRecommendationScene, weatherSubscribeScene]);
bot.use(session(), stage.middleware());

bot.command("weather", async (ctx) => {
    try {
        await ctx.scene.enter("weatherScene");
    } catch (e) {
        console.log(e);
    }
});

bot.command("weatherSubscribe", async (ctx) => {
    userPurposeHandler(ctx);
});

bot.command("places", async (ctx) => {
    try {
        await ctx.scene.enter("placesRecommendationScene");
    } catch (e) {
        console.log(e);
    }
});

bot.action("btn_1", async (ctx) => {
    await ctx.answerCbQuery();

    try {
        await ctx.scene.enter("weatherSubscribeScene");
    } catch (e) {
        console.log(e);
    }
});

bot.action("btn_2", async (ctx) => {
    await ctx.answerCbQuery();
    cancelScheduleJob();

    try {
        await ctx.reply("Unsubscribed successfully!");
    } catch (e) {
        console.log(e);
    }

    return ctx.scene.leave();
});

bot.launch();

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
