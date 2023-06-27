import { BOT_FUNCTION_TYPE, SUCCESS_MESSAGES } from "constants";
import { Task } from "database/db";
import { botUseFunction, isValidTaskNumber } from "utils";

export const deleteTodo = async (ctx) => {
    const taskNumber = ctx.message.text;

    if (isValidTaskNumber(taskNumber)) {
        ctx.wizard.next();
        return ctx.wizard.steps[ctx.wizard.cursor](ctx);
    }

    const data = await Task.getUserTodos(ctx.message.from.id);
    if (taskNumber > data.length) {
        ctx.wizard.next();
        return ctx.wizard.steps[ctx.wizard.cursor](ctx);
    }

    const idToDelete = data.at(taskNumber - 1).id;
    await Task.deleteTodo(idToDelete);

    await botUseFunction(ctx, BOT_FUNCTION_TYPE.REPLY, SUCCESS_MESSAGES.DELETED);

    return ctx.scene.leave();
};
