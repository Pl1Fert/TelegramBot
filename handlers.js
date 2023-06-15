import { Markup, Telegraf } from "telegraf";
import schedule from "node-schedule";

import { formatPlaceDescription, formatWeatherString } from "./utils.js";
import { getPlaces, getWeather, getCityCoords } from "./getters.js";
import { SCHEDULE_RULE } from "./constants.js";

let SCHEDULE_JOB;
//TODO: попробовать через html разметку
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

//TODO: need to rename
export const userPurposeHandler = async (ctx) => {
    try {
        await ctx.reply(
            "What do u choose",
            Markup.inlineKeyboard([
                [
                    Markup.button.callback("Subscribe", "btn_1"),
                    Markup.button.callback("Unsubscribe", "btn_2"),
                ],
            ])
        );
    } catch (e) {
        console.log(e);
    }
};
