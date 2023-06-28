export const COMMANDS_LIST_MESSAGE = `
/start - start the chat with bot
/help - list with all commands
/cat - get random cat picture
/dog - get random dog picture
/weather - get weather in your city
/places - get cool places to visit
/subscribe - subscribe to daily weather forecast
/todos - todo list with add/delete features
You can type /quit if you missclicked
`;

export const GREETING_MESSAGE = `
This bot has a lot of cool stuff. For example, you can get a random photo of a dog or a cute cat. You can also view the weather in any city and subscribe to the daily weather report. And you can also store your tasks right here, add, delete tasks.

Enter /help to see commands and goodluck!
`;

export const WEATHER_SUBSCRIBE_MENU_MESSAGE = `
This is a weather subscription menu.

You can subscribe to or unsubscribe. Just click on the buttons!
`;

export const TODOS_MENU_MESSAGE = `
This is a todos menu.

You can view the todo list or add/delete 1 your task. Or you can subscribe for daily reminder for your tasks. Just click on the buttons!
`;

export const SUCCESS_MESSAGES = {
    DELETED: "Deleted successfully!",
    ADDED: "Added successfully!",
    SUBSCRIBED: "Subscribed successfully!",
    UNSUBSCRIBED: "Unsubscribed successfully!",
};

export const LOADING_MESSAGES = {
    SEARCHING_PICTURE: "Searching picture...",
    GETTING_INFO: "Getting info...",
};

export const DAILY_REMINDER_MESSAGE = "Daily reminder!";

export const ERROR_MESSAGES = {
    EMPTY_LIST: "List is empty!",
    INVALID_INPUT: "Invalid input! Please try again!",
    WENT_WRONG: "Smething went wrong!",
};

export const INPUT_REQUEST_MESSAGES = {
    CITY_NAME: "Enter your city to get info",
    TIME: "Enter time to get a daily report in format: 10:21",
    TODO_TITLE: "Enter the task title",
    TODO_CONTENT: "Enter the task content",
    TODO_NUMBER: "Enter the task number to delete",
};
