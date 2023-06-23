import { Telegraf } from "telegraf";
import schedule from "node-schedule";

import { botUseFunction, formatWeatherString } from "../../utils/utils.js";
import { getWeather } from "../../api/index.js";
import { BOT_FUNCTION_TYPE } from "../../constants/constants.js";

let SCHEDULE_JOB;

export const cancelWeatherScheduleJob = () => {
    if (SCHEDULE_JOB) {
        SCHEDULE_JOB.cancel();
    }
};

export const weatherSubscribeHandler = Telegraf.on("text", async (ctx) => {
    const weatherCity = ctx.message.text;
    const [hour, minute] = ctx.session.time.split(":");

    if (hour < 0 || hour > 24 || minute < 0 || minute > 60 || !hour || !minute) {
        ctx.wizard.next();
        return ctx.wizard.steps[ctx.wizard.cursor](ctx);
    }

    const data = await getWeather(weatherCity);
    if (!data) {
        ctx.wizard.next();
        return ctx.wizard.steps[ctx.wizard.cursor](ctx);
    }

    cancelWeatherScheduleJob();

    SCHEDULE_JOB = schedule.scheduleJob({ hour: hour, minute: minute, second: 0 }, async () => {
        const data = await getWeather(weatherCity);

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
    });

    await botUseFunction(ctx, BOT_FUNCTION_TYPE.REPLY, "Subscribed successfully!");

    return ctx.scene.leave();
});
