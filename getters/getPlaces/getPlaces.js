import { sendRequest } from "../../axios.js";
import { PLACES_REQUEST_PARAMS } from "../../constants.js";

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
