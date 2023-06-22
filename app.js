import telegraf from "telegraf";
import dotenv from "dotenv";
dotenv.config();

import {
    COMMANDS_LIST,
    GET_RANDOM_DOG_URL,
    GET_RANDOM_CAT_URL,
    GREETING_MESSAGE,
} from "./constants.js";
import {
    weatherHandler,
    placesRecommendationHandler,
    weatherSubscribeHandler,
    subscribeMenuHandler,
    cancelWeatherScheduleJob,
    todosMenuHandler,
} from "./handlers/index.js";
import {
    deleteTodo,
    addTodo,
    showTodoList,
    cancelTodosScheduleJob,
    todosSubscribeHandler,
} from "./todoServices/index.js";
import { sendRequest } from "./axios.js";
import { askCity, notifyAboutError, askTodoContent, askTodoTitle, askTodoNumber } from "./utils.js";
import { DB } from "./db.js";

const {
    Telegraf,
    session,
    Scenes: { WizardScene, Stage },
} = telegraf;

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start(async (ctx) => {
    try {
        await ctx.reply(
            `Welcome ${ctx.message.from.first_name ? ctx.message.from.first_name : `stranger`}!
            ` + GREETING_MESSAGE
        );
    } catch (e) {
        console.log(e);
    }

    try {
        await DB.createPerson(ctx.message.from.id, ctx.message.from.first_name);
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
const addTodoScene = new WizardScene("addTodoScene", askTodoTitle, askTodoContent, addTodo);
const deleteTodoScene = new WizardScene(
    "deleteTodoScene",
    askTodoNumber,
    deleteTodo,
    notifyAboutError
);

const stage = new Stage([
    weatherScene,
    placesRecommendationScene,
    weatherSubscribeScene,
    addTodoScene,
    deleteTodoScene,
]);

bot.use(session(), stage.middleware());

bot.command("weather", async (ctx) => {
    try {
        await ctx.scene.enter("weatherScene");
    } catch (e) {
        console.log(e);
    }
});

bot.command("todos", async (ctx) => {
    await todosMenuHandler(ctx);
});

bot.command("weatherSubscribe", async (ctx) => {
    await subscribeMenuHandler(ctx);
});

bot.command("places", async (ctx) => {
    try {
        await ctx.scene.enter("placesRecommendationScene");
    } catch (e) {
        console.log(e);
    }
});

bot.action("weatherSubscribeButton", async (ctx) => {
    await ctx.answerCbQuery();

    try {
        await ctx.scene.enter("weatherSubscribeScene");
    } catch (e) {
        console.log(e);
    }
});

bot.action("weatherUnsubscribeButton", async (ctx) => {
    await ctx.answerCbQuery();
    cancelWeatherScheduleJob();

    try {
        await ctx.reply("Unsubscribed successfully!");
    } catch (e) {
        console.log(e);
    }

    return ctx.scene.leave();
});

bot.action("showListButton", async (ctx) => {
    await ctx.answerCbQuery();

    try {
        const data = await DB.getUserTodos(ctx.update.callback_query.from.id);
        await showTodoList(ctx, data);
    } catch (e) {
        console.log(e);
    }
});

bot.action("addTodoButton", async (ctx) => {
    await ctx.answerCbQuery();

    try {
        await ctx.scene.enter("addTodoScene");
    } catch (e) {
        console.log(e);
    }
});

bot.action("deleteTodoButton", async (ctx) => {
    await ctx.answerCbQuery();

    try {
        await ctx.scene.enter("deleteTodoScene");
    } catch (e) {
        console.log(e);
    }
});

bot.action("todosSubscribeButton", async (ctx) => {
    await ctx.answerCbQuery();

    try {
        await todosSubscribeHandler(ctx);
        await ctx.reply("Subscribed successfully!");
    } catch (e) {
        console.log(e);
    }
});

bot.action("todosUnsubscribeButton", async (ctx) => {
    await ctx.answerCbQuery();
    cancelTodosScheduleJob();

    try {
        await ctx.reply("Unsubscribed successfully!");
    } catch (e) {
        console.log(e);
    }
});

bot.launch();

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
