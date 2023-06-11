const COMMANDS_LIST = `
/start - start the chat with bot
/help - list with all commands
/cat - get random cat picture
/dog - get random dog picture
/weather - get weather in your city
/places - get cool places to visit
`;

const GET_RANDOM_DOG_URL = "https://dog.ceo/api/breeds/image/random";
const GET_RANDOM_CAT_URL = "https://api.thecatapi.com/v1/images/search";

module.exports.COMMANDS_LIST = COMMANDS_LIST;
module.exports.GET_RANDOM_DOG_URL = GET_RANDOM_DOG_URL;
module.exports.GET_RANDOM_CAT_URL = GET_RANDOM_CAT_URL;
