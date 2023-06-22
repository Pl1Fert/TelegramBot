import { Markup } from "telegraf";
import { TODOS_MENU_MESSAGE } from "../../constants.js";

export const todosMenuHandler = async (ctx) => {
    try {
        await ctx.reply(
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
        );
    } catch (e) {
        console.log(e);
    }
};
