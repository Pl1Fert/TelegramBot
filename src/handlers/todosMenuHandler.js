import { Markup } from "telegraf";

import {
    BOT_FUNCTION_TYPE,
    BUTTONS_TEXT,
    BUTTONS_VALUE,
    TODOS_MENU_MESSAGE,
} from "../constants/index.js";
import { botUseFunction } from "../utils/index.js";

export const todosMenuHandler = async (ctx) => {
    botUseFunction(
        ctx,
        BOT_FUNCTION_TYPE.REPLY,
        TODOS_MENU_MESSAGE,
        Markup.inlineKeyboard([
            [Markup.button.callback(BUTTONS_TEXT.SHOW_TODO_LIST, BUTTONS_VALUE.SHOW_TODO_LIST)],
            [
                Markup.button.callback(BUTTONS_TEXT.ADD_TODO, BUTTONS_VALUE.ADD_TODO),
                Markup.button.callback(BUTTONS_TEXT.DELETE_TODO, BUTTONS_VALUE.DELETE_TODO),
            ],
            [
                Markup.button.callback(BUTTONS_TEXT.SUBSCRIBE, BUTTONS_VALUE.TODO_SUBSCRIBE),
                Markup.button.callback(BUTTONS_TEXT.UNSUBSCRIBE, BUTTONS_VALUE.TODO_UNSUBSCRIBE),
            ],
        ])
            .oneTime()
            .resize()
    );
};
