import { ENV_VARS } from "myconstants";
import { sendRequest } from "utils";

export const getWeather = async (cityName) => {
    const data = await sendRequest(
        `${ENV_VARS.WEATHER_API_URL}?q=${cityName}&lang=en&units=metric&appid=${ENV_VARS.WEATHER_API_KEY}`,
        "get"
    );

    if (!data) {
        return null;
    }

    return data;
};
