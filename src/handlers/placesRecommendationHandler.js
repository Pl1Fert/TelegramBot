import { Telegraf } from "telegraf";

import { getCityCoords, getPlaces } from "api";
import { BOT_FUNCTION_TYPE, LOADING_MESSAGES } from "constants";
import { botUseFunction, formatPlaceDescription } from "utils";

export const placesRecommendationHandler = Telegraf.on("text", async (ctx) => {
    const cityName = ctx.message.text;
    await botUseFunction(ctx, BOT_FUNCTION_TYPE.REPLY, LOADING_MESSAGES.GETTING_INFO);

    const coords = await getCityCoords(cityName);
    if (!coords) {
        ctx.wizard.next();
        return ctx.wizard.steps[ctx.wizard.cursor](ctx);
    }

    const data = await getPlaces(coords);

    for (const item of data) {
        const placeDescription = formatPlaceDescription(item.name, item?.wikipedia_extracts?.text);

        if (item?.preview?.source) {
            await botUseFunction(
                ctx,
                BOT_FUNCTION_TYPE.REPLY_PHOTO,
                { url: item.preview.source },
                { caption: placeDescription }
            );
        } else {
            await botUseFunction(ctx, BOT_FUNCTION_TYPE.REPLY, placeDescription);
        }
    }

    return ctx.scene.leave();
});
