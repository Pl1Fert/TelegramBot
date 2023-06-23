import { BOT_FUNCTION_TYPE } from "../constants/constants.js";
import { DB } from "../database/db.js";
import { botUseFunction } from "../utils/utils.js";

export const deleteTodo = async (ctx) => {
    const taskNumberText = ctx.message.text;
    const taskNumber = parseInt(taskNumberText);

    if (taskNumberText != taskNumber || taskNumber < 1) {
        ctx.wizard.next();
        return ctx.wizard.steps[ctx.wizard.cursor](ctx);
    }

    const data = await DB.getUserTodos(ctx.message.from.id);
    if (taskNumber > data.length) {
        ctx.wizard.next();
        return ctx.wizard.steps[ctx.wizard.cursor](ctx);
    }

    const idToDelete = data.at(taskNumber - 1).id;
    await DB.deleteTodo(idToDelete);

    await botUseFunction(ctx, BOT_FUNCTION_TYPE.REPLY, "Deleted successfully!");

    return ctx.scene.leave();
};
