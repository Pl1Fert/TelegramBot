import dotenv from "dotenv";

dotenv.config();

const { BOT_TOKEN } = process.env;
const { WEATHER_API_KEY } = process.env;
const { TRIPMAP_API_KEY } = process.env;
const { WEATHER_API_URL } = process.env;
const { TRIPMAP_API_URL } = process.env;
const { RANDOM_DOG_URL } = process.env;
const { RANDOM_CAT_URL } = process.env;
const { PGHOST } = process.env;
const { PGUSER } = process.env;
const { PGDATABASE } = process.env;
const { PGPASSWORD } = process.env;
const { PGPORT } = process.env;

export const ENV_VARS = {
    BOT_TOKEN,
    WEATHER_API_KEY,
    TRIPMAP_API_KEY,
    PGUSER,
    PGDATABASE,
    PGPORT,
    PGHOST,
    PGPASSWORD,
    RANDOM_DOG_URL,
    RANDOM_CAT_URL,
    WEATHER_API_URL,
    TRIPMAP_API_URL,
};
