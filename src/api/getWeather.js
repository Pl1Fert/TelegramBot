import { ENV_VARS } from "../constants/index.js";
import { sendRequest } from "../utils/index.js";

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
