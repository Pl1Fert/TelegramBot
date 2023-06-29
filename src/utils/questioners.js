import { BOT_FUNCTION_TYPE, ERROR_MESSAGES, INPUT_REQUEST_MESSAGES } from "myconstants";

import { botUseFunction } from "./utils";
import { isValidTime } from "./validators";

export const askCityForSubscribe = async (ctx) => {
    const [hour, minute] = ctx.message.text.split(":");

    if (!isValidTime(hour, minute)) {
        await botUseFunction(ctx, BOT_FUNCTION_TYPE.REPLY, ERROR_MESSAGES.INVALID_INPUT);
        return ctx.scene.leave();
    }

    ctx.session.time = ctx.message.text;
    await botUseFunction(ctx, BOT_FUNCTION_TYPE.REPLY, INPUT_REQUEST_MESSAGES.CITY_NAME);

    return ctx.wizard.next();
};

export const askCity = async (ctx) => {
    await botUseFunction(ctx, BOT_FUNCTION_TYPE.REPLY, INPUT_REQUEST_MESSAGES.CITY_NAME);

    return ctx.wizard.next();
};

export const askTime = async (ctx) => {
    await botUseFunction(ctx, BOT_FUNCTION_TYPE.REPLY, INPUT_REQUEST_MESSAGES.TIME);

    return ctx.wizard.next();
};

export const askTodoTitle = async (ctx) => {
    await botUseFunction(ctx, BOT_FUNCTION_TYPE.REPLY, INPUT_REQUEST_MESSAGES.TODO_TITLE);

    return ctx.wizard.next();
};

export const askTodoContent = async (ctx) => {
    ctx.session.todoTitle = ctx.message.text;

    await botUseFunction(ctx, BOT_FUNCTION_TYPE.REPLY, INPUT_REQUEST_MESSAGES.TODO_CONTENT);

    return ctx.wizard.next();
};

export const askTodoNumber = async (ctx) => {
    await botUseFunction(ctx, BOT_FUNCTION_TYPE.REPLY, INPUT_REQUEST_MESSAGES.TODO_NUMBER);

    return ctx.wizard.next();
};
