import telegraf from "telegraf";
const {
    Telegraf,
    session,
    Scenes: { WizardScene, Stage },
} = telegraf;
import { COMMANDS_LIST, GET_RANDOM_DOG_URL, GET_RANDOM_CAT_URL } from "./constants.js";
import { sendRequest } from "./axios.js";
import dotenv from "dotenv";
dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start(async (ctx) => {
    try {
        await ctx.reply(
            `Welcome ${ctx.message.from.first_name ? ctx.message.from.first_name : `stranger`}!`
        );
    } catch (e) {
        console.log(e);
    }
});

bot.help(async (ctx) => {
    try {
        await ctx.reply(COMMANDS_LIST);
    } catch (e) {
        console.log(e);
    }
});

bot.command("dog", async (ctx) => {
    try {
        await ctx.reply("Searching picture...");
    } catch (e) {
        console.log(e);
    }

    const data = await sendRequest(GET_RANDOM_DOG_URL, "get");

    try {
        await ctx.replyWithPhoto({ url: data.message });
    } catch (e) {
        console.log(e);
    }
});

bot.command("cat", async (ctx) => {
    try {
        await ctx.reply("Searching picture...");
    } catch (e) {
        console.log(e);
    }

    const data = await sendRequest(GET_RANDOM_CAT_URL, "get");

    try {
        await ctx.replyWithPhoto({ url: data[0].url });
    } catch (e) {
        console.log(e);
    }
});

const getWeather = async (weatherCity) => {
    const data = await sendRequest(
        `https://api.openweathermap.org/data/2.5/weather?q=${weatherCity}&lang=en&units=metric&appid=${process.env.WEATHER_API_KEY}`,
        "get"
    );

    if (!data) {
        return null;
    }

    return data;
};

const getPlaceInfo = async (id) => {
    const obj = await sendRequest(
        `https://api.opentripmap.com/0.1/en/places/xid/${id}?apikey=${process.env.TRIPMAP_API_KEY}`,
        "get"
    );

    const pickExisting = (obj, ...keys) =>
        Object.fromEntries(keys.filter((n) => n in obj).map((n) => [n, obj[n]]));

    return pickExisting(obj, "name", "preview", "wikipedia_extracts");
};

const getPlaces = async (coords) => {
    const data = await sendRequest(
        `https://api.opentripmap.com/0.1/en/places/radius?radius=2000&lon=${coords.lon}&lat=${coords.lat}&src_geom=wikidata&src_attr=wikidata&kinds=cultural%2Cnatural%2Cfortifications%2Creligion%2Cfoods%2Camusements&format=json&limit=15&apikey=${process.env.TRIPMAP_API_KEY}
`,
        "get"
    );

    function delay(t, data) {
        return new Promise((resolve) => {
            setTimeout(resolve.bind(null, data), t);
        });
    }

    const array = [];

    for (let item of data) {
        array.push(await getPlaceInfo(item.xid).then(delay.bind(null, 20)));
    }

    return array;
};

const formatWeatherString = (
    cityName,
    weatherDescription,
    temperature,
    feelsLikeTemperature,
    windSpeed,
    humidity
) => {
    return `Weather in ${cityName}:
${weatherDescription}
Temperature : ${temperature === 1 ? temperature + " degree" : temperature + " degrees"}
Feels like: ${
        feelsLikeTemperature === 1
            ? feelsLikeTemperature + " degree"
            : feelsLikeTemperature + " degrees"
    }
Wind speed: ${windSpeed} km/h
Humidity: ${humidity}%`;
};

//TODO: попробовать через html разметку
const weatherCityHandler = Telegraf.on("text", async (ctx) => {
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

const getCityCoords = async (placesCity) => {
    const data = await sendRequest(
        `https://api.opentripmap.com/0.1/en/places/geoname?name=${placesCity}&apikey=${process.env.TRIPMAP_API_KEY}`,
        "get"
    );

    if (data.status === "NOT_FOUND") {
        return null;
    }

    return { lon: data.lon, lat: data.lat };
};

const formatPlaceDescription = (name, description = "No Description") => {
    return `
${name}

${description}`;
};

const placesCityHandler = Telegraf.on("text", async (ctx) => {
    const placesCity = ctx.message.text;
    try {
        await ctx.reply("Getting info...");
    } catch (e) {
        console.log(e);
    }

    const coords = await getCityCoords(placesCity);
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

const askCity = async (ctx) => {
    try {
        await ctx.reply("Enter your city in english");
    } catch (e) {
        console.log(e);
    }

    return ctx.wizard.next();
};

const notifyAboutError = async (ctx) => {
    try {
        await ctx.reply(`City ${ctx.message.text} not found!`);
    } catch (e) {
        console.log(e);
    }

    return ctx.scene.leave();
};

const weatherScene = new WizardScene("weatherScene", askCity, weatherCityHandler, notifyAboutError);
const placesScene = new WizardScene("placesScene", askCity, placesCityHandler, notifyAboutError);

const stage = new Stage([weatherScene, placesScene]);
bot.use(session(), stage.middleware());

bot.command("weather", async (ctx) => {
    try {
        await ctx.scene.enter("weatherScene");
    } catch (e) {
        console.log(e);
    }
});

bot.command("places", async (ctx) => {
    try {
        await ctx.scene.enter("placesScene");
    } catch (e) {
        console.log(e);
    }
});

bot.launch();

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
