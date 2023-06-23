import { Markup } from "telegraf";
import { BOT_FUNCTION_TYPE, TODOS_MENU_MESSAGE } from "../../constants/constants.js";
import { botUseFunction } from "../../utils/utils.js";

export const todosMenuHandler = async (ctx) => {
    botUseFunction(
        ctx,
        BOT_FUNCTION_TYPE.REPLY,
        TODOS_MENU_MESSAGE,
        Markup.inlineKeyboard([
            [Markup.button.callback("Show list", "showListButton")],
            [
                Markup.button.callback("Add todo", "addTodoButton"),
                Markup.button.callback("Delete todo", "deleteTodoButton"),
            ],
            [
                Markup.button.callback("Subscribe", "todosSubscribeButton"),
                Markup.button.callback("Unsubscribe", "todosUnsubscribeButton"),
            ],
        ])
            .oneTime()
            .resize()
    );
};
