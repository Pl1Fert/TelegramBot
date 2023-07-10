import { Markup } from "telegraf";

import {
    BOT_FUNCTION_TYPE,
    BUTTONS_TEXT,
    BUTTONS_VALUE,
    WEATHER_SUBSCRIBE_MENU_MESSAGE,
} from "../constants/index.js";
import { botUseFunction } from "../utils/index.js";

export const subscribeMenuHandler = async (ctx) => {
    botUseFunction(
        ctx,
        BOT_FUNCTION_TYPE.REPLY,
        WEATHER_SUBSCRIBE_MENU_MESSAGE,
        Markup.inlineKeyboard([
            [
                Markup.button.callback(BUTTONS_TEXT.SUBSCRIBE, BUTTONS_VALUE.WEATHER_SUBSCRIBE),
                Markup.button.callback(BUTTONS_TEXT.UNSUBSCRIBE, BUTTONS_VALUE.WEATHER_UNSUBSCRIBE),
            ],
        ])
            .oneTime()
            .resize()
    );
};
