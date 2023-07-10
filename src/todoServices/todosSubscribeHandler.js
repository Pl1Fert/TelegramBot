import schedule from "node-schedule";

import {
    BOT_FUNCTION_TYPE,
    DAILY_REMINDER_MESSAGE,
    ERROR_MESSAGES,
    SUCCESS_MESSAGES,
} from "../constants/index.js";
import { Task } from "../database/db.js";
import { botUseFunction, isValidTime } from "../utils/index.js";
import { showTodoList } from "./showTodoList.js";

let SCHEDULE_JOB;

export const cancelTodosScheduleJob = () => {
    if (SCHEDULE_JOB) {
        SCHEDULE_JOB.cancel();
    }
};

export const todosSubscribeHandler = async (ctx) => {
    const userID = ctx.message.from.id;
    const [hour, minute] = ctx.message.text.split(":");

    if (!isValidTime(hour, minute)) {
        ctx.wizard.next();
        return ctx.wizard.steps[ctx.wizard.cursor](ctx);
    }

    let data = [];
    try {
        data = await Task.getUserTodos(userID);
    } catch (error) {
        await botUseFunction(ctx, BOT_FUNCTION_TYPE.REPLY, ERROR_MESSAGES.WENT_WRONG);
        return ctx.scene.leave();
    }

    if (!data.length) {
        await botUseFunction(ctx, BOT_FUNCTION_TYPE.REPLY, ERROR_MESSAGES.EMPTY_LIST);
        return ctx.scene.leave();
    }

    cancelTodosScheduleJob();

    SCHEDULE_JOB = schedule.scheduleJob(
        { hour: +hour, minute: +minute, second: 0, tz: "Europe/Minsk" },
        async () => {
            await botUseFunction(ctx, BOT_FUNCTION_TYPE.REPLY, DAILY_REMINDER_MESSAGE);
            await showTodoList(ctx, userID);
        }
    );

    await botUseFunction(ctx, BOT_FUNCTION_TYPE.REPLY, SUCCESS_MESSAGES.SUBSCRIBED);

    return ctx.scene.leave();
};
