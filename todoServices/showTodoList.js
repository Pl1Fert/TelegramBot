import { formatAllTodoStrings, formatTodoString } from "../utils.js";

export const showTodoList = async (ctx, data) => {
    if (!data.length) return;

    const todoList = [];
    for (let i = 0; i < data.length; i++) {
        todoList.push(formatTodoString(i + 1, data[i].title, data[i].content));
    }

    try {
        await ctx.reply(formatAllTodoStrings(todoList));
    } catch (e) {
        console.log(e);
    }
};
