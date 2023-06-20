import { sendRequest } from "../../axios.js";

export const getWeather = async (cityName) => {
    const data = await sendRequest(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&lang=en&units=metric&appid=${process.env.WEATHER_API_KEY}`,
        "get"
    );

    if (!data) {
        return null;
    }

    return data;
};
