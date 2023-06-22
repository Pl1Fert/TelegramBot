import { DB } from "../db.js";

export const addTodo = async (ctx) => {
    ctx.session.todoContent = ctx.message.text;

    try {
        await DB.createTodo(ctx.session.todoTitle, ctx.session.todoContent, ctx.message.from.id);
    } catch (e) {
        console.log(e);
    }

    try {
        await ctx.reply("Added successfully!");
    } catch (e) {
        console.log(e);
    }

    return ctx.scene.leave();
};
