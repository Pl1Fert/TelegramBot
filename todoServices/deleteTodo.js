import { DB } from "../db.js";

export const deleteTodo = async (ctx) => {
    const taskNumber = ctx.message.text;

    if (taskNumber != parseInt(taskNumber) || parseInt(taskNumber) < 1) {
        ctx.wizard.next();
        return ctx.wizard.steps[ctx.wizard.cursor](ctx);
    }

    try {
        const data = await DB.getUserTodos(ctx.message.from.id);
        const idToDelete = data.at(taskNumber - 1).id;
        await DB.deleteTodo(idToDelete);
    } catch (e) {
        console.log(e);
    }

    try {
        await ctx.reply("Deleted successfully!");
    } catch (e) {
        console.log(e);
    }

    return ctx.scene.leave();
};
