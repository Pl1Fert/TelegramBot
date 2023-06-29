import { createDatabaseTables, User } from "database/db";
import dotenv from "dotenv";
import { cancelWeatherScheduleJob, subscribeMenuHandler, todosMenuHandler } from "handlers";
import {
    BOT_FUNCTION_TYPE,
    BUTTONS_VALUE,
    COMMANDS,
    COMMANDS_LIST_MESSAGE,
    ENV_VARS,
    GREETING_MESSAGE,
    LOADING_MESSAGES,
    SCENE_NAMES,
    SUCCESS_MESSAGES,
} from "myconstants";
import {
    addTodoScene,
    deleteTodoScene,
    placesRecommendationScene,
    todosSubscribeScene,
    weatherScene,
    weatherSubscribeScene,
} from "scenes/scenes";
import telegraf from "telegraf";
import { cancelTodosScheduleJob, showTodoList } from "todoServices";
import { botUseFunction, quitScene, sendRequest } from "utils";

dotenv.config();

const {
    Telegraf,
    session,
    Scenes: { Stage },
} = telegraf;

const bot = new Telegraf(ENV_VARS.BOT_TOKEN);

bot.start(async (ctx) => {
    await botUseFunction(
        ctx,
        BOT_FUNCTION_TYPE.REPLY,
        `Welcome ${ctx.message.from.first_name ? ctx.message.from.first_name : `stranger`}!
        ${GREETING_MESSAGE}`
    );

    createDatabaseTables();
    await User.createPerson(ctx.message.from.id, ctx.message.from.first_name);
});

bot.help(async (ctx) => {
    await botUseFunction(ctx, BOT_FUNCTION_TYPE.REPLY, COMMANDS_LIST_MESSAGE);
});

bot.command(COMMANDS.DOG, async (ctx) => {
    await botUseFunction(ctx, BOT_FUNCTION_TYPE.REPLY, LOADING_MESSAGES.SEARCHING_PICTURE);

    const data = await sendRequest(ENV_VARS.RANDOM_DOG_URL, "get");

    await botUseFunction(ctx, BOT_FUNCTION_TYPE.REPLY_PHOTO, { url: data.message });
});

bot.command(COMMANDS.CAT, async (ctx) => {
    await botUseFunction(ctx, BOT_FUNCTION_TYPE.REPLY, LOADING_MESSAGES.SEARCHING_PICTURE);

    const data = await sendRequest(ENV_VARS.RANDOM_CAT_URL, "get");

    await botUseFunction(ctx, BOT_FUNCTION_TYPE.REPLY_PHOTO, { url: data[0].url });
});

weatherSubscribeScene.command(COMMANDS.QUIT, quitScene);
todosSubscribeScene.command(COMMANDS.QUIT, quitScene);
weatherScene.command(COMMANDS.QUIT, quitScene);
placesRecommendationScene.command(COMMANDS.QUIT, quitScene);
addTodoScene.command(COMMANDS.QUIT, quitScene);
deleteTodoScene.command(COMMANDS.QUIT, quitScene);

const stage = new Stage([
    weatherScene,
    placesRecommendationScene,
    weatherSubscribeScene,
    addTodoScene,
    deleteTodoScene,
    todosSubscribeScene,
]);

bot.use(session(), stage.middleware());

bot.command(COMMANDS.WEATHER, async (ctx) => {
    await botUseFunction(ctx, BOT_FUNCTION_TYPE.ENTER_SCENE, SCENE_NAMES.WEATHER_SCENE);
});

bot.command(COMMANDS.TODOS, async (ctx) => {
    await todosMenuHandler(ctx);
});

bot.command(COMMANDS.SUBSCRIBE, async (ctx) => {
    await subscribeMenuHandler(ctx);
});

bot.command(COMMANDS.PLACES, async (ctx) => {
    await botUseFunction(
        ctx,
        BOT_FUNCTION_TYPE.ENTER_SCENE,
        SCENE_NAMES.PLACES_RECOMMENDATION_SCENE
    );
});

bot.action(BUTTONS_VALUE.WEATHER_SUBSCRIBE, async (ctx) => {
    await ctx.answerCbQuery();

    await botUseFunction(ctx, BOT_FUNCTION_TYPE.ENTER_SCENE, SCENE_NAMES.WEATHER_SUBSCRIBE_SCENE);
});

bot.action(BUTTONS_VALUE.WEATHER_UNSUBSCRIBE, async (ctx) => {
    await ctx.answerCbQuery();
    cancelWeatherScheduleJob();

    await botUseFunction(ctx, BOT_FUNCTION_TYPE.REPLY, SUCCESS_MESSAGES.UNSUBSCRIBED);

    return ctx.scene.leave();
});

bot.action(BUTTONS_VALUE.SHOW_TODO_LIST, async (ctx) => {
    await ctx.answerCbQuery();
    await showTodoList(ctx, ctx.update.callback_query.from.id);
});

bot.action(BUTTONS_VALUE.ADD_TODO, async (ctx) => {
    await ctx.answerCbQuery();
    await botUseFunction(ctx, BOT_FUNCTION_TYPE.ENTER_SCENE, SCENE_NAMES.ADD_TODO_SCENE);
});

bot.action(BUTTONS_VALUE.DELETE_TODO, async (ctx) => {
    await ctx.answerCbQuery();
    await botUseFunction(ctx, BOT_FUNCTION_TYPE.ENTER_SCENE, SCENE_NAMES.DELETE_TODO_SCENE);
});

bot.action(BUTTONS_VALUE.TODO_SUBSCRIBE, async (ctx) => {
    await ctx.answerCbQuery();
    await botUseFunction(ctx, BOT_FUNCTION_TYPE.ENTER_SCENE, SCENE_NAMES.TODO_SUBSCRIBE_SCENE);
});

bot.action(BUTTONS_VALUE.TODO_UNSUBSCRIBE, async (ctx) => {
    await ctx.answerCbQuery();
    cancelTodosScheduleJob();
    await botUseFunction(ctx, BOT_FUNCTION_TYPE.REPLY, SUCCESS_MESSAGES.UNSUBSCRIBED);
});

bot.launch();

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
