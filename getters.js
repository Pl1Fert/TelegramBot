import { sendRequest } from "./axios.js";
import { NEEDED_PLACE_PROPS, PLACES_REQUEST_PARAMS } from "./constants.js";

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

export const getPlaceInfo = async (id) => {
    const obj = await sendRequest(
        `https://api.opentripmap.com/0.1/en/places/xid/${id}?apikey=${process.env.TRIPMAP_API_KEY}`,
        "get"
    );

    const pickExisting = (obj, ...keys) =>
        Object.fromEntries(keys.filter((n) => n in obj).map((n) => [n, obj[n]]));

    return pickExisting(obj, ...NEEDED_PLACE_PROPS);
};

export const getPlaces = async (coords) => {
    const data = await sendRequest(
        `https://api.opentripmap.com/0.1/en/places/radius?radius=${
            PLACES_REQUEST_PARAMS.radius
        }&lon=${coords.lon}&lat=${
            coords.lat
        }&src_geom=wikidata&src_attr=wikidata&kinds=${PLACES_REQUEST_PARAMS.kinds.join(
            "%2C"
        )}&format=${PLACES_REQUEST_PARAMS.format}&limit=${PLACES_REQUEST_PARAMS.limit}&apikey=${
            process.env.TRIPMAP_API_KEY
        }
`,
        "get"
    );

    function delay(t, data) {
        return new Promise((resolve) => {
            setTimeout(resolve.bind(null, data), t);
        });
    }

    const array = [];

    for (let item of data) {
        array.push(await getPlaceInfo(item.xid).then(delay.bind(null, 20)));
    }

    return array;
};

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
