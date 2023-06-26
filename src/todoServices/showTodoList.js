import { BOT_FUNCTION_TYPE } from "../constants/index.js";
import { DB } from "../database/db.js";
import { botUseFunction, formatAllTodoStrings, formatTodoString } from "../utils/index.js";

export const showTodoList = async (ctx, userID) => {
    const data = await DB.getUserTodos(userID);

    if (!data.length) {
        await botUseFunction(ctx, BOT_FUNCTION_TYPE.REPLY, "List is empty!");
        return;
    }

    const todoList = [];
    for (let i = 0; i < data.length; i++) {
        todoList.push(formatTodoString(i + 1, data[i].title, data[i].content));
    }

    await botUseFunction(ctx, BOT_FUNCTION_TYPE.REPLY, formatAllTodoStrings(todoList));
};
