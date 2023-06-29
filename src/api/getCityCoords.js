import { ENV_VARS } from "myconstants";
import { sendRequest } from "utils";

export const getCityCoords = async (cityName) => {
    const data = await sendRequest(
        `${ENV_VARS.TRIPMAP_API_URL}/geoname?name=${cityName}&apikey=${ENV_VARS.TRIPMAP_API_KEY}`,
        "get"
    );

    if (data.status === "NOT_FOUND") {
        return null;
    }

    return { lon: data.lon, lat: data.lat };
};
