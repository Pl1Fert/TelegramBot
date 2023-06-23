import { Telegraf } from "telegraf";

import { botUseFunction, formatWeatherString } from "../../utils/utils.js";
import { getWeather } from "../../api/index.js";
import { BOT_FUNCTION_TYPE } from "../../constants/constants.js";

export const weatherHandler = Telegraf.on("text", async (ctx) => {
    const weatherCity = ctx.message.text;

    await botUseFunction(ctx, BOT_FUNCTION_TYPE.REPLY, "Getting info...");

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
