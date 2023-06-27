import schedule from "node-schedule";
import { Telegraf } from "telegraf";

import { getWeather } from "api";
import { BOT_FUNCTION_TYPE, SUCCESS_MESSAGES } from "constants";
import { botUseFunction, formatWeatherString, isValidTime } from "utils";

let SCHEDULE_JOB;

export const cancelWeatherScheduleJob = () => {
    if (SCHEDULE_JOB) {
        SCHEDULE_JOB.cancel();
    }
};

export const weatherSubscribeHandler = Telegraf.on("text", async (ctx) => {
    const weatherCity = ctx.message.text;
    const [hour, minute] = ctx.session.time.split(":");

    if (isValidTime(hour, minute)) {
        ctx.wizard.next();
        return ctx.wizard.steps[ctx.wizard.cursor](ctx);
    }

    const data = await getWeather(weatherCity);
    if (!data) {
        ctx.wizard.next();
        return ctx.wizard.steps[ctx.wizard.cursor](ctx);
    }

    cancelWeatherScheduleJob();

    SCHEDULE_JOB = schedule.scheduleJob(
        { hour: +hour, minute: +minute, second: 0, tz: "Europe/Minsk" },
        async () => {
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
        }
    );

    await botUseFunction(ctx, BOT_FUNCTION_TYPE.REPLY, SUCCESS_MESSAGES.SUBSCRIBED);

    return ctx.scene.leave();
});
