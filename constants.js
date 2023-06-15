export const COMMANDS_LIST = `
/start - start the chat with bot
/help - list with all commands
/cat - get random cat picture
/dog - get random dog picture
/weather - get weather in your city
/places - get cool places to visit
`;

export const GET_RANDOM_DOG_URL = "https://dog.ceo/api/breeds/image/random";
export const GET_RANDOM_CAT_URL = "https://api.thecatapi.com/v1/images/search";

export const SCHEDULE_RULE = {
    second: 10,
    minute: null,
    hour: null,
    dayOfWeek: null,
    month: null,
    year: null,
    date: null,
    tz: null,
};

export const NEEDED_PLACE_PROPS = ["name", "preview", "wikipedia_extracts"];

export const PLACES_REQUEST_PARAMS = {
    limit: 15,
    radius: 2000,
    kinds: ["cultural", "natural", "fortifications", "religion", "foods", "amusements"],
    format: "json",
};
