import schedule from "node-schedule";

import { SCHEDULE_RULES } from "../constants.js";
import { DB } from "../db.js";
import { showTodoList } from "./showTodoList.js";

let SCHEDULE_JOB;

export const cancelTodosScheduleJob = () => {
    if (SCHEDULE_JOB) {
        SCHEDULE_JOB.cancel();
    }
};

export const todosSubscribeHandler = async (ctx) => {
    const userID = ctx.update.callback_query.from.id;
    const data = await DB.getUserTodos(userID);
    if (!data) {
        return;
    }

    cancelTodosScheduleJob();

    SCHEDULE_JOB = schedule.scheduleJob(SCHEDULE_RULES.forTodos, async () => {
        const data = await DB.getUserTodos(userID);

        try {
            await ctx.reply("Daily reminder!");
            await showTodoList(ctx, data);
        } catch (e) {
            console.log(e);
        }
    });

    return ctx.scene.leave();
};
