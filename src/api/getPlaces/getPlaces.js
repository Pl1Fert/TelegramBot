import { sendRequest } from "../../sender/index.js";
import { PLACES_REQUEST_PARAMS, MAX_PLACES } from "../../constants/index.js";
import { getPlaceInfo } from "../getPlaceInfo/index.js";
import { randomUniqueArray } from "../../utils/index.js";

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
    const indexArray = randomUniqueArray(5, 19);
    for (let i = 0; i < MAX_PLACES; i++) {
        array.push(await getPlaceInfo(data[indexArray[i]].xid).then(delay.bind(null, 20)));
    }

    return array;
};
