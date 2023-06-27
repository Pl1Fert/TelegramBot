import { ENV_VARS, NEEDED_PLACE_PROPS } from "constants";
import { sendRequest } from "utils";

export const getPlaceInfo = async (id) => {
    const data = await sendRequest(
        `${ENV_VARS.TRIPMAP_API_URL}/xid/${id}?apikey=${ENV_VARS.TRIPMAP_API_KEY}`,
        "get"
    );

    const pickExisting = (obj, ...keys) =>
        Object.fromEntries(keys.filter((n) => n in obj).map((n) => [n, obj[n]]));

    return pickExisting(data, ...NEEDED_PLACE_PROPS);
};
