import { BOT_FUNCTION_TYPE, SUCCESS_MESSAGES } from "constants";
import { Task } from "database/db";
import { botUseFunction } from "utils";
import { ERROR_MESSAGES } from "constants";

export const addTodo = async (ctx) => {
    ctx.session.todoContent = ctx.message.text;

    try {
        await Task.createTodo(ctx.session.todoTitle, ctx.session.todoContent, ctx.message.from.id);
    } catch (error) {
        await botUseFunction(ctx, BOT_FUNCTION_TYPE.REPLY, ERROR_MESSAGES.WENT_WRONG);
        return ctx.scene.leave();
    }

    await botUseFunction(ctx, BOT_FUNCTION_TYPE.REPLY, SUCCESS_MESSAGES.ADDED);

    return ctx.scene.leave();
};
