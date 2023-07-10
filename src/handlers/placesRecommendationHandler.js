import { Telegraf } from "telegraf";

import { getCityCoords, getPlaces } from "../api/index.js";
import { BOT_FUNCTION_TYPE, LOADING_MESSAGES } from "../constants/index.js";
import { botUseFunction, formatPlaceDescription } from "../utils/index.js";

export const placesRecommendationHandler = Telegraf.on("text", async (ctx) => {
    const cityName = ctx.message.text;
    await botUseFunction(ctx, BOT_FUNCTION_TYPE.REPLY, LOADING_MESSAGES.GETTING_INFO);

    const coords = await getCityCoords(cityName);
    if (!coords) {
        ctx.wizard.next();
        return ctx.wizard.steps[ctx.wizard.cursor](ctx);
    }

    const data = await getPlaces(coords);

    /* eslint-disable-next-line */
    for (const item of data) {
        const placeDescription = formatPlaceDescription(item.name, item?.wikipedia_extracts?.text);

        if (item?.preview?.source) {
            botUseFunction(
                ctx,
                BOT_FUNCTION_TYPE.REPLY_PHOTO,
                { url: item.preview.source },
                { caption: placeDescription }
            );
        } else {
            botUseFunction(ctx, BOT_FUNCTION_TYPE.REPLY, placeDescription);
        }
    }

    return ctx.scene.leave();
});
