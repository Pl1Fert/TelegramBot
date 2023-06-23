import { sendRequest } from "../../axios/axios.js";
import { NEEDED_PLACE_PROPS } from "../../constants/constants.js";

export const getPlaceInfo = async (id) => {
    const obj = await sendRequest(
        `https://api.opentripmap.com/0.1/en/places/xid/${id}?apikey=${process.env.TRIPMAP_API_KEY}`,
        "get"
    );

    const pickExisting = (obj, ...keys) =>
        Object.fromEntries(keys.filter((n) => n in obj).map((n) => [n, obj[n]]));

    return pickExisting(obj, ...NEEDED_PLACE_PROPS);
};
