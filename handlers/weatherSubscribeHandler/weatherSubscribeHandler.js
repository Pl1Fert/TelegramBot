import { Telegraf } from "telegraf";
import schedule from "node-schedule";

import { formatWeatherString } from "../../utils.js";
import { getWeather } from "../../getters/index.js";
import { SCHEDULE_RULE } from "../../constants.js";

let SCHEDULE_JOB;

export const cancelScheduleJob = () => {
    if (SCHEDULE_JOB) {
        SCHEDULE_JOB.cancel();
    }
};

export const weatherSubscribeHandler = Telegraf.on("text", async (ctx) => {
    const weatherCity = ctx.message.text;

    const data = await getWeather(weatherCity);
    if (!data) {
        ctx.wizard.next();
        return ctx.wizard.steps[ctx.wizard.cursor](ctx);
    }

    cancelScheduleJob();

    SCHEDULE_JOB = schedule.scheduleJob(SCHEDULE_RULE, async () => {
        const data = await getWeather(weatherCity);

        ctx.reply(
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

    try {
        await ctx.reply("Subscribed successfully!");
    } catch (e) {
        console.log(e);
    }

    return ctx.scene.leave();
});
