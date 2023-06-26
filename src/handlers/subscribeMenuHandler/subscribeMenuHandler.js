import { Markup } from "telegraf";

import { BOT_FUNCTION_TYPE, WEATHER_SUBSCRIBE_MENU_MESSAGE } from "../../constants/index.js";
import { botUseFunction } from "../../utils/index.js";

export const subscribeMenuHandler = async (ctx) => {
    botUseFunction(
        ctx,
        BOT_FUNCTION_TYPE.REPLY,
        WEATHER_SUBSCRIBE_MENU_MESSAGE,
        Markup.inlineKeyboard([
            [
                Markup.button.callback("Subscribe", "weatherSubscribeButton"),
                Markup.button.callback("Unsubscribe", "weatherUnsubscribeButton"),
            ],
        ]).oneTime()
    );
};