import telegraf from "telegraf";
const {
    Scenes: { WizardScene },
} = telegraf;

import {
    placesRecommendationHandler,
    weatherHandler,
    weatherSubscribeHandler,
} from "../handlers/index.js";
import { addTodo, deleteTodo, todosSubscribeHandler } from "../todoServices/index.js";
import {
    askCity,
    askTime,
    askTodoContent,
    askTodoNumber,
    askTodoTitle,
    notifyAboutError,
} from "../utils/utils.js";

export const weatherSubscribeScene = new WizardScene(
    "weatherSubscribeScene",
    askTime,
    askCity,
    weatherSubscribeHandler,
    notifyAboutError
);

export const todosSubscribeScene = new WizardScene(
    "todosSubscribeScene",
    askTime,
    todosSubscribeHandler,
    notifyAboutError
);

export const weatherScene = new WizardScene(
    "weatherScene",
    askCity,
    weatherHandler,
    notifyAboutError
);

export const placesRecommendationScene = new WizardScene(
    "placesRecommendationScene",
    askCity,
    placesRecommendationHandler,
    notifyAboutError
);

export const addTodoScene = new WizardScene("addTodoScene", askTodoTitle, askTodoContent, addTodo);

export const deleteTodoScene = new WizardScene(
    "deleteTodoScene",
    askTodoNumber,
    deleteTodo,
    notifyAboutError
);
