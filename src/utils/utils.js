import { BOT_FUNCTION_TYPE } from "../constants/constants.js";

export const formatPlaceDescription = (name, description = "No Description") => {
    return `
${name}

${description}`;
};

export const formatWeatherString = (
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

export const formatTodoString = (id, title, content) => {
    return `${id}. ${title}
${content}
`;
};

export const formatAllTodoStrings = (list) => {
    let bufString = "";

    for (let string of list) {
        bufString += string;
    }

    return bufString;
};

export const askCity = async (ctx) => {
    botUseFunction(ctx, BOT_FUNCTION_TYPE.REPLY, "Enter your city to get info");
    ctx.session.time = ctx.message.text;

    return ctx.wizard.next();
};

export const askTime = async (ctx) => {
    botUseFunction(
        ctx,
        BOT_FUNCTION_TYPE.REPLY,
        "Enter time to get a daily report in format: 10:21"
    );

    return ctx.wizard.next();
};

export const askTodoTitle = async (ctx) => {
    botUseFunction(ctx, BOT_FUNCTION_TYPE.REPLY, "Enter the task title");

    return ctx.wizard.next();
};

export const askTodoContent = async (ctx) => {
    ctx.session.todoTitle = ctx.message.text;

    botUseFunction(ctx, BOT_FUNCTION_TYPE.REPLY, "Enter the task content");

    return ctx.wizard.next();
};

export const askTodoNumber = async (ctx) => {
    botUseFunction(ctx, BOT_FUNCTION_TYPE.REPLY, "Enter the task number to delete");

    return ctx.wizard.next();
};

export const notifyAboutError = async (ctx) => {
    botUseFunction(ctx, BOT_FUNCTION_TYPE.REPLY, "Invalid input! Try again!");

    return ctx.scene.leave();
};

export const botUseFunction = async (ctx, func, ...content) => {
    try {
        switch (func) {
            case BOT_FUNCTION_TYPE.REPLY:
                await ctx.reply(...content);
                break;
            case BOT_FUNCTION_TYPE.ENTER_SCENE:
                await ctx.scene.enter(...content);
                break;
            case BOT_FUNCTION_TYPE.REPLY_PHOTO:
                await ctx.replyWithPhoto(...content);
                break;
            default:
                break;
        }
    } catch (e) {
        console.log(e);
    }
};

export const quitScene = async (ctx) => {
    await botUseFunction(ctx, BOT_FUNCTION_TYPE.REPLY, "quit");
    return ctx.scene.leave();
};
