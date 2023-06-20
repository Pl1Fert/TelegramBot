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

export const askCity = async (ctx) => {
    try {
        await ctx.reply("Enter your city in english");
    } catch (e) {
        console.log(e);
    }

    return ctx.wizard.next();
};

export const notifyAboutError = async (ctx) => {
    try {
        await ctx.reply(`City ${ctx.message.text} not found!`);
    } catch (e) {
        console.log(e);
    }

    return ctx.scene.leave();
};
