const {
    Telegraf,
    session,
    Scenes: { WizardScene, Stage },
} = require("telegraf");
const { COMMANDS_LIST, GET_RANDOM_DOG_URL, GET_RANDOM_CAT_URL } = require("./constants.js");
const { sendRequest } = require("./sender.js");
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

//TODO: refactor to return data

bot.command("dog", async (ctx) => {
    await ctx.reply("Searching picture...");
    const response = await sendRequest(GET_RANDOM_DOG_URL, "get");
    await ctx.replyWithPhoto({ url: response.data.message });
});

bot.command("cat", async (ctx) => {
    await ctx.reply("Searching picture...");
    const response = await sendRequest(GET_RANDOM_CAT_URL, "get");
    await ctx.replyWithPhoto({ url: response.data[0].url });
});

const getWeather = async (ctx) => {
    const response = await sendRequest(
        `https://api.openweathermap.org/data/2.5/weather?q=${ctx.session.city}&lang=en&units=metric&appid=${process.env.WEATHER_API_KEY}`,
        "get"
    );
    //TODO: сделать потом обработку degree degrees
    await ctx.reply(`Weather in ${response.data.name}:
${response.data.weather[0].description}
Temperature : ${response.data.main.temp} degrees
Feels like: ${response.data.main.feels_like} degrees
Wind speed: ${response.data.wind.speed} km/h
Humidity: ${response.data.main.humidity}%`);
};

const cityHandler = Telegraf.on("text", async (ctx) => {
    ctx.session.city = ctx.message.text;
    await ctx.reply("Getting info...");
    await getWeather(ctx);

    return ctx.scene.leave();
});

const askCity = async (ctx) => {
    await ctx.reply("Enter your city in english");

    return ctx.wizard.next();
};

const weatherScene = new WizardScene("weatherScene", askCity, cityHandler);

const stage = new Stage([weatherScene], { default: "weatherScene" });
bot.use(session(), stage.middleware());

bot.command("weather", async (ctx) => {
    await ctx.scene.enter("weatherScene");
});

bot.launch();

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
