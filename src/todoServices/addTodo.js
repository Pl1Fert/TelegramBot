import { BOT_FUNCTION_TYPE, SUCCESS_MESSAGES } from "constants";
import { Task } from "database/db";
import { botUseFunction } from "utils";

export const addTodo = async (ctx) => {
    ctx.session.todoContent = ctx.message.text;

    await Task.createTodo(ctx.session.todoTitle, ctx.session.todoContent, ctx.message.from.id);

    await botUseFunction(ctx, BOT_FUNCTION_TYPE.REPLY, SUCCESS_MESSAGES.ADDED);

    return ctx.scene.leave();
};
