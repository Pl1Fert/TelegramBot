import schedule from "node-schedule";

import { BOT_FUNCTION_TYPE } from "../constants/index.js";
import { DB } from "../database/index.js";
import { botUseFunction } from "../utils/index.js";

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

    if (hour < 0 || hour > 24 || minute < 0 || minute > 60 || !hour || !minute) {
        ctx.wizard.next();
        return ctx.wizard.steps[ctx.wizard.cursor](ctx);
    }

    const data = await DB.getUserTodos(userID);
    if (!data) {
        await botUseFunction(ctx, BOT_FUNCTION_TYPE.REPLY, "List is empty!");
        return ctx.scene.leave();
    }

    cancelTodosScheduleJob();

    SCHEDULE_JOB = schedule.scheduleJob({ hour: +hour, minute: +minute, second: 0 }, async () => {
        await botUseFunction(ctx, BOT_FUNCTION_TYPE.REPLY, "Daily reminder!");
        await showTodoList(ctx, userID);
    });

    await botUseFunction(ctx, BOT_FUNCTION_TYPE.REPLY, "Subscribed successfully!");

    return ctx.scene.leave();
};
