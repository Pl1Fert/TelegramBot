import pg from "pg";
const { Pool } = pg;

const pool = new Pool({
    user: process.env.PGUSER,
    password: process.env.PGPASSWROD,
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    database: process.env.PGDATABASE,
});

export class DB {
    static async createPerson(userID = null, name = "user") {
        try {
            await pool.query("INSERT INTO person (id, name) VALUES ($1, $2) RETURNING *", [
                userID,
                name,
            ]);
        } catch (error) {
            console.log(error);
        }
    }

    static async getAllUsers() {
        let users;

        try {
            users = await pool.query("SELECT * FROM person");
        } catch (error) {
            console.log(error);
        }

        return users;
    }

    static async getAllTodos() {
        let todos;

        try {
            todos = await pool.query("SELECT * FROM todo");
        } catch (error) {
            console.log(error);
        }

        return todos;
    }

    static async createTodo(title, content, userId) {
        try {
            await pool.query(
                "INSERT INTO todo (title, content, user_id) VALUES ($1, $2, $3) RETURNING *",
                [title, content, userId]
            );
        } catch (error) {
            console.log(error);
        }
    }

    static async getUserTodos(userId) {
        let todos;

        try {
            todos = await pool.query("SELECT * FROM todo WHERE user_id = $1", [userId]);
        } catch (error) {
            console.log(error);
        }

        return todos.rows;
    }

    static async deleteTodo(id) {
        try {
            await pool.query("DELETE FROM todo WHERE id = $1", [id]);
        } catch (error) {
            console.log(error);
        }
    }
}
