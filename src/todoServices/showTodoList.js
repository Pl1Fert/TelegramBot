import { BOT_FUNCTION_TYPE } from "../constants/constants.js";
import { botUseFunction, formatAllTodoStrings, formatTodoString } from "../utils/utils.js";

export const showTodoList = async (ctx, data) => {
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
