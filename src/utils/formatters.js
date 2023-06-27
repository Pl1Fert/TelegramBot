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
Temperature : ${temperature === 1 ? `${temperature} degree` : `${temperature} degrees`}
Feels like: ${
        feelsLikeTemperature === 1
            ? `${feelsLikeTemperature} degree`
            : `${feelsLikeTemperature} degrees`
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

    for (const string of list) {
        bufString += string;
    }

    return bufString;
};
