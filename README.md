# Telegram Bot

## Used Technologies

Stack: NodeJs, Telegraf, PostgreSQL, axios

## Bot Features

/help - send a list with all commands

/cat - send a random photo of a cute cat

/dog - send a random photo of a cute dog

/weather - send a weather report in asked city

/subscribe - subscribe to a daily weather report

/places - receive an offer of places where to go in the specified city

/todo - get all your tasks, create or delete them, or create reminder of them

## Run Locally

Clone the project

```bash
git clone https://github.com/Pl1Fert/TelegramBot.git
```

Go to the project directory

```bash
cd TelegramBot
```

Install dependencies

```bash
npm install
```

Start the server

```bash
npm run build
npm run start
```

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

'BOT_TOKEN'

'WEATHER_API_KEY'

'TRIPMAP_API_KEY'

'PGHOST'

'PGUSER'

'PGDATABASE'

'PGPASSWORD'

'PGPORT'
