import { ENV_VARS, MAX_PLACES, PLACES_REQUEST_PARAMS } from "myconstants";
import { randomUniqueArray, sendRequest } from "utils";

import { getPlaceInfo } from "./getPlaceInfo";

export const getPlaces = async (coords) => {
    const placesData = await sendRequest(
        `${ENV_VARS.TRIPMAP_API_URL}/radius?radius=${PLACES_REQUEST_PARAMS.RADIUS}&lon=${
            coords.lon
        }&lat=${
            coords.lat
        }&src_geom=wikidata&src_attr=wikidata&kinds=${PLACES_REQUEST_PARAMS.KINDS.join(
            "%2C"
        )}&format=${PLACES_REQUEST_PARAMS.FORMAT}&limit=${PLACES_REQUEST_PARAMS.LIMIT}&apikey=${
            ENV_VARS.TRIPMAP_API_KEY
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
    const indexArray = randomUniqueArray(5, 19);

    for (let i = 0; i < MAX_PLACES; i += 1) {
        // eslint-disable-next-line no-await-in-loop
        array.push(await getPlaceInfo(placesData[indexArray[i]].xid).then(delay.bind(null, 20)));
    }

    return array;
};
