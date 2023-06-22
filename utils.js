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
    try {
        await ctx.reply("Enter your city in english");
    } catch (e) {
        console.log(e);
    }

    return ctx.wizard.next();
};

export const askTodoTitle = async (ctx) => {
    try {
        await ctx.reply("Enter the task title");
    } catch (e) {
        console.log(e);
    }

    return ctx.wizard.next();
};

export const askTodoContent = async (ctx) => {
    ctx.session.todoTitle = ctx.message.text;

    try {
        await ctx.reply("Enter the task content");
    } catch (e) {
        console.log(e);
    }

    return ctx.wizard.next();
};

export const askTodoNumber = async (ctx) => {
    try {
        await ctx.reply("Enter the task number to delete");
    } catch (e) {
        console.log(e);
    }

    return ctx.wizard.next();
};

export const notifyAboutError = async (ctx) => {
    try {
        await ctx.reply(`Invalid input! Try again!`);
    } catch (e) {
        console.log(e);
    }

    return ctx.scene.leave();
};
