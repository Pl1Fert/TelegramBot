import { sendRequest } from "../../axios/axios.js";

export const getCityCoords = async (cityName) => {
    const data = await sendRequest(
        `https://api.opentripmap.com/0.1/en/places/geoname?name=${cityName}&apikey=${process.env.TRIPMAP_API_KEY}`,
        "get"
    );

    if (data.status === "NOT_FOUND") {
        return null;
    }

    return { lon: data.lon, lat: data.lat };
};
