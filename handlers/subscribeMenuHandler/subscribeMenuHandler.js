import { Markup } from "telegraf";
import { WEATHER_SUBSCRIBE_MENU_MESSAGE } from "../../constants.js";

export const subscribeMenuHandler = async (ctx) => {
    try {
        await ctx.reply(
            WEATHER_SUBSCRIBE_MENU_MESSAGE,
            Markup.inlineKeyboard([
                [
                    Markup.button.callback("Subscribe", "weatherSubscribeButton"),
                    Markup.button.callback("Unsubscribe", "weatherUnsubscribeButton"),
                ],
            ])
        );
    } catch (e) {
        console.log(e);
    }
};
