export const COMMANDS_LIST = `
/start - start the chat with bot
/help - list with all commands
/cat - get random cat picture
/dog - get random dog picture
/weather - get weather in your city
/places - get cool places to visit
/subscribe - subscribe to daily weather forecast
/todos - todo list with add/delete features
`;

export const GREETING_MESSAGE = `
This bot has a lot of cool stuff. For example, you can get a random photo of a dog or a cute cat. You can also view the weather in any city and subscribe to the daily weather report. And you can also store your tasks right here, add, delete tasks.

Enter /help to see commands and goodluck!
`;

export const WEATHER_SUBSCRIBE_MENU_MESSAGE = `
This is a subscription menu.

You can subscribe to or unsubscribe. Just click on the buttons!
`;

export const TODOS_MENU_MESSAGE = `
This is a todos menu.

You can view the todo list or add/delete 1 your task. Just click on the buttons!
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
