import { BOT_FUNCTION_TYPE, ERROR_MESSAGES, SUCCESS_MESSAGES } from "../constants/index.js";
import { Task } from "../database/db.js";
import { botUseFunction } from "../utils/index.js";

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
