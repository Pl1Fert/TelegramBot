import axios from "axios";

import { BOT_FUNCTION_TYPE, ERROR_MESSAGES } from "constants";

export const botUseFunction = async (ctx, func, ...content) => {
    try {
        switch (func) {
            case BOT_FUNCTION_TYPE.REPLY:
                await ctx.reply(...content);
                break;
            case BOT_FUNCTION_TYPE.ENTER_SCENE:
                await ctx.scene.enter(...content);
                break;
            case BOT_FUNCTION_TYPE.REPLY_PHOTO:
                await ctx.replyWithPhoto(...content);
                break;
            default:
                break;
        }
    } catch (e) {
        console.log(e);
    }
};

export const notifyAboutError = async (ctx) => {
    botUseFunction(ctx, BOT_FUNCTION_TYPE.REPLY, ERROR_MESSAGES.INVALID_INPUT);

    return ctx.scene.leave();
};

export const quitScene = async (ctx) => {
    await botUseFunction(ctx, BOT_FUNCTION_TYPE.REPLY, "quit");
    return ctx.scene.leave();
};

export const randomUniqueArray = (length, max) => [
    ...new Set([...new Array(length)].map(() => Math.round(Math.random() * max))),
];

export const sendRequest = async (url, method, data) => {
    return axios({ method, url, data })
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            console.log(error.response.data);
        });
};
