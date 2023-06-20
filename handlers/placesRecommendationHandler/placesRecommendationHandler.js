import { Telegraf } from "telegraf";

import { formatPlaceDescription } from "../../utils.js";
import { getPlaces, getCityCoords } from "../../getters/index.js";

export const placesRecommendationHandler = Telegraf.on("text", async (ctx) => {
    const cityName = ctx.message.text;

    try {
        await ctx.reply("Getting info...");
    } catch (e) {
        console.log(e);
    }

    const coords = await getCityCoords(cityName);
    if (!coords) {
        ctx.wizard.next();
        return ctx.wizard.steps[ctx.wizard.cursor](ctx);
    }

    const data = await getPlaces(coords);

    for (let item of data) {
        const placeDescription = formatPlaceDescription(item.name, item?.wikipedia_extracts?.text);

        if (item?.preview?.source) {
            try {
                await ctx.replyWithPhoto(
                    { url: item.preview.source },
                    { caption: placeDescription }
                );
            } catch (e) {
                console.log(e);
            }
        } else {
            try {
                await ctx.reply(placeDescription);
            } catch (e) {
                console.log(e);
            }
        }
    }

    return ctx.scene.leave();
});
