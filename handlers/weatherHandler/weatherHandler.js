import { Telegraf } from "telegraf";

import { formatWeatherString } from "../../utils.js";
import { getWeather } from "../../getters/index.js";

export const weatherHandler = Telegraf.on("text", async (ctx) => {
    const weatherCity = ctx.message.text;

    try {
        await ctx.reply("Getting info...");
    } catch (e) {
        console.log(e);
    }

    const data = await getWeather(weatherCity);
    if (!data) {
        ctx.wizard.next();
        return ctx.wizard.steps[ctx.wizard.cursor](ctx);
    }

    try {
        await ctx.reply(
            formatWeatherString(
                data.name,
                data.weather[0].description,
                data.main.temp,
                data.main.feels_like,
                data.wind.speed,
                data.main.humidity
            )
        );
    } catch (e) {
        console.log(e);
    }

    return ctx.scene.leave();
});
