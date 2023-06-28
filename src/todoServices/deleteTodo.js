import { BOT_FUNCTION_TYPE, SUCCESS_MESSAGES } from "constants";
import { Task } from "database/db";
import { botUseFunction, isValidTaskNumber } from "utils";
import { ERROR_MESSAGES } from "constants";

export const deleteTodo = async (ctx) => {
    const taskNumber = ctx.message.text;

    if (!isValidTaskNumber(taskNumber)) {
        ctx.wizard.next();
        return ctx.wizard.steps[ctx.wizard.cursor](ctx);
    }
    let data = [];
    try {
        data = await Task.getUserTodos(ctx.message.from.id);
    } catch (error) {
        await botUseFunction(ctx, BOT_FUNCTION_TYPE.REPLY, ERROR_MESSAGES.WENT_WRONG);
        return ctx.scene.leave();
    }

    if (taskNumber > data.length) {
        ctx.wizard.next();
        return ctx.wizard.steps[ctx.wizard.cursor](ctx);
    }

    const idToDelete = data.at(taskNumber - 1).id;
    await Task.deleteTodo(idToDelete);

    await botUseFunction(ctx, BOT_FUNCTION_TYPE.REPLY, SUCCESS_MESSAGES.DELETED);

    return ctx.scene.leave();
};
