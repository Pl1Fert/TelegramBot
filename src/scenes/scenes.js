import { SCENE_NAMES } from "constants";
import { placesRecommendationHandler, weatherHandler, weatherSubscribeHandler } from "handlers";
import telegraf from "telegraf";
import { addTodo, deleteTodo, todosSubscribeHandler } from "todoServices";

import {
    askCity,
    askTime,
    askTodoContent,
    askTodoNumber,
    askTodoTitle,
    notifyAboutError,
    askCityForSubscribe,
} from "utils";

const {
    Scenes: { WizardScene },
} = telegraf;

export const weatherSubscribeScene = new WizardScene(
    SCENE_NAMES.WEATHER_SUBSCRIBE_SCENE,
    askTime,
    askCityForSubscribe,
    weatherSubscribeHandler,
    notifyAboutError
);

export const todosSubscribeScene = new WizardScene(
    SCENE_NAMES.TODO_SUBSCRIBE_SCENE,
    askTime,
    todosSubscribeHandler,
    notifyAboutError
);

export const weatherScene = new WizardScene(
    SCENE_NAMES.WEATHER_SCENE,
    askCity,
    weatherHandler,
    notifyAboutError
);

export const placesRecommendationScene = new WizardScene(
    SCENE_NAMES.PLACES_RECOMMENDATION_SCENE,
    askCity,
    placesRecommendationHandler,
    notifyAboutError
);

export const addTodoScene = new WizardScene(
    SCENE_NAMES.ADD_TODO_SCENE,
    askTodoTitle,
    askTodoContent,
    addTodo
);

export const deleteTodoScene = new WizardScene(
    SCENE_NAMES.DELETE_TODO_SCENE,
    askTodoNumber,
    deleteTodo,
    notifyAboutError
);
