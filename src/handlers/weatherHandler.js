import { Telegraf } from "telegraf";

import { getWeather } from "../api/index.js";
import { BOT_FUNCTION_TYPE, LOADING_MESSAGES } from "../constants/index.js";
import { botUseFunction, formatWeatherString } from "../utils/index.js";

export const weatherHandler = Telegraf.on("text", async (ctx) => {
    const weatherCity = ctx.message.text;

    await botUseFunction(ctx, BOT_FUNCTION_TYPE.REPLY, LOADING_MESSAGES.GETTING_INFO);

    const data = await getWeather(weatherCity);
    if (!data) {
        ctx.wizard.next();
        return ctx.wizard.steps[ctx.wizard.cursor](ctx);
    }

    await botUseFunction(
        ctx,
        BOT_FUNCTION_TYPE.REPLY,
        formatWeatherString(
            data.name,
            data.weather[0].description,
            data.main.temp,
            data.main.feels_like,
            data.wind.speed,
            data.main.humidity
        )
    );

    return ctx.scene.leave();
});
