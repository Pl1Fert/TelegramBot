const {
    Telegraf,
    session,
    Scenes: { WizardScene, Stage },
} = require("telegraf");
const { COMMANDS_LIST, GET_RANDOM_DOG_URL, GET_RANDOM_CAT_URL } = require("./constants.js");
const { sendRequest } = require("./axios.js");
require("dotenv").config();

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
    await ctx.reply("Searching picture...");
    const data = await sendRequest(GET_RANDOM_DOG_URL, "get");

    try {
        await ctx.replyWithPhoto({ url: data.message });
    } catch (e) {
        console.log(e);
    }
});

bot.command("cat", async (ctx) => {
    await ctx.reply("Searching picture...");
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

    return data;
};

const getPlaces = async (coords) => {
    const data = await sendRequest(
        `https://api.opentripmap.com/0.1/en/places/radius?radius=2000&lon=${coords.lon}&lat=${coords.lat}&src_geom=wikidata&src_attr=wikidata&kinds=interesting_places%2Ctourist_facilities%2Camusements&format=json&limit=15&apikey=${process.env.TRIPMAP_API_KEY}
`,
        "get"
    );

    // console.log(response.data);
    // let wikidata = response.data[0].wikidata;
    // const response1 = await sendRequest(`http://www.wikidata.org/entity/${wikidata}.json`);
    // console.log(wikidata);
    // let photo = response1.data.entities[wikidata].claims["P18"][0].mainsnak.datavalue.value;
    // hashsum.string(photo, function (err, hashes) {
    //     console.log(hashes);
    //     ctx.replyWithPhoto({
    //         url: `https://upload.wikimedia.org/wikipedia/commons/${hashes.charAt(0)}/${
    //             hashes.charAt(0) + hashes.charAt(1)
    //         }/${photo}`,
    //     });
    // });

    return data.map((item) => (item.name !== "" ? item.name : null));
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
    await ctx.reply("Getting info...");
    const data = await getWeather(weatherCity);

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

    return { lon: data.lon, lat: data.lat };
};

const placesCityHandler = Telegraf.on("text", async (ctx) => {
    const placesCity = ctx.message.text;
    await ctx.reply("Getting info...");
    const coords = await getCityCoords(placesCity);
    const data = await getPlaces(coords);

    for (let item of data) {
        await ctx.reply(item);
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

const weatherScene = new WizardScene("weatherScene", askCity, weatherCityHandler);
const placesScene = new WizardScene("placesScene", askCity, placesCityHandler);

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
