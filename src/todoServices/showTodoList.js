import { BOT_FUNCTION_TYPE, ERROR_MESSAGES } from "../constants/index.js";
import { Task } from "../database/db.js";
import { botUseFunction, formatTodoString } from "../utils/index.js";

export const showTodoList = async (ctx, userID) => {
    let data = [];
    try {
        data = await Task.getUserTodos(userID);
    } catch (error) {
        await botUseFunction(ctx, BOT_FUNCTION_TYPE.REPLY, ERROR_MESSAGES.WENT_WRONG);
        return;
    }

    if (!data.length) {
        await botUseFunction(ctx, BOT_FUNCTION_TYPE.REPLY, ERROR_MESSAGES.EMPTY_LIST);
        return;
    }

    const todoList = [];
    for (let i = 0; i < data.length; i += 1) {
        todoList.push(formatTodoString(i + 1, data[i].title, data[i].content));
    }

    await botUseFunction(ctx, BOT_FUNCTION_TYPE.REPLY, todoList.join(""));
};
