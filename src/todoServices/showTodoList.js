import { BOT_FUNCTION_TYPE, ERROR_MESSAGES } from "constants";
import { Task } from "database/db";
import { botUseFunction, formatAllTodoStrings, formatTodoString } from "utils";

export const showTodoList = async (ctx, userID) => {
    const data = await Task.getUserTodos(userID);

    if (!data.length) {
        await botUseFunction(ctx, BOT_FUNCTION_TYPE.REPLY, ERROR_MESSAGES.EMPTY_LIST);
        return;
    }

    const todoList = [];
    for (let i = 0; i < data.length; i++) {
        todoList.push(formatTodoString(i + 1, data[i].title, data[i].content));
    }

    await botUseFunction(ctx, BOT_FUNCTION_TYPE.REPLY, formatAllTodoStrings(todoList));
};
