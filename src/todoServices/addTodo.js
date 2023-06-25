import { BOT_FUNCTION_TYPE } from "../constants/index.js";
import { DB } from "../database/index.js";
import { botUseFunction } from "../utils/index.js";

export const addTodo = async (ctx) => {
    ctx.session.todoContent = ctx.message.text;

    await DB.createTodo(ctx.session.todoTitle, ctx.session.todoContent, ctx.message.from.id);

    await botUseFunction(ctx, BOT_FUNCTION_TYPE.REPLY, "Added successfully!");

    return ctx.scene.leave();
};
