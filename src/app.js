import telegraf from "telegraf";
import dotenv from "dotenv";
dotenv.config();

import {
    COMMANDS_LIST,
    GET_RANDOM_DOG_URL,
    GET_RANDOM_CAT_URL,
    GREETING_MESSAGE,
    BOT_FUNCTION_TYPE,
} from "./constants/constants.js";
import {
    subscribeMenuHandler,
    todosMenuHandler,
    cancelWeatherScheduleJob,
} from "./handlers/index.js";
import { showTodoList, cancelTodosScheduleJob } from "./todoServices/index.js";
import { sendRequest } from "./axios/axios.js";
import { botUseFunction } from "./utils/utils.js";
import {
    weatherSubscribeScene,
    todosSubscribeScene,
    weatherScene,
    placesRecommendationScene,
    addTodoScene,
    deleteTodoScene,
} from "./scenes/scenes.js";
import { DB } from "./database/db.js";

const {
    Telegraf,
    session,
    Scenes: { Stage },
} = telegraf;

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start(async (ctx) => {
    await botUseFunction(
        ctx,
        BOT_FUNCTION_TYPE.REPLY,
        `Welcome ${ctx.message.from.first_name ? ctx.message.from.first_name : `stranger`}!
        ` + GREETING_MESSAGE
    );

    await DB.createPerson(ctx.message.from.id, ctx.message.from.first_name);
});

bot.help(async (ctx) => {
    await botUseFunction(ctx, BOT_FUNCTION_TYPE.REPLY, COMMANDS_LIST);
});

bot.command("dog", async (ctx) => {
    await botUseFunction(ctx, BOT_FUNCTION_TYPE.REPLY, "Searching picture...");

    const data = await sendRequest(GET_RANDOM_DOG_URL, "get");

    await botUseFunction(ctx, BOT_FUNCTION_TYPE.REPLY_PHOTO, { url: data.message });
});

bot.command("cat", async (ctx) => {
    await botUseFunction(ctx, BOT_FUNCTION_TYPE.REPLY, "Searching picture...");

    const data = await sendRequest(GET_RANDOM_CAT_URL, "get");

    await botUseFunction(ctx, BOT_FUNCTION_TYPE.REPLY_PHOTO, { url: data[0].url });
});

const quit = async (ctx) => {
    await botUseFunction(ctx, BOT_FUNCTION_TYPE.REPLY, "quit");
    return ctx.scene.leave();
};

weatherSubscribeScene.command("quit", quit);
todosSubscribeScene.command("quit", quit);
weatherScene.command("quit", quit);
placesRecommendationScene.command("quit", quit);
addTodoScene.command("quit", quit);
deleteTodoScene.command("quit", quit);

const stage = new Stage([
    weatherScene,
    placesRecommendationScene,
    weatherSubscribeScene,
    addTodoScene,
    deleteTodoScene,
    todosSubscribeScene,
]);

bot.use(session(), stage.middleware());

bot.command("weather", async (ctx) => {
    botUseFunction(ctx, BOT_FUNCTION_TYPE.ENTER_SCENE, "weatherScene");
});

bot.command("todos", async (ctx) => {
    await todosMenuHandler(ctx);
});

bot.command("subscribe", async (ctx) => {
    await subscribeMenuHandler(ctx);
});

bot.command("places", async (ctx) => {
    botUseFunction(ctx, BOT_FUNCTION_TYPE.ENTER_SCENE, "placesRecommendationScene");
});

bot.action("weatherSubscribeButton", async (ctx) => {
    await ctx.answerCbQuery();

    botUseFunction(ctx, BOT_FUNCTION_TYPE.ENTER_SCENE, "weatherSubscribeScene");
});

bot.action("weatherUnsubscribeButton", async (ctx) => {
    await ctx.answerCbQuery();
    cancelWeatherScheduleJob();

    await botUseFunction(ctx, BOT_FUNCTION_TYPE.REPLY, "Unsubscribed successfully!");

    return ctx.scene.leave();
});

bot.action("showListButton", async (ctx) => {
    await ctx.answerCbQuery();

    const data = await DB.getUserTodos(ctx.update.callback_query.from.id);
    await showTodoList(ctx, data);
});

bot.action("addTodoButton", async (ctx) => {
    await ctx.answerCbQuery();
    botUseFunction(ctx, BOT_FUNCTION_TYPE.ENTER_SCENE, "addTodoScene");
});

bot.action("deleteTodoButton", async (ctx) => {
    await ctx.answerCbQuery();
    botUseFunction(ctx, BOT_FUNCTION_TYPE.ENTER_SCENE, "deleteTodoScene");
});

bot.action("todosSubscribeButton", async (ctx) => {
    await ctx.answerCbQuery();
    await botUseFunction(ctx, BOT_FUNCTION_TYPE.ENTER_SCENE, "todosSubscribeScene");
});

bot.action("todosUnsubscribeButton", async (ctx) => {
    await ctx.answerCbQuery();
    cancelTodosScheduleJob();
    await botUseFunction(ctx, BOT_FUNCTION_TYPE.REPLY, "Unsubscribed successfully!");
});

bot.launch();

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
